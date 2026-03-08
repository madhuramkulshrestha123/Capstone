# Quick Start Guide - Labour Worker App

## Step-by-Step Setup (5 minutes)

### 1. Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" under en0 or wlan0

### 2. Configure Backend URL

Navigate to the app folder:
```bash
cd C:\Users\owner\Desktop\Capstone\mobile-app\labour-worker-app
```

Update the API URL in `src/services/api.ts` OR create `.env` file:
```
API_BASE_URL=http://YOUR_IP:3000/api
```

Replace `YOUR_IP` with the IP from step 1.

### 3. Start Backend Server

In another terminal, make sure your backend is running:
```bash
cd C:\Users\owner\Desktop\Capstone\backend
npm run dev
```

Backend should be running on port 3000.

### 4. Start Mobile App

```bash
cd C:\Users\owner\Desktop\Capstone\mobile-app\labour-worker-app
npm start
```

You'll see a QR code in the terminal.

### 5. Test on Your Phone

**Option A: Using Expo Go (Recommended for testing)**
1. Install "Expo Go" app from Play Store
2. Open Expo Go
3. Scan QR code from terminal
4. App loads on your phone!

**Option B: Android Emulator**
```bash
npm run android
```

### 6. Login & Test

Use one of these methods:
- **OTP Login**: Enter phone number → Get OTP → Verify
- **Password Login**: Switch to password mode → Enter credentials

### 7. Build APK (When ready)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK
npm run build:apk
```

Download link will be provided. Send APK to workers!

---

## Common Issues & Solutions

### ❌ Can't connect to backend

**Solution:**
1. Check if backend is running: `http://YOUR_IP:3000`
2. Make sure IP address is correct
3. Both devices on same WiFi network
4. Disable firewall temporarily

### ❌ Location permission denied

**Solution:**
1. Go to Settings → Apps → Expo Go → Permissions
2. Enable Location
3. Restart app

### ❌ OTP not received

**Solution:**
1. Check backend SMS service configuration
2. Use test phone numbers
3. Or use password login instead

---

## Testing Checklist

✅ Backend running on port 3000
✅ IP address configured correctly
✅ Both devices on same network
✅ Location permissions granted
✅ Test user account created

---

## Next Steps After Testing

1. **Add Image Picker** for job card registration
2. **Implement Face Verification** for attendance
3. **Add Offline Mode** for poor connectivity areas
4. **Geo-fencing** to restrict attendance location
5. **Push Notifications** for updates

---

## Production Deployment

For production with Render backend:

1. Update `.env`:
```
API_BASE_URL=https://your-backend.onrender.com/api
```

2. Build APK:
```bash
eas build -p android --profile preview
```

3. Distribute APK to workers via:
   - Google Drive link
   - WhatsApp
   - Direct file transfer

Workers install APK and can use immediately!

---

**That's it! Your worker app is ready to use! 🎉**
