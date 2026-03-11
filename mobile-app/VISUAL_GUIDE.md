# 🎨 SMART ROZGAAR APP - VISUAL GUIDE & SCREENSHOTS

## 📱 EXPECTED APP SCREENS

### 1. Splash Screen (First 2.5 seconds)

```
┌─────────────────────────────────┐
│                                 │
│         ┌──────────┐            │
│         │          │            │
│         │   LOGO   │            │
│         │          │            │
│         └──────────┘            │
│                                 │
│    SMART ROZGAAR PORTAL        │
│                                 │
│  Empowering Unskilled Labour   │
│         Workers                 │
│                                 │
│           ⟳ Loading            │
│                                 │
│                                 │
│      Powered by Technology      │
└─────────────────────────────────┘

Background: Blue gradient (#1976D2 → #2196F3)
Text: White
Logo: Your app icon (1024x1024)
Animation: Fade in + slide up
Duration: 2.5 seconds
```

---

### 2. Main WebView - Login Page

```
┌─────────────────────────────────┐
│  Status Bar (Blue)              │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐     │
│    │                     │     │
│    │   SMART ROZGAAR     │     │
│    │      PORTAL         │     │
│    │                     │     │
│    └─────────────────────┘     │
│                                 │
│    Phone Number:                │
│    ┌─────────────────────┐     │
│    │ +91 __________      │     │
│    └─────────────────────┘     │
│                                 │
│    [ Send OTP ]                 │
│                                 │
│    Already have account?        │
│         Login                   │
│                                 │
│    Footer links...              │
└─────────────────────────────────┘

Note: This loads your actual Vercel website
WebView fills entire screen
Progress bar at top (hidden when loaded)
```

---

### 3. OTP Verification Screen

```
┌─────────────────────────────────┐
│  Status Bar                     │
├─────────────────────────────────┤
│                                 │
│    Enter OTP                   │
│                                 │
│    Sent to +91 98765XXXXX      │
│                                 │
│    ┌───┬───┬───┬───┐           │
│    │ 5 │ 2 │ 8 │ 1 │           │
│    └───┴───┴───┴───┘           │
│                                 │
│    [ Verify OTP ]               │
│                                 │
│    Resend OTP in 00:45          │
│                                 │
└─────────────────────────────────┘

OTP is auto-filled from SMS (if permission granted)
Timer counts down
```

---

### 4. Worker Dashboard

```
┌─────────────────────────────────┐
│  ≡  SMART ROZGAAR       👤     │
├─────────────────────────────────┤
│                                 │
│  Welcome, Rajesh Kumar          │
│  Job Card: ABVB018451           │
│                                 │
│  ┌──────────┐ ┌──────────┐    │
│  │          │ │          │    │
│  │ Mark     │ │ View     │    │
│  │ Attendance│ │ Payments │    │
│  │          │ │          │    │
│  └──────────┘ └──────────┘    │
│                                 │
│  ┌──────────┐ ┌──────────┐    │
│  │          │ │          │    │
│  │ Work     │ │ My       │    │
│  │ Request  │ │ Profile  │    │
│  │          │ │          │    │
│  └──────────┘ └──────────┘    │
│                                 │
│  Recent Activity:               │
│  • Attendance marked - Today   │
│  • Payment received - ₹5,000   │
│  • Project assigned - Road     │
│                                 │
└─────────────────────────────────┘

Pull down to refresh (swipe gesture)
All buttons are clickable
Navigation works within WebView
```

---

### 5. Attendance Marking with GPS

```
┌─────────────────────────────────┐
│  ←  Mark Attendance             │
├─────────────────────────────────┤
│                                 │
│  Select Project:                │
│  ┌─────────────────────┐       │
│  │ Village Road Const. │ ▼    │
│  └─────────────────────┘       │
│                                 │
│  Location:                      │
│  📍 28.6139° N, 77.2090° E     │
│                                 │
│  Accuracy: ±5 meters            │
│                                 │
│  ⚠️ Please enable GPS           │
│                                 │
│  [ Mark Attendance ]            │
│                                 │
│  ℹ️ Attendance will be recorded │
│     with current location       │
│                                 │
└─────────────────────────────────┘

GPS coordinates auto-detected
Permission prompt shown first time
Location accuracy displayed
```

---

### 6. File Upload Dialog

