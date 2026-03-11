# 📐 SMART ROZGAAR APP - ARCHITECTURE & FLOW DIAGRAMS

## 1️⃣ COMPLETE SYSTEM ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER'S ANDROID PHONE                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │        SMART ROZGAAR MOBILE APP (WebView)                    │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │                                                        │ │ │
│  │  │   WebView Component                                    │ │ │
│  │  │   - JavaScript Enabled                                 │ │ │
│  │  │   - DOM Storage Enabled                                │ │ │
│  │  │   - Geolocation Enabled                                │ │ │
│  │  │   - File Upload Support                                │ │ │
│  │  │                                                        │ │ │
│  │  │   Displays: https://capstone-bxz3.vercel.app/         │ │ │
│  │  │                                                        │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  Native Features:                                            │ │
│  │  ✓ Camera Access                                             │ │
│  │  ✓ GPS Location                                              │ │
│  │  ✓ File Storage                                              │ │
│  │  ✓ Pull-to-Refresh                                           │ │
│  │  ✓ Back Navigation                                           │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS Request
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                        VERCEL HOSTING (CDN)                        │
│                                                                    │
│  Next.js Frontend Application                                      │
│  URL: https://capstone-bxz3.vercel.app/                           │
│                                                                    │
│  Components:                                                       │
│  - React Pages                                                     │
│  - Tailwind CSS Styling                                            │
│  - Client-side Rendering                                           │
│  - Axios API Calls                                                 │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                      RENDER HOSTING (Backend)                      │
│                                                                    │
│  Node.js + Express Backend                                         │
│  URL: https://capstone-backend-8k6x.onrender.com/api/v1           │
│                                                                    │
│  Endpoints:                                                        │
│  - /users (Authentication, Profile)                                │
│  - /job-cards (Job Card Management)                                │
│  - /projects (Project Management)                                  │
│  - /attendances (Attendance Tracking)                              │
│  - /payments (Payment Processing)                                  │
│  - /work-requests (Work Demand)                                    │
│                                                                    │
│  Middleware:                                                       │
│  - JWT Authentication                                                │
│  - Rate Limiting                                                   │
│  - CORS Protection                                                 │
│  - Input Validation                                                │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                       POSTGRESQL DATABASE                          │
│                                                                    │
│  Tables:                                                           │
│  - users (User accounts & profiles)                                │
│  - job_cards (Job card registrations)                              │
│  - projects (Government projects)                                  │
│  - attendances (Worker attendance records)                         │
│  - payments (Payment transactions)                                 │
│  - work_demand_requests (Work requests)                            │
│  - job_card_applications (Pending applications)                    │
│  - otps (OTP verification codes)                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ DATA FLOW DIAGRAM

### User Login Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Opens App
     ▼
┌─────────────────────────────────┐
│   Splash Activity (2.5 sec)     │
│   - Shows logo                  │
│   - Animations                  │
└────┬────────────────────────────┘
     │ 2. Navigate to
     ▼
┌─────────────────────────────────┐
│   MainActivity (WebView)        │
│   - Loads capstone-bxz3.vercel.app
│   - Shows progress bar          │
└────┬────────────────────────────┘
     │ 3. Display
     ▼
┌─────────────────────────────────┐
│   Login Page (Next.js)          │
│   - Phone number input          │
│   - OTP request button          │
└────┬────────────────────────────┘
     │ 4. Submit Phone Number
     ▼
┌─────────────────────────────────┐
│   Backend: POST /users/login/   │
│   send-otp                      │
│   - Generate OTP                │
│   - Send SMS via Twilio         │
└────┬────────────────────────────┘
     │ 5. Return Success
     ▼
┌─────────────────────────────────┐
│   Enter OTP Screen              │
│   - 4-digit OTP input           │
│   - Verify button               │
└────┬────────────────────────────┘
     │ 6. Submit OTP
     ▼
┌─────────────────────────────────┐
│   Backend: POST /users/login/   │
│   verify-otp                    │
│   - Validate OTP                │
│   - Generate JWT Token          │
└────┬────────────────────────────┘
     │ 7. Return JWT Token
     ▼
┌─────────────────────────────────┐
│   Dashboard/Home Screen         │
│   - Store token in localStorage │
│   - Show user profile           │
│   - All features accessible     │
└─────────────────────────────────┘
```

---

## 3️⃣ ATTENDANCE MARKING FLOW (With GPS)

```
┌─────────┐
│  Worker │
└────┬────┘
     │ Opens Attendance Page
     ▼
┌─────────────────────────────────┐
│   Attendance Screen (Frontend)  │
│   - Project selector            │
│   - "Mark Attendance" button    │
│   - Location permission prompt  │
└────┬────────────────────────────┘
     │ Clicks "Mark Attendance"
     ▼
┌─────────────────────────────────┐
│   Browser Geolocation API       │
│   - Request GPS coordinates     │
│   - Get latitude & longitude    │
└────┬────────────────────────────┘
     │ Coordinates Received
     ▼
