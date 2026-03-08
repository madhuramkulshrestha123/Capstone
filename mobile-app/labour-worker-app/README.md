# Labour Worker Mobile App

A React Native mobile application for workers to manage attendance, request work, and track job card applications.

## Features

- **OTP/Password Login**: Secure authentication with OTP or password
- **Mark Attendance**: GPS-based attendance marking with location tracking
- **Request Work**: Submit work demand requests for projects
- **Track Applications**: Track job card application status
- **Profile Management**: View and manage worker profile

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (for building APK)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)

## Installation

1. Navigate to the project directory:
```bash
cd mobile-app/labour-worker-app
```

2. Install dependencies (already done):
```bash
npm install
```

## Configuration

### Setup Backend API URL

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your backend URL:
```
API_BASE_URL=http://YOUR_IP_ADDRESS:3000/api
```

For local development, find your IP address:
- Windows: Run `ipconfig` in terminal
- Mac/Linux: Run `ifconfig` in terminal
- Look for IPv4 Address (e.g., 192.168.1.100)

For production (Render backend):
```
API_BASE_URL=https://your-backend.onrender.com/api
```

## Running the App

### Development Mode

1. Start the development server:
```bash
npm start
```

2. Run on Android:
```bash
npm run android
```

3. Run on iOS (macOS only):
```bash
npm run ios
```

4. Run on Web:
```bash
npm run web
```

### Using Expo Go

1. Install Expo Go app on your Android/iOS device
2. Scan the QR code shown in terminal
3. App will load on your device

## Building APK

### Using EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure EAS (first time only):
```bash
eas build:configure
```

4. Build APK:
```bash
npm run build:apk
```

Or directly:
```bash
eas build -p android --profile preview
```

5. Download the APK from the provided link

### Installing APK

Send the APK file to workers. They can install it directly on their Android devices.

## Project Structure

```
labour-worker-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Login with OTP/Password
│   │   ├── HomeScreen.tsx           # Dashboard
│   │   ├── AttendanceScreen.tsx     # Mark attendance with GPS
│   │   ├── WorkDemandScreen.tsx     # Request work
│   │   ├── ProfileScreen.tsx        # User profile
│   │   └── RegisterScreen.tsx       # Job card registration
│   ├── services/
│   │   └── api.ts                   # API integration
│   └── navigation/
│       └── AppNavigator.tsx         # Navigation setup
├── App.tsx                          # Main app component
├── eas.json                         # EAS build configuration
└── package.json                     # Dependencies
```

## API Endpoints Used

### Authentication
- `POST /api/user/login/send-otp` - Send OTP
- `POST /api/user/login/verify-otp` - Verify OTP
- `POST /api/user/worker-login` - Password login

### Attendance
- `GET /api/attendance/my/attendances` - Get my attendance history
- `POST /api/attendance/mark` - Mark attendance (requires GPS)

### Work Demand
- `GET /api/work-demand/my/requests` - Get my work requests
- `POST /api/work-demand` - Create work demand request

### Job Card
- `POST /api/job-card-application/submit` - Submit application
- `GET /api/job-card-application/track/:trackingId` - Track application

### Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

## Security

- JWT token stored in AsyncStorage
- Token automatically sent with authenticated requests
- Location permission required for attendance marking
- HTTPS recommended for production

## Troubleshooting

### Network Issues

If you can't connect to backend:
1. Make sure backend is running
2. Check if IP address is correct
3. Ensure both devices are on same WiFi network
4. Try disabling firewall temporarily

### Location Permission

If attendance marking fails:
1. Grant location permission when prompted
2. Enable GPS on device
3. Check location settings accuracy

### Build Issues

If EAS build fails:
1. Check eas.json configuration
2. Ensure all dependencies are installed
3. Review build logs for specific errors

## Future Enhancements

- [ ] Face verification for attendance
- [ ] Offline attendance sync
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Image upload for job card registration
- [ ] Geo-fencing for attendance
- [ ] Work history reports
- [ ] Payment tracking

## Development Notes

- Uses TypeScript for type safety
- React Navigation for routing
- Axios for API calls
- Expo Location for GPS
- AsyncStorage for local data persistence

## Support

For issues or questions, contact the development team.