```
┌─────────────────────────────────┐
│                                 │
│      Select File From:          │
│                                 │
│    ┌─────────────────────┐     │
│    │ 📷 Camera           │     │
│    └─────────────────────┘     │
│                                 │
│    ┌─────────────────────┐     │
│    │ 🖼️ Gallery          │     │
│    └─────────────────────┘     │
│                                 │
│    ┌─────────────────────┐     │
│    │ 📁 File Manager     │     │
│    └─────────────────────┘     │
│                                 │
│    ┌─────────────────────┐     │
│    │ 📄 Documents        │     │
│    └─────────────────────┘     │
│                                 │
│         [ Cancel ]              │
│                                 │
└─────────────────────────────────┘

Native Android file picker
Supports multiple sources
User can choose camera or files
```

---

### 7. Progress Loading Indicator

```
┌─────────────────────────────────┐
│  Status Bar                     │
├─────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  45%     │
├─────────────────────────────────┤
│                                 │
│         Loading Page...         │
│                                 │
│    ┌─────────────────────┐     │
│    │                     │     │
│    │   Website Content   │     │
│    │   (partially        │     │
│    │    visible)         │     │
│    │                     │     │
│    └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘

Progress bar at top shows loading %
Disappears when page fully loads
Horizontal bar style
```

---

### 8. Offline Error Screen

```
┌─────────────────────────────────┐
│                                 │
│         ┌──────────┐            │
│         │    📵    │            │
│         └──────────┘            │
│                                 │
│    No Internet Connection       │
│                                 │
│  Please check your network      │
│  and try again                  │
│                                 │
│                                 │
│      ┌──────────────┐          │
│      │    RETRY     │          │
│      └──────────────┘          │
│                                 │
│                                 │
└─────────────────────────────────┘

Shown when no internet detected
Retry button checks connection again
Icon: No internet symbol
```

---

### 9. Back Button Behavior

```
Scenario 1: Can go back in history
┌─────────────────────────────────┐
│  User on: Job Card Details      │
│                                 │
│  Presses BACK button            │
│         ↓                       │
│  Goes to: Previous page         │
│  (Job Cards list)               │
└─────────────────────────────────┘

Scenario 2: Cannot go back
┌─────────────────────────────────┐
│  User on: Home/Dashboard        │
│                                 │
│  First BACK press:              │
│  Toast: "Press back again to exit"
│                                 │
│  Second BACK press (<2 sec):    │
│  App closes                     │
└─────────────────────────────────┘

Browser-like navigation
History stack maintained
```

---

## 🎨 COLOR SCHEME

### Primary Colors
```
ColorPrimary:       #2196F3 (Blue)
ColorPrimaryDark:   #1976D2 (Dark Blue)
ColorAccent:        #FFC107 (Amber)
White:              #FFFFFF
Black:              #000000
```

### Splash Screen Gradient
```
Start: #1976D2 (Dark Blue)
End:   #2196F3 (Blue)
Angle: 135 degrees (diagonal)
```

### Material Design Theme
```
Primary:   Blue (#2196F3)
Secondary: Amber (#FFC107)
Background: White (#FFFFFF)
Text: Black (#000000)
StatusBar: Dark Blue (#1976D2)
```

---

## 📐 LAYOUT SPECIFICATIONS

### Splash Screen Layout
```xml
Container: RelativeLayout(match_parent)
Background: splash_background.xml (gradient)

Logo:
  - Size: 150dp x 150dp
  - Position: Center
  - Source: @mipmap/ic_launcher

App Name:
  - Size: wrap_content
  - Font: 24sp, bold
  - Color: #FFFFFF
  - Position: Below logo (20dp margin)

Tagline:
  - Size: wrap_content
  - Font: 16sp
  - Color: #E0E0E0
  - Position: Below app name (10dp margin)

Loading Indicator:
  - Size: 40dp x 40dp
  - Color: #FFFFFF
  - Position: Below tagline (30dp margin)

Bottom Text:
  - Size: wrap_content
  - Font: 14sp
  - Color: #BDBDBD
  - Position: Bottom center(30dp margin)
```

### Main Activity Layout
```xml
Container: SwipeRefreshLayout (match_parent)

WebView:
  - Size: match_parent
  - Position: Fill container

ProgressBar:
  - Style: Horizontal
  - Height: 3dp
  - Position: Top of screen
  - Indeterminate: true

Loading Container:
  - Position: Center of screen
  - Initially: GONE (hidden)
  - Shows: Spinner + "Loading..." text
```

---

## 🔄 USER FLOW DIAGRAM