┌─────────────────────────────────┐
│   Frontend Prepares Data        │
│   {                             │
│     project_id: "xxx",          │
│     latitude: 28.6139,          │
│     longitude: 77.2090,         │
│    timestamp: "2026-03-10..."  │
│   }                             │
└────┬────────────────────────────┘
     │ POST Request
     ▼
┌─────────────────────────────────┐
│   Backend: POST /attendances    │
│   - Validate authentication     │
│   - Check project exists        │
│   - Save attendance record      │
│   - Store GPS coordinates       │
└────┬────────────────────────────┘
     │ Success Response
     ▼
┌─────────────────────────────────┐
│   Success Message               │
│   "Attendance marked successfully!"
│   - Update UI                   │
│   - Show confirmation           │
└─────────────────────────────────┘
```

---

## 4️⃣ FILE UPLOAD FLOW (Image/Documents)

```
┌─────────┐
│  User   │
└────┬────┘
     │ Clicks "Upload File" on web form
     ▼
┌─────────────────────────────────┐
│   WebChromeClient.onShowFile    │
│   Chooser()                     │
│   - Intercept file selection    │
│   - Create Android intent       │
└────┬────────────────────────────┘
     │ Launch System Picker
     ▼
┌─────────────────────────────────┐
│   Android File Picker           │
│   Options:                      │
│   - Camera                      │
│   - Gallery                     │
│   - File Manager                │
│   - Documents                   │
└────┬────────────────────────────┘
     │ User Selects File
     ▼
┌─────────────────────────────────┐
│   onActivityResult()            │
│   - Receive file URI            │
│   - Pass back to WebView        │
└────┬────────────────────────────┘
     │ File URI
     ▼
┌─────────────────────────────────┐
│   WebView File Upload           │
│   - Convert to FormData         │
│   - Attach to HTTP request      │
└────┬────────────────────────────┘
     │ POST with multipart/form-data
     ▼
┌─────────────────────────────────┐
│   Backend: Upload Endpoint      │
│   - Multer middleware           │
│   - CloudinaryService.upload()  │
│   - Upload to Cloudinary CDN    │
└────┬────────────────────────────┘
     │ Returns image_url
     ▼
┌─────────────────────────────────┐
│   Save to Database              │
│   - Store image_url in DB       │
│   - Link to user/job card       │
└────┬────────────────────────────┘
     │ Success
     ▼
┌─────────────────────────────────┐
│   Preview Image                 │
│   - Show uploaded image         │
│   - Confirm success             │
└─────────────────────────────────┘
```

---

## 5️⃣ ANDROID ACTIVITY LIFECYCLE

```
┌──────────────┐
│ App Launch   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│  SplashActivity         │
│  onCreate()             │
│  - Load splash layout   │
│  - Start animations     │
│  - Set 2.5s timer       │
└──────┬──────────────────┘
       │ Timer completes
       ▼
┌─────────────────────────┐
│  SplashActivity         │
│  onDestroy()            │
│  - Finish activity      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  MainActivity           │
│  onCreate()             │
│  - Load WebView layout  │
│  - Request permissions  │
│  - Setup WebView        │
│  - Load URL             │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  WebView Loading        │
│  - onPageStarted()      │
│  - Show progress bar    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  WebView Loaded         │
│  - onPageFinished()     │
│  - Hide progress bar    │
│  - Show website         │
└──────┬──────────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ User Browses│   │ Pull Refresh│
└─────────────┘   └─────────────┘
```

---

## 6️⃣ PERMISSION FLOW

```
┌─────────────────────────────────┐
│   App Starts (MainActivity)     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  requestNecessaryPermissions() │
│   Check Android version         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Check if permissions granted? │
└──────┬──────────────────────────┘
       │
       ├── NO ─────────────────────┐
       │                          │
       ▼                          ▼
┌─────────────────┐      ┌──────────────────┐
│ Request Runtime │      │ Continue to      │
│ Permissions     │      │ load WebView     │
│ ActivityCompat │      │                  │
└────────┬────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Permission Dialog Shown       │
│   - Camera                      │
│   - Location                    │
│   - Storage (Android ≤12)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   User Decision                 │
└──────┬──────────────────────────┘
       │
       ├── ALLOW ───────┐
       │                │
       ▼                ▼
┌─────────────┐   ┌─────────────┐
│ Grant       │   │ DENY        │
│ Permissions │   │ Show Toast  │
│ Load WebView│   │ Limited Func│
└─────────────┘   └─────────────┘
```

---

## 7️⃣ OFFLINE HANDLING

```
┌─────────────────────────────────┐
│   App Tries to Load Website     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   isNetworkAvailable()          │
│   Check ConnectivityManager     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Network Available?            │
└──────┬──────────────────────────┘
       │
       ├── YES ─────────┐
       │                │
       ▼                ▼
