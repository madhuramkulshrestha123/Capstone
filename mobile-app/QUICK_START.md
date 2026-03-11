# SMART ROZGAAR APP - QUICK START GUIDE

## 📁 Project Structure Created

```
mobile-app/
├── SmartRozgaarApp/                    # Android Studio Project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/smartrozgaar/app/
│   │   │   │   ├── MainActivity.java          # Main WebView screen
│   │   │   │   └── SplashActivity.java        # Splash screen
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_main.xml      # WebView layout
│   │   │   │   │   └── activity_splash.xml    # Splash layout
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml             # App colors (Blue theme)
│   │   │   │   │   ├── strings.xml            # App strings
│   │   │   │   │   └── themes.xml             # Material Design theme
│   │   │   │   └── drawable/
│   │   │   │       └── splash_background.xml  # Gradient background
│   │   │   └── AndroidManifest.xml            # Permissions & config
│   │   ├── build.gradle                       # Dependencies
│   │   └── proguard-rules.pro                 # Code shrinking rules
│   ├── build.gradle                           # Project-level config
│   ├── settings.gradle                        # Gradle settings
│   └── gradle.properties                      # JVM properties
└── ANDROID_WEBVIEW_GUIDE.md                   # Complete guide
```

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Open Android Studio
1. Launch **Android Studio**
2. Click **"Open an Existing Project"**
3. Navigate to: `C:\Users\owner\Desktop\Capstone\mobile-app\SmartRozgaarApp`
4. Click **"OK"**

### Step 2: Wait for Gradle Sync
- Android Studio will automatically sync the project
- This may take 2-5 minutes on first run
- Wait until you see "BUILD SUCCESSFUL" at bottom

### Step 3: Create App Icon (Required)
You need to add your app icon images:

1. Prepare a **1024x1024 PNG** image of your logo
2. In Android Studio, right-click `res` folder
3. Select **New → Image Asset**
4. Choose your logo file
5. Click **Next → Finish**

This will create all required icon sizes in `mipmap/` folders.

### Step 4: Run the App

#### Option A: Using Emulator (Recommended for Testing)
1. Click **Tools → Device Manager**
2. Click **"Create Device"**
3. Select a phone (e.g., Pixel 6)
4. Download and select a system image (Android 13+)
5. Click **Finish**
6. Click the green **Play button** (▶️) in toolbar
7. Select your emulator
8. Wait for app to launch

#### Option B: Using Real Android Device
1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging (ON)
3. Connect phone to PC via USB
4. Click green **Play button** (▶️) in Android Studio
5. Select your device from list
6. App will install and launch

---

## 🎯 WHAT THE APP DOES

### Features Implemented:

✅ **WebView Loading**: Loads your deployed website from Vercel
✅ **JavaScript Enabled**: All interactive features work
✅ **LocalStorage**: User data persists between sessions
✅ **Geolocation**: GPS attendance marking works
✅ **File Uploads**: Camera and file picker integration
✅ **Pull to Refresh**: Swipe down to reload page
✅ **Back Navigation**: Proper browser-like back button
✅ **Splash Screen**: 2.5-second branded intro
✅ **Loading Indicator**: Progress bar while pages load
✅ **Offline Detection**: Shows error when no internet
✅ **Permissions**: Camera, Location, Storage access
✅ **Full Screen**: Immersive mobile experience

---

## 🔧 CONFIGURATION

### Web App URL
Currently set to: `https://capstone-bxz3.vercel.app/`

To change (in `MainActivity.java` line 35):
```java
private static final String WEB_APP_URL = "https://capstone-bxz3.vercel.app/";
```

### Backend API Communication
The app doesn't need backend changes. Your Next.js frontend already communicates with:
`https://capstone-backend-8k6x.onrender.com/api/v1`

All API calls continue to work as they do in the browser.

---

## 📱 BUILD APK FOR DISTRIBUTION

### Generate Debug APK (for testing)

**Method 1: Using Android Studio**
1. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. Click **"locate"** when notification appears
4. APK location: `app/build/outputs/apk/debug/app-debug.apk`

**Method 2: Using Command Line**
```bash
cd C:\Users\owner\Desktop\Capstone\mobile-app\SmartRozgaarApp
gradlew assembleDebug
```

### Generate Release APK (for production)

#### Step 1: Create Signing Key
Open Command Prompt as Administrator:

```bash
keytool -genkey -v -keystore C:\Users\owner\Desktop\Capstone\mobile-app\smartrozgaar.keystore -alias smartrozgaar -keyalg RSA -keysize 2048 -validity 10000
```

When prompted:
- Enter keystore password: `your_password`
- Re-enter password
- Enter your name
- Enter organization name
- Enter city
- Enter state
- Enter country code (IN for India)
- Confirm: `yes`

#### Step 2: Configure Signing in build.gradle
Open `app/build.gradle` and replace with:

