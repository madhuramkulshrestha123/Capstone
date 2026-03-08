# Troubleshooting Guide - Labour Worker App

## Common Issues & Solutions

---

### 🔴 App Won't Start

#### Issue: "Module not found" error
**Solution:**
```bash
cd C:\Users\owner\Desktop\Capstone\mobile-app\labour-worker-app
npm install
```

#### Issue: "Port already in use"
**Solution:**
```bash
# Kill the process using port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port
npx expo start --port 3002
```

---

### 🔴 Can't Connect to Backend

#### Issue: "Network Error" or "Request failed with status code 500"

**Checklist:**
1. ✅ Is backend running?
   ```bash
   cd C:\Users\owner\Desktop\Capstone\backend
   npm run dev
   ```

2. ✅ Correct IP address?
   ```bash
   ipconfig
   # Update .env with correct IP
   ```

3. ✅ Same WiFi network?
   - Both phone and computer on same network
   - Try disabling mobile hotspot

4. ✅ Firewall blocking?
   ```bash
   # Temporarily disable Windows Firewall
   # Or add exception for Node.js
   ```

5. ✅ Test connection:
   ```bash
   # Open browser and go to:
   http://YOUR_IP:3000/api/user/profile
   ```

---

### 🔴 Location/GPS Issues

#### Issue: "Permission denied" or "Failed to get location"

**Solutions:**

1. **Grant Permission (Android):**
   - Settings → Apps → Expo Go → Permissions
   - Enable "Location" or "GPS"
   - Restart app

2. **Enable GPS:**
   - Swipe down from top
   - Turn on "Location"
   - Set to "High Accuracy" mode

3. **Check in App:**
   - Go to Attendance screen
   - Wait for location to load
   - If still failing, restart app

4. **Test Location:**
   ```typescript
   // Add this to check if location works
   import * as Location from 'expo-location';
   
   const testLocation = async () => {
     const { status } = await Location.requestForegroundPermissionsAsync();
     console.log('Permission:', status);
     
     if (status === 'granted') {
       const coords = await Location.getCurrentPositionAsync({});
       console.log('Location:', coords.coords);
     }
   };
   ```

---

### 🔴 Login/Authentication Issues

#### Issue: "Invalid token" or "Unauthorized"

**Solutions:**

1. **Clear Storage:**
   ```javascript
   // In browser console or React DevTools
   AsyncStorage.clear()
   ```

2. **Re-login:**
   - Logout from profile
   - Close app completely
   - Reopen and login again

3. **Check Backend Auth:**
   - Verify JWT secret in backend
   - Check token expiration time
   - Ensure worker exists in database

#### Issue: OTP not received

**Solutions:**
1. Check SMS service configuration in backend
2. Use test phone numbers
3. Check backend logs for errors
4. Use password login instead

---

### 🔴 Build Issues (APK)

#### Issue: "EAS Build failed"

**Common Causes:**

1. **Not logged in:**
   ```bash
   eas login
   ```

2. **Missing configuration:**
   ```bash
   eas build:configure
   ```

3. **Incorrect package.json:**
   - Check version number
   - Ensure all dependencies installed

4. **Network issues:**
   - Check internet connection
   - Try again later

#### Issue: "Build takes too long"

**Normal build times:**
- Development APK: ~10 minutes
- Production APK: ~15 minutes

If longer than 20 minutes, check EAS dashboard for errors.

---

### 🔴 App Crashes

#### Issue: App closes immediately

**Debug Steps:**

1. **Check Logs:**
   ```bash
   # Terminal will show error messages
   # Look for red text
   ```

2. **Common Causes:**
   - Missing environment variables
   - API_BASE_URL not set
   - TypeScript errors
   - Dependency conflicts

3. **Fix:**
   ```bash
   # Clear cache
   npx expo start -c
   
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

---

### 🔴 Performance Issues

#### Issue: App is slow or laggy

**Solutions:**

1. **Development Mode:**
   - Normal in development
   - Build APK for better performance

2. **Memory Issues:**
   ```bash
   # Clear Metro bundler cache
   npx expo start -c
   ```

3. **Too Many Features:**
   - Remove unused components
   - Optimize images
   - Use pagination for lists

---

### 🔴 Screen-Specific Issues

#### Attendance Screen
**Issue:** Can't mark attendance
- Check GPS permission ✅
- Verify project ID ✅
- Ensure internet connection ✅
- Check backend endpoint ✅

#### Work Demand Screen
**Issue:** Request fails
- Validate date format (YYYY-MM-DD) ✅
- Check worker IDs are valid ✅
- Verify project exists ✅

#### Profile Screen
**Issue:** Profile not loading
- Check authentication token ✅
- Verify backend /profile endpoint ✅
- Check internet connection ✅

---

## 🛠 Debugging Tools

### 1. React Developer Tools
```bash
npm install -g react-devtools
```
Then run:
```bash
react-devtools
```

### 2. React Native Debugger
Download from: https://github.com/jhen0409/react-native-debugger

### 3. Console Logging
Add logs to track issues:
```typescript
console.log('State:', variable);
console.log('Response:', data);
console.error('Error:', error);
```

### 4. Network Inspection
In Expo Go:
- Shake device
- Select "Debug Remote JS"
- Open Chrome DevTools
- Go to Network tab

---

## 📞 Getting Help

### Before Asking for Help:

1. ✅ Read error messages carefully
2. ✅ Check terminal output
3. ✅ Review backend logs
4. ✅ Try restarting app
5. ✅ Clear cache and reinstall

### When Asking for Help, Provide:

1. **Error Message:** Full text from terminal
2. **Steps Taken:** What you tried
3. **Environment:**
   - OS (Windows/Mac/Linux)
   - Node version: `node -v`
   - npm version: `npm -v`
   - Expo version: `npx expo --version`
4. **Screenshots:** If UI issue

---

## 🔧 Maintenance Commands

### Clear Cache
```bash
npx expo start -c
```

### Reset Everything
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Update Dependencies
```bash
npx expo install --fix
```

### Check Health
```bash
npx expo-doctor
```

---

## 📚 Additional Resources

- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- EAS Build: https://docs.expo.dev/build/introduction
- Navigation: https://reactnavigation.org

---

**Still having issues? Check the main README.md or contact support!**
