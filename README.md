# Capstone Project - Job Portal Application

This is a full-stack Job Portal application with user authentication, job card applications, and admin management.

## Project Structure

```
.
├── backend/          # Node.js/Express backend server
├── frontend/         # Next.js frontend application
└── README.md         # This file
```

## Features

### Frontend
- Login and Registration forms with toggle functionality
- User and Admin authentication
- Responsive design using Tailwind CSS
- Built with Next.js 14 and React

### Backend
- RESTful API for job card applications
- User and Admin authentication with JWT
- MongoDB integration for data persistence
- Cloudinary integration for photo storage
- Built with Node.js and Express

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your credentials:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. The backend server will run on `http://localhost:3001`

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

The application supports multiple types of users:

1. **Workers** - Register and login with JOB CARD Number
2. **Supervisors** - Register and login with credentials
3. **Admins** - Register and login with EMPLOYMENT ID

All user types require:
- Valid credentials
- CAPTCHA verification

## API Routes

Based on my analysis of the Capstone Backend API, here are all the API routes with their complete addresses:

### Base URL

All routes are relative to: `http://localhost:3001/api/v1`

### Authentication Routes

- `POST /users/register` - Register a new user

```json
{
  "username": "adminuser",
  "email": "admin@example.com",
  "password": "StrongPass123!",
  "first_name": "Admin",
  "last_name": "User",
  "role": "ADMIN"
}
```

OR

```json
{
  "username": "supervisoruser",
  "email": "supervisor@example.com",
  "password": "StrongPass123!",
  "first_name": "Supervisor",
  "last_name": "User",
  "role": "SUPERVISOR"
}
```

- `POST /users/login` - Login user

```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

- `POST /users/refresh-token` - Refresh authentication token

### User Management Routes

- `GET /users/profile` - Get authenticated user's profile
- `PUT /users/profile` - Update authenticated user's profile
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `PUT /users/:id` - Update user by ID (Admin only)
- `DELETE /users/:id` - Delete user by ID (Admin only)

### Job Card Routes

- `POST /job-cards/register` - Register a new job card

```json
{
  "aadhaarNumber": "123456789012",
  "phoneNumber": "9876543210",
  "captchaToken": "captcha-token-here",
  "password": "StrongPass123!",
  "jobCardDetails": {
    "familyId": "FAM001",
    "headOfHouseholdName": "John Doe",
    "fatherHusbandName": "James Doe",
    "category": "OBC",
    "dateOfRegistration": "2023-01-15T00:00:00.000Z",
    "address": "123 Main Street, City",
    "village": "Sample Village",
    "panchayat": "Sample Panchayat",
    "block": "Sample Block",
    "district": "Sample District",
    "isBPL": false,
    "epicNo": "EPIC001",
    "applicants": [
      {
        "name": "John Doe",
        "gender": "Male",
        "age": 35,
        "bankDetails": "Bank of Sample, Account: 1234567890"
      },
      {
        "name": "Jane Doe",
        "gender": "Female",
        "age": 30,
        "bankDetails": "Bank of Sample, Account: 0987654321"
      }
    ]
  }
}
```

- `GET /job-cards/:id` - Get job card by ID
- `GET /job-cards/user/:userId` - Get job cards by user ID

### Project Routes

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create a new project (Admin only)
- `PUT /projects/:id` - Update project by ID (Admin only)
- `DELETE /projects/:id` - Delete project by ID (Admin only)
- `GET /projects/my/projects` - Get projects created by authenticated user
- `GET /projects/status/:status` - Get projects by status

### Work Request Routes

- `GET /work-requests` - Get all work requests (Admin only)
- `GET /work-requests/:id` - Get work request by ID (Admin only)
- `POST /work-requests` - Create a new work request (Worker only)
- `PUT /work-requests/:id` - Update work request by ID (Admin only)
- `DELETE /work-requests/:id` - Delete work request by ID (Admin only)
- `GET /work-requests/my/requests` - Get work requests by authenticated worker (Worker only)
- `GET /work-requests/project/:projectId` - Get work requests by project ID (Admin only)
- `PATCH /work-requests/:id/approve` - Approve work request (Admin only)
- `PATCH /work-requests/:id/reject` - Reject work request (Admin only)

### Attendance Routes

- `GET /attendances` - Get all attendance records (Admin only)
- `GET /attendances/:id` - Get attendance record by ID (Admin only)
- `POST /attendances` - Mark attendance (Supervisor/Admin only)
- `PUT /attendances/:id` - Update attendance record (Supervisor/Admin only)
- `DELETE /attendances/:id` - Delete attendance record (Admin only)
- `GET /attendances/my/attendances` - Get attendance records for authenticated worker (Worker only)
- `GET /attendances/project/:projectId` - Get attendance records by project ID (Supervisor/Admin only)
- `GET /attendances/project/:projectId/date-range` - Get attendance records by project and date range (Supervisor/Admin only)

### Payment Routes

- `GET /payments` - Get all payments (Admin only)
- `GET /payments/:id` - Get payment by ID (Admin only)
- `POST /payments` - Create a new payment (Admin only)
- `PUT /payments/:id` - Update payment by ID (Admin only)
- `DELETE /payments/:id` - Delete payment by ID (Admin only)
- `GET /payments/my/payments` - Get payments for authenticated worker (Worker only)
- `GET /payments/project/:projectId` - Get payments by project ID (Admin only)
- `PATCH /payments/:id/approve` - Approve payment (Admin only)
- `PATCH /payments/:id/reject` - Reject payment (Admin only)
- `PATCH /payments/:id/paid` - Mark payment as paid (Admin only)

For detailed information about each route, including required parameters and authentication requirements, please refer to the [API_ROUTES.md](backend/API_ROUTES.md) file in the project directory.

## Technologies Used

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- Cloudinary
- JWT for authentication
- Bcrypt for password hashing