```gradle
android {
    ...
    signingConfigs {
      release {
          storeFile file("C:\\Users\\owner\\Desktop\\Capstone\\mobile-app\\smartrozgaar.keystore")
          storePassword "your_password"
            keyAlias "smartrozgaar"
            keyPassword "your_password"
        }
    }
    buildTypes {
      release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

⚠️ **Replace `your_password` with your actual keystore password**

#### Step 3: Build Release APK

**Using Android Studio:**
1. Click **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Choose **release** variant
4. Enter keystore password
5. Click **Finish**

**Using Command Line:**
```bash
gradlew assembleRelease
```

APK location: `app/build/outputs/apk/release/app-release.apk`

---

## 📤 DISTRIBUTE YOUR APK

### Option 1: Direct APK Sharing
1. Copy APK file from:
   ```
   C:\Users\owner\Desktop\Capstone\mobile-app\SmartRozgaarApp\app\build\outputs\apk\release\
   ```
2. Share via:
   - Google Drive
   - WhatsApp
   - Email
   - USB transfer

3. Workers install by:
   - Opening APK file on their phone
   - Tapping "Install"
   - Granting "Unknown Sources" permission if asked

### Option 2: Google Play Store (Optional)
1. Create Google Play Console account ($25 one-time fee)
2. Create store listing
3. Upload signed APK
4. Fill out content rating questionnaire
5. Submit for review (1-3 days)
6. Publish to Play Store

---

## 🧪 TESTING CHECKLIST

Before distributing, test these features:

### Basic Functionality
- [ ] App launches without crashes
- [ ] Splash screen shows for 2.5 seconds
- [ ] Website loads completely
- [ ] All text and images render correctly

### Authentication
- [ ] Login page works
- [ ] OTP verification works
- [ ] Registration flow completes
- [ ] Session persists after closing app

### Core Features
- [ ] Job card application form submits
- [ ] Work demand request works
- [ ] Attendance marking with GPS works
- [ ] Payment history displays
- [ ] Profile updates work

### File Operations
- [ ] Image upload opens camera/gallery
- [ ] File selection works
- [ ] Uploaded files are sent to server

### Navigation
- [ ] Back button goes to previous page
- [ ] Double back press exits app
- [ ] Pull-to-refresh reloads page
- [ ] Links open inside app (not browser)

### Edge Cases
- [ ] Offline mode shows error message
- [ ] Reconnect restores functionality
- [ ] App resumes after phone call
- [ ] App survives screen rotation

---

## 🐛 TROUBLESHOOTING

### Issue: "Failed to resolve dependency"
**Solution:** 
1. Open`build.gradle` (project level)
2. Ensure repositories include `google()` and `mavenCentral()`
3. Sync Gradle files

### Issue: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
**Solution:**
1. Uninstall previous version from device
2. Or change version number in `app/build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.1"
   ```

### Issue: WebView shows blank screen
**Solution:**
1. Check internet connection
2. Verify URL is correct: `https://capstone-bxz3.vercel.app/`
3. Check CORS settings in backend
4. Test URL in Chrome browser

### Issue: Camera not working
**Solution:**
1. Ensure camera permission granted
2. Check Android version (Android 12+ needs special handling)
3. Test on real device (emulators may have camera issues)

### Issue: Geolocation not working
**Solution:**
1. Grant location permissions
2. Enable GPS on device
3. Set high accuracy mode
4. Test outdoors (GPS needs sky view)

---

## 📊 APP SIZE OPTIMIZATION

Current APK size: ~2-3 MB (WebView only)

To reduce size further:
1. Use Android App Bundle (.aab) instead of APK
2. Enable ProGuard code shrinking
3. Remove unused resources
4. Compress images

---

## 🔄 UPDATING YOUR APP

### Since it's a WebView app:
✅ **Website updates are instant!**

When you update your Next.js frontend on Vercel:
- Changes reflect immediately in the app
- No APK update needed
- Users see latest version on next launch

### When you DO need to update APK:
- Adding new native features
- Changing permissions
- Updating Android SDK version
- Fixing native bugs

Update process:
1. Increment version in `app/build.gradle`
2. Build new APK
3. Distribute to users

---

## 📈 ANALYTICS (Optional)

To track app usage, add Firebase Analytics:

### Add to `app/build.gradle`:
```gradle
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-analytics'
}
apply plugin: 'com.google.gms.google-services'
```

### Download `google-services.json`:
1. Go to Firebase Console
2. Create new project
3. Add Android app (package: com.smartrozgaar.app)
4. Download `google-services.json`
5. Place in `app/` folder

---

## 🎨 CUSTOMIZATION

### Change App Colors
Edit `res/values/colors.xml`:
```xml
<color name="colorPrimary">#YOUR_COLOR</color>
<color name="colorPrimaryDark">#DARKER_VERSION</color>
```

### Change App Name
Edit `res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Change Splash Duration
Edit `SplashActivity.java` line 14:
```java
private static final int SPLASH_DURATION = 3000; // 3 seconds
```

### Change Web App URL
Edit `MainActivity.java` line 35:
```java
private static final String WEB_APP_URL = "https://your-domain.com/";
```

---

## ✅ FINAL CHECKLIST

Before launching:

- [ ] App icon added (all sizes)
- [ ] App name finalized
- [ ] Colors match branding
- [ ] Tested on real devices
- [ ] All features tested
- [ ] APK signed with release key
- [ ] Version number set
- [ ] Privacy policy ready (for Play Store)
- [ ] Screenshots prepared (for Play Store)

---

## 📞 SUPPORT RESOURCES

- **Android Docs**: developer.android.com
- **WebView Guide**: developer.android.com/reference/android/webkit/WebView
- **Material Design**: material.io/design
- **Gradle Reference**: docs.gradle.org

---

## 🎉 CONGRATULATIONS!

You now have a fully functional Android app for SMART ROZGAAR PORTAL!

### What You've Built:
✅ Native Android wrapper for your web app
✅ Full-screen immersive experience
✅ Camera, GPS, file upload support
✅ Professional splash screen
✅ Offline error handling
✅ Production-ready APK

### Next Steps:
1. Test thoroughly on multiple devices
2. Gather feedback from workers
3. Iterate based on usage patterns
4. Consider adding push notifications
5. Publish to Play Store (optional)

---

**Built with ❤️ for SMART ROZGAAR PORTAL**\n**Version: 1.0 | Date: March 2026**
