package com.smartrozgaar.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    // WebView and UI components
    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;

    // Web app URL
    private static final String WEB_APP_URL = "https://capstone-bxz3.vercel.app/";
    
    // File upload support
    private ValueCallback<Uri[]> fileUploadCallback;
    private static final int FILE_CHOOSER_REQUEST = 1;
    private static final int PERMISSION_REQUEST_CODE = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);

        // Request necessary permissions
       requestNecessaryPermissions();

        // Setup WebView
        setupWebView();

        // Setup SwipeRefresh
        setupSwipeRefresh();

        // Load the web application
        loadWebApp();
    }

    /**
     * Request necessary permissions for camera, location, storage
     */
    private void requestNecessaryPermissions() {
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String[] permissions = {
                Manifest.permission.CAMERA,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            };

            for (String permission: permissions) {
               if (ContextCompat.checkSelfPermission(this, permission) 
                    != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQUEST_CODE);
                }
            }
        }
    }

    /**
     * Configure WebView with all necessary settings
     */
    private void setupWebView() {
        // Enable JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage (for localStorage)
        webSettings.setDomStorageEnabled(true);
        
        // Enable database storage
        webSettings.setDatabaseEnabled(true);
        
        // Enable zoom controls
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Set viewport for mobile responsiveness
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        
        // Enable geolocation
        webSettings.setGeolocationEnabled(true);
        
        // Set cache mode for better performance
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Enable mixed content (if needed)
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Set WebViewClient to handle page navigation inside WebView
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Load all URLs inside WebView (don't open external browser)
                view.loadUrl(url);
               return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Hide progress bar when page finishes loading
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
            }
        });

        // Set WebChromeClient for advanced features
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                // Update progress bar
                progressBar.setProgress(newProgress);
               if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(
                String origin, 
                GeolocationPermissions.Callback callback) {
                // Grant geolocation permission automatically
                callback.invoke(origin, true, false);
            }

            @Override
            public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams) {
                
                // Handle file chooser
               if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                
                fileUploadCallback = filePathCallback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                
               startActivityForResult(
                    Intent.createChooser(intent, "Select File"),
                    FILE_CHOOSER_REQUEST
                );
                
               return true;
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    // Grant camera and microphone permissions for WebView
                   request.grant(request.getResources());
                });
            }
        });
    }

    /**
     * Setup SwipeRefresh layout for pull-to-refresh
     */
    private void setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener(() -> {
            webView.reload();
        });

        // Fix: Enable swipe refresh only when WebView is at the top to prevent 
        // accidental refresh while scrolling up from the middle of the page.
        webView.getViewTreeObserver().addOnScrollChangedListener(() -> {
            if (webView.getScrollY() == 0) {
                swipeRefreshLayout.setEnabled(true);
            } else {
                swipeRefreshLayout.setEnabled(false);
            }
        });
    }

    /**
     * Load the web application URL
     */
    private void loadWebApp() {
       if (!isNetworkAvailable()) {
            Toast.makeText(this, "No internet connection. Please check your network.", Toast.LENGTH_LONG).show();
           return;
        }
        
        // Clear cookies for fresh session
        CookieManager.getInstance().removeAllCookies(null);
        CookieManager.getInstance().flush();
        
        // Load the web app
        webView.loadUrl(WEB_APP_URL);
    }

    /**
     * Check if network is available
     */
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = 
            (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
       return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    /**
     * Handle back button press
     */
    @Override
    public void onBackPressed() {
       if (webView.canGoBack()) {
            webView.goBack();
        } else {
            // Show confirmation dialog on second back press
            long backPressedTime = System.currentTimeMillis();
           if (backPressedTime - lastBackPressedTime < 2000) {
                super.onBackPressed();
            } else {
                Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
            }
            lastBackPressedTime = backPressedTime;
        }
    }

    private long lastBackPressedTime= 0;

    /**
     * Handle file chooser result
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
       if (requestCode == FILE_CHOOSER_REQUEST) {
           if (fileUploadCallback == null) return;
            
            Uri[] results = null;
            
           if (resultCode == RESULT_OK && data != null) {
                String dataString= data.getDataString();
               if (dataString != null) {
                   results = new Uri[]{Uri.parse(dataString)};
                }
            }
            
            fileUploadCallback.onReceiveValue(results);
            fileUploadCallback = null;
        }
    }

    /**
     * Handle permission request result
     */
    @Override
    public void onRequestPermissionsResult(
        int requestCode,
        @NonNull String[] permissions,
        @NonNull int[] grantResults) {
        
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
       if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
               if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            
           if (!allGranted) {
                Toast.makeText(this, "Some permissions are required for full functionality", 
                    Toast.LENGTH_LONG).show();
            }
        }
    }
}
