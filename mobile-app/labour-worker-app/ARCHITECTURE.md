# System Architecture - Labour Worker App

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Workers   │  │  Supervisors │  │    Admins    │          │
│  │  (Mobile)    │  │  (Mobile/Web)│  │   (Web App)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMMUNICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              HTTPS / REST API Calls                    │     │
│  │           (JSON + JWT Authentication)                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  WebSocket   │  │ Push Notif.  │  │    SMS/OTP   │          │
│  │   (Real-time)│  │  (Firebase)  │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                     (Node.js + Express)                         │
│                    Hosted on: Render.com                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │            MIDDLEWARES                             │         │
│  ├────────────────────────────────────────────────────┤         │
│  │ • Authentication (JWT)                             │         │
│  │ • Authorization (Role-based)                       │         │
│  │ • Validation (Input schemas)                       │         │
│  │ • File Upload (Multer)                             │         │
│  │ • Error Handling                                   │         │
│  │ • Request Logging                                  │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │             CONTROLLERS                            │         │
│  ├────────────────────────────────────────────────────┤         │
│  │ • UserController                                   │         │
│  │ • AttendanceController                             │         │
│  │ • JobCardController                                │         │
│  │ • WorkDemandRequestController                      │         │
│  │ • PaymentController                                │         │
│  │ • ProjectController                                │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │              SERVICES                              │         │
│  ├────────────────────────────────────────────────────┤         │
│  │ • UserService                                      │         │
│  │ • AttendanceService                                │         │
│  │ • JobCardService                                   │         │
│  │ • EmailService                                     │         │
│  │ • SMSService                                       │         │
│  │ • CloudinaryService                                │         │
│  │ • OTPService                                       │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │               MODELS                               │         │
│  ├────────────────────────────────────────────────────┤         │
│  │ • User (Worker, Supervisor, Admin)                 │         │
│  │ • Attendance                                       │         │
│  │ • JobCard                                          │         │
│  │ • JobCardApplication                               │         │
│  │ • WorkDemandRequest                                │         │
│  │ • Project                                          │         │
│  │ • Payment                                          │         │
│  │ • OTP                                              │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│                     PostgreSQL Database                         │
│                  (Managed by Render.com)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │                 TABLES                             │         │
│  ├────────────────────────────────────────────────────┤         │
│  │ • users                                            │         │
│  │ • attendances                                      │         │
│  │ • job_cards                                        │         │
│  │ • job_card_applications                            │         │
│  │ • work_demand_requests                             │         │
│  │ • projects                                         │         │
│  │ • payments                                         │         │
│  │ • otps                                             │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Cloudinary  │  │  Twilio/     │  │  SendGrid/   │          │
│  │  (Images)    │  │  Any SMS     │  │  SMTP        │          │
│  │              │  │  Provider    │  │  (Emails)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mobile App Architecture (React Native)

```
┌─────────────────────────────────────────────────────────┐
│                  LABOUR WORKER APP                      │
│                (React Native + Expo)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │              PRESENTATION LAYER                │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │           SCREENS                    │      │     │
│  │  ├──────────────────────────────────────┤      │     │
│  │  │ • LoginScreen                        │      │     │
│  │  │ • HomeScreen (Dashboard)             │      │     │
│  │  │ • AttendanceScreen                   │      │     │
│  │  │ • WorkDemandScreen                   │      │     │
│  │  │ • ProfileScreen                      │      │     │
│  │  │ • RegisterScreen                     │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │         COMPONENTS                   │      │     │
│  │  ├──────────────────────────────────────┤      │     │
│  │  │ • WorkerCard                         │      │     │
│  │  │ • Buttons, Inputs, Cards             │      │     │
│  │  │ • Loading Indicators                 │      │     │
│  │  │ • Status Badges                      │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │       NAVIGATION                     │      │     │
│  │  ├──────────────────────────────────────┤      │     │
│  │  │ • AppNavigator.tsx                   │      │     │
│  │  │ • Stack Navigation                   │      │     │
│  │  │ • Auth Flow                          │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │              SERVICE LAYER                     │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │         api.ts                       │      │     │
│  │  ├──────────────────────────────────────┤      │     │
│  │  │ • Axios Instance                     │      │     │
│  │  │ • Token Management                   │      │     │
│  │  │ • Request/Response Interceptors      │      │     │
│  │  │ • Error Handling                     │      │     │
│  │  │                                      │      │     │
│  │  │ Methods:                             │      │     │
│  │  │ • sendLoginOtp()                     │      │     │
│  │  │ • verifyLoginOtp()                   │      │     │
│  │  │ • workerLogin()                      │      │     │
│  │  │ • getProfile()                       │      │     │
│  │  │ • markAttendance()                   │      │     │
│  │  │ • getMyAttendances()                 │      │     │
│  │  │ • createWorkDemandRequest()          │      │     │
│  │  │ • submitJobCardApplication()         │      │     │
│  │  │ • trackApplication()                 │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │            LOCAL STORAGE LAYER                 │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────────────────────────────┐      │     │
│  │  │      AsyncStorage                    │      │     │
│  │  ├──────────────────────────────────────┤      │     │
│  │  │ • userToken (JWT)                    │      │     │
│  │  │ • Offline data queue                 │      │     │
│  │  │ • User preferences                   │      │     │
│  │  └──────────────────────────────────────┘      │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │           DEVICE CAPABILITIES                  │     │
│  ├────────────────────────────────────────────────┤     │
│  │                                                 │     │
│  │  ┌──────────────┐  ┌──────────────┐           │     │
│  │  │ expo-location│  │expo-camera   │           │     │
│  │  │ (GPS/Maps)   │  │ (Selfie/QR)  │           │     │
│  │  └──────────────┘  └──────────────┘           │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Worker Login Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Worker  │      │   App   │      │ Backend │      │Database │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ Enter Phone    │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ POST /send-otp │                │
     │                │───────────────>│                │
     │                │                │ Generate OTP   │
     │                │                │───────────────>│
     │                │                │                │
     │ Receive OTP SMS│                │                │
     │<───────────────┴────────────────┴────────────────┤
     │                │                │                │
     │ Enter OTP      │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ POST /verify-otp               │
     │                │───────────────>│                │
     │                │                │ Validate OTP   │
     │                │                │───────────────>│
     │                │                │                │
     │                │                │ Return JWT     │
     │                │<───────────────│                │
     │                │                │                │
     │ Logged In     │ Store Token    │                │
     │<───────────────│───────────────>│                │
     │                │                │                │
```