```
┌────────────┐
│ User Taps  │
│ App Icon   │
└─────┬──────┘
      │
      ▼
┌─────────────────┐
│ Splash Screen   │
│ (2.5 seconds)   │
│ - Logo fade in  │
│ - Text slide up │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ MainActivity    │
│ - WebView init  │
│ - Load URL      │
│ - Show progress │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Website Loads   │
│ (Vercel URL)    │
│ - Next.js app   │
│ - Login page    │
└─────┬───────────┘
      │
      ├──────────────┐
      │              │
      ▼              ▼
┌──────────┐  ┌──────────┐
│ New User │  │Existing  │
│ Register │  │  User    │
└────┬─────┘  └────┬─────┘
     │             │
     │ Send OTP   │ Enter OTP
     ▼             ▼
┌──────────────────────────┐
│     Complete Auth        │
│   (JWT stored in local)  │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│ All features    │
│ accessible      │
└─────────────────┘
```

---

## 📊 PERMISSION REQUESTS

### Runtime Permission Flow

```
┌─────────────────────────────────┐
│  App launches for first time    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Check permissions in code      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  System shows permission dialog │
│                                 │
│  "Allow Smart Rozgaar to:"      │
│  ✓ Access this device's location│
│  ✓ Take pictures and record video│
│                                 │
│  [ Allow ]  [ Deny ]            │
└──────┬──────────────────────────┘
       │
       ├── User Allows ──────┐
       │                     │
       ▼                     ▼
┌──────────────┐     ┌──────────────┐
│ Grant access │     │ Show toast   │
│ Continue     │     │ Limited func │
│ normal flow  │     │ Some features│
│              │     │ unavailable  │
└──────────────┘     └──────────────┘
```

---

## 🎯 KEY INTERACTIONS

### Pull to Refresh
```
User Action: Swipe down from top
Visual: Circular progress indicator at top
Result: WebView.reload() - page refreshes
Release: Snaps back to original position
```

### File Upload
```
User Action: Click upload button
System: Shows file picker dialog
Options: Camera, Gallery, File Manager
Selection: File chosen
Upload: FormData sent to backend
Feedback: Success/error message
```

### GPS Location
```
User Action: Navigate to attendance page
System: Request location permission
If Allowed: Get GPS coordinates
Display: Show lat/long on screen
Submit: Send coordinates with attendance
```

### Back Navigation
```
User Action: Press hardware/software back button
Logic:
  - If webView.canGoBack(): go to previous page
  - Else: Show "Press again to exit" toast
  - If pressed again within 2s: Exit app
```

---

## 📱 DEVICE COMPATIBILITY

### Supported Devices
```
Minimum SDK: Android 7.0 (API 24)
Target SDK:  Android 14 (API 34)

Supported Versions:
✓ Android 7.0 Nougat (API 24)
✓ Android 8.0 Oreo (API 26)
✓ Android 9.0 Pie (API 28)
✓ Android 10 (API 29)
✓ Android 11 (API 30)
✓ Android 12 (API 31-32)
✓ Android 13 (API 33)
✓ Android 14 (API 34)

Screen Sizes:
✓ Small phones (4.5")
✓ Medium phones (5.5"-6.0")
✓ Large phones (6.5"+)
✓ Tablets (7"-10")
```

---

## 🔋 PERFORMANCE METRICS

### Expected Performance
```
App Launch Time: < 2 seconds
Splash Duration: 2.5 seconds
Page Load: Depends on network (typically 1-3s)
Memory Usage: ~50-100 MB
CPU Usage: < 10% (idle), < 30% (active)
Battery Impact: Low (WebView optimized)
Network Usage: Same as Chrome browser
Storage: 2-3 MB (APK), 10-15 MB (installed)
```

---

## 🎨 MATERIAL DESIGN GUIDELINES

### Following Material Design 3.0
```
Components:
- Buttons: Raised with shadow
- Input Fields: Outlined style
- Progress: Linear indicators
- Navigation: Bottom bars (if needed)
- Cards: Elevated surfaces

Typography:
- Headings: Roboto Bold 24sp
- Body: Roboto Regular 16sp
- Captions: Roboto Light 14sp

Spacing:
- Margins: 16dp (standard)
- Padding: 8dp, 16dp, 24dp
- Grid: 8dp baseline
```

---

## 📸 MOCKUP GENERATION

### To Create Visual Mockups:

1. **Use Android Studio Layout Inspector**
   - Run app on emulator
   - Tools → Layout Inspector
   - Capture screenshots

2. **Use Online Tools**
   - mockuphone.com (free phone frames)
   - placeit.net(professional mockups)
   - smartmockups.com (various devices)

3. **Screenshot Process**
   - Emulator: Screenshot button in toolbar
   - Real device: Power + Volume Down
   - ADB: adb shell screencap -p /sdcard/screenshot.png

---

This visual guide helps you understand what the app will look like and how users will interact with it!