┌─────────────┐   ┌──────────────────┐
│ Load URL    │   │ Show Error       │
│ in WebView  │   │ - No Internet    │
│             │   │ - Retry button    │
└─────────────┘   └──────┬───────────┘
                         │
                         │ User clicks Retry
                         ▼
                  ┌──────────────────┐
                  │ Check Network    │
                  │ Again            │
                  └──────┬───────────┘
                         │
                         ├── Connected ──┐
                         │               │
                         ▼               ▼
                  ┌──────────┐   ┌──────────────┐
                  │ Load URL │   │ Show Error   │
                  │ Success  │   │ Again        │
                  └──────────┘   └──────────────┘
```

---

## 8️⃣ BACK NAVIGATION LOGIC

```
┌─────────────────────────────────┐
│   User Presses Back Button      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   onBackPressed()               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   webView.canGoBack()?          │
└──────┬──────────────────────────┘
       │
       ├── YES ─────────┐
       │                │
       ▼                ▼
┌─────────────┐   ┌──────────────────┐
│ webView.    │   │ First Time Press │
│ goBack()    │   │ Show Toast       │
│ Navigate to │   │ "Press again"    │
│ previous    │   │ Store timestamp  │
│ page        │   └──────┬───────────┘
└─────────────┘          │
                         │ Second Press (<2s)
                         ▼
                  ┌──────────────────┐
                  │ super.onBack()   │
                  │ Close App        │
                  └──────────────────┘
```

---

## 9️⃣ APK BUILD PROCESS

```
┌─────────────────────────────────┐
│   Development Complete          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Choose Build Type             │
└──────┬──────────────────────────┘
       │
       ├── Debug ─────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌────────────────────┐
│ Run:         │   │ Release Build      │
│ gradlew      │   │ 1. Create Keystore │
│ assembleDebug│   │ 2. Configure Sign  │
└──────┬───────┘   │ 3. Run: gradlew    │
       │          │   assembleRelease │
       │          └────────┬───────────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌────────────────────┐
│ Output:      │   │ Output:            │
│ app-debug.apk│   │ app-release.apk    │
│ Unsigned     │   │ Signed             │
│ For testing  │   │ For distribution   │
└──────────────┘   └────────────────────┘
```

---

## 🔟 COMPONENT INTERACTION

```
┌─────────────────────────────────────────────────────────┐
│                    ANDROID APP                          │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Splash     │────────▶│    Main      │            │
│  │  Activity    │         │   Activity   │            │
│  └──────────────┘         └──────┬───────┘            │
│                                  │                     │
│                     ┌────────────┴────────────┐       │
│                     │                         │       │
│                     ▼                         ▼       │
│            ┌──────────────┐          ┌──────────────┐ │
│            │  WebView     │          │  Permission  │ │
│            │  Component   │          │   Handler    │ │
│            └──────┬───────┘          └──────────────┘ │
│                   │                                     │
│         ┌─────────┴─────────┐                          │
│         │                   │                          │
│         ▼                   ▼                          │
│  ┌──────────────┐   ┌──────────────┐                  │
│  │  WebView     │   │  WebChrome   │                  │
│  │  Client      │   │  Client      │                  │
│  │  - Navigation│   │  - File Pick │                  │
│  │  - Progress  │   │  - Geoloc    │                  │
│  └──────────────┘   └──────────────┘                  │
└─────────────────────────────────────────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────┐
│                 NEXT.JS FRONTEND (Vercel)               │
│                                                         │
│  Pages:                                                 │
│  - Login/Register                                       │
│  - Dashboard                                            │
│  - Job Cards                                            │
│  - Projects                                             │
│  - Attendance                                           │
│  - Payments                                             │
└─────────────────────────────────────────────────────────┘
                   │
                   │ REST API
                   ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS.JS BACKEND (Render)                │
│                                                         │
│  Controllers:                                           │
│  - UserController                                       │
│  - JobCardController                                    │
│  - ProjectController                                    │
│  - AttendanceController                                 │
│  - PaymentController                                    │
└─────────────────────────────────────────────────────────┘
                   │
                   │ SQL
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                    │
│                                                         │
│  Tables: users, job_cards, projects,                    │
│          attendances, payments, work_requests           │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 SUMMARY TABLE

| Component | Technology | Hosting | Purpose |
|-----------|-----------|---------|---------|
| **Mobile App** | Android WebView | Device | Display web app as native |
| **Frontend** | Next.js 14 | Vercel | User interface & UX |
| **Backend** | Node.js + Express | Render | Business logic & API |
| **Database** | PostgreSQL | Render | Data storage |
| **SMS** | Twilio | Cloud | OTP verification |
| **Email** | Mailjet | Cloud | Transactional emails |
| **Images** | Cloudinary | CDN | File storage & optimization |
| **Auth** | JWT + reCAPTCHA | Integrated | Security & bot protection |

---

**This architecture ensures:**
✅ Seamless mobile experience
✅ Real-time data synchronization
✅ Offline error handling
✅ Full feature parity with web
✅ Easy maintenance (single codebase)
✅ Instant updates via Vercel