### 2. Mark Attendance Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Worker  │      │   App   │      │Backend  │      │Database │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ Open Attendance│                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ Request GPS    │                │
     │                │ Permission     │                │
     │ Grant Permission               │                │
     │<──────────────>│                │                │
     │                │                │                │
     │                │ Get Location   │                │
     │                │ Coordinates    │                │
     │                │                │                │
     │ Click "Mark Attendance"        │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ POST /attendance/mark          │
     │                │ {lat, lng, project_id}         │
     │                │───────────────>│                │
     │                │                │ Save Record    │
     │                │                │───────────────>│
     │                │                │                │
     │                │ Success Response               │
     │                │<───────────────│                │
     │                │                │                │
     │ Show Success   │                │                │
     │<───────────────│                │                │
     │                │                │                │
```

### 3. Work Request Flow

```
Worker → App → Backend → Database
                 ↓
              Admin Panel
                 ↓
            Approve/Reject
                 ↓
Worker ← App ← Backend
(Notification)
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Transport Layer Security                            │
│     └─ HTTPS/TLS for all API calls                     │
│                                                          │
│  2. Authentication Layer                                │
│     └─ JWT tokens with expiration                      │
│     └─ Secure token storage (AsyncStorage)             │
│     └─ Auto-logout on token expiry                     │
│                                                          │
│  3. Authorization Layer                                 │
│     └─ Role-based access control                       │
│     └─ Middleware validation                           │
│     └─ Resource ownership checks                       │
│                                                          │
│  4. Input Validation Layer                              │
│     └─ Schema validation (Joi/Zod)                     │
│     └─ Sanitization                                    │
│     └─ SQL injection prevention                        │
│                                                          │
│  5. Data Protection Layer                               │
│     └─ Password hashing (bcrypt)                       │
│     └─ Sensitive data encryption                       │
│     └─ Environment variables                           │
│                                                          │
│  6. Device Security                                     │
│     └─ Permission-based GPS access                     │
│     └─ Secure context (Expo)                           │
│     └─ No root/jailbreak detection (future)            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  MOBILE APP                                              │
│  ┌────────────────────────────────────────────┐         │
│  │  APK File (25-30 MB)                       │         │
│  │  Distributed via:                          │         │
│  │  • Google Play Store (future)              │         │
│  │  • Direct APK download                     │         │
│  │  • Enterprise distribution                 │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  BACKEND API                                             │
│  ┌────────────────────────────────────────────┐         │
│  │  Render.com                                │         │
│  │  • Node.js Runtime                         │         │
│  │  • Auto-scaling                            │         │
│  │  • Load balancing                          │         │
│  │  • SSL certificates                        │         │
│  │  • Environment variables                   │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  DATABASE                                                │
│  ┌────────────────────────────────────────────┐         │
│  │  Render PostgreSQL (Managed)               │         │
│  │  • Automated backups                       │         │
│  │  • High availability                       │         │
│  │  • Connection pooling                      │         │
│  │  • Read replicas (future)                  │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  EXTERNAL SERVICES                                       │
│  ┌────────────────────────────────────────────┐         │
│  │  • Cloudinary (Image storage)              │         │
│  │  • Twilio/MSG91 (SMS OTP)                  │         │
│  │  • SendGrid/SMTP (Email notifications)     │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  ADMIN PANEL                                             │
│  ┌────────────────────────────────────────────┐         │
│  │  Next.js on Vercel                         │         │
│  │  • Server-side rendering                   │         │
│  │  • Static generation                       │         │
│  │  • Edge functions                          │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile Frontend** | React Native + Expo | Cross-platform mobile app |
| **Mobile Language** | TypeScript | Type-safe code |
| **Navigation** | React Navigation | Screen routing |
| **State Management** | React Hooks + AsyncStorage | Local state & persistence |
| **HTTP Client** | Axios | API communication |
| **Location** | expo-location | GPS tracking |
| **Backend** | Node.js + Express | REST API server |
| **Backend Language** | TypeScript | Type-safe backend |
| **Database** | PostgreSQL | Relational data storage |
| **ORM** | Custom SQL queries | Data access |
| **Authentication** | JWT | Token-based auth |
| **Hosting (Backend)** | Render.com | Cloud deployment |
| **Hosting (DB)** | Render PostgreSQL | Managed database |
| **Hosting (Admin)** | Vercel | Next.js deployment |
| **Image Storage** | Cloudinary | CDN & image optimization |
| **SMS Service** | Twilio/MSG91 | OTP delivery |
| **Email Service** | SendGrid/SMTP | Email notifications |

---

**This architecture provides:**
- ✅ Scalability (can handle thousands of workers)
- ✅ Security (multiple layers of protection)
- ✅ Reliability (managed services with uptime SLAs)
- ✅ Performance (optimized API calls and caching)
- ✅ Maintainability (clean separation of concerns)
- ✅ Cost-effectiveness (free tiers where possible)
