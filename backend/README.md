# Capstone Backend API

## Overview

This is the backend API for the Capstone project, implementing a role-based system for managing workers and administrators in a work management system.

## Role-Based Access Control

The system implements three distinct user roles:

1. **Worker (WORKER)**: Registers once, asks for work, attends, gets paid in bank
2. **Admin (ADMIN)**: Manages the system, marks digital attendance at the site
3. **Admin (ADMIN)**: Creates projects and approves payments online

For detailed information about the role-based access control system, see [Role-Based Access Control Documentation](docs/role-based-access-control.md).

## Features

- User authentication and authorization with JWT
- Role-based access control
- Project management
- Work demand requests
- Attendance tracking
- Payment processing
- Job card management
- Image upload and storage with Cloudinary

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/refresh-token` - Refresh authentication token

### User Management
- `GET /api/v1/users/profile` - Get authenticated user's profile
- `PUT /api/v1/users/profile` - Update authenticated user's profile (supports image upload)
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `PUT /api/v1/users/:id` - Update user by ID (Admin only, supports image upload)
- `DELETE /api/v1/users/:id` - Delete user by ID (Admin only)

### Project Management
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get project by ID
- `POST /api/v1/projects` - Create a new project (Admin only)
- `PUT /api/v1/projects/:id` - Update project by ID (Admin only)
- `DELETE /api/v1/projects/:id` - Delete project by ID (Admin only)
- `GET /api/v1/projects/my/projects` - Get projects created by authenticated user
- `GET /api/v1/projects/status/:status` - Get projects by status

### Work Demand Requests
- `GET /api/v1/work-requests` - Get all work requests (Admin only)
- `GET /api/v1/work-requests/:id` - Get work request by ID (Admin only)
- `POST /api/v1/work-requests` - Create a new work request (Worker only)
- `PUT /api/v1/work-requests/:id` - Update work request by ID (Admin only)
- `DELETE /api/v1/work-requests/:id` - Delete work request by ID (Admin only)
- `GET /api/v1/work-requests/my/requests` - Get work requests by authenticated worker (Worker only)
- `GET /api/v1/work-requests/project/:projectId` - Get work requests by project ID (Admin only)
- `PATCH /api/v1/work-requests/:id/approve` - Approve work request (Admin only)
- `PATCH /api/v1/work-requests/:id/reject` - Reject work request (Admin only)

### Attendance Management
- `GET /api/v1/attendances` - Get all attendance records (Admin only)
- `GET /api/v1/attendances/:id` - Get attendance record by ID (Admin only)
- `POST /api/v1/attendances` - Mark attendance (Admin only)
- `PUT /api/v1/attendances/:id` - Update attendance record (Admin only)
- `DELETE /api/v1/attendances/:id` - Delete attendance record (Admin only)
- `GET /api/v1/attendances/my/attendances` - Get attendance records for authenticated worker (Worker only)
- `GET /api/v1/attendances/project/:projectId` - Get attendance records by project ID (Admin only)
- `GET /api/v1/attendances/project/:projectId/date-range` - Get attendance records by project and date range (Admin only)

### Payment Management
- `GET /api/v1/payments` - Get all payments (Admin only)
- `GET /api/v1/payments/:id` - Get payment by ID (Admin only)
- `POST /api/v1/payments` - Create a new payment (Admin only)
- `PUT /api/v1/payments/:id` - Update payment by ID (Admin only)
- `DELETE /api/v1/payments/:id` - Delete payment by ID (Admin only)
- `GET /api/v1/payments/my/payments` - Get payments for authenticated worker (Worker only)
- `GET /api/v1/payments/project/:projectId` - Get payments by project ID (Admin only)
- `PATCH /api/v1/payments/:id/approve` - Approve payment (Admin only)
- `PATCH /api/v1/payments/:id/reject` - Reject payment (Admin only)
- `PATCH /api/v1/payments/:id/paid` - Mark payment as paid (Admin only)

### Job Card Management
- `POST /api/v1/job-cards/register` - Register a new job card
- `GET /api/v1/job-cards/:id` - Get job card by ID
- `GET /api/v1/job-cards/user/:userId` - Get job cards by user ID

### Image Upload
- Users can upload profile images during registration, login, or profile updates
- Images are stored in Cloudinary and URLs are saved in the database
- Supported formats: JPG, PNG, GIF (5MB max file size)

## Technology Stack

- Node.js with TypeScript
- Express.js
- PostgreSQL with raw queries
- JWT for authentication
- bcrypt.js for password hashing
- Cloudinary for image storage

## Database Setup

Before running the application, you need to set up a PostgreSQL database. See [Database Setup Guide](SETUP_DATABASE.md) for detailed instructions.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Set up your database (see [Database Setup Guide](SETUP_DATABASE.md))
5. Set up database: `npm run db:setup`
6. Start the server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
# Server Configuration
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=12345678
DB_NAME=capstone_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Run tests: `npm test`

## Testing

Comprehensive testing files and scripts are available in the `test-data/` directory and described in `TESTING_GUIDE.md`.

- Run test setup: `run-tests.bat` (Windows) or `run-tests.sh` (Linux/Mac)
- Complete workflow test: `test-workflow.bat` (Windows) or `test-workflow.sh` (Linux/Mac)

Key test files:
- `test-login.js` - User login functionality
- `test-registration.js` - User registration flow
- `test-otp-flow.js` - OTP verification process
- `test-password-validation.js` - Password validation rules
- `complete-login-flow.js` - End-to-end login process
- `complete-registration-flow.js` - End-to-end registration process
- `test-get-all-users.js` - User management API
- `test-email-delivery.js` - Email delivery functionality
- `test-workflow.js` - Complete end-to-end workflow

Test data files:
- `admin-login.json` - Admin user credentials
- `admin-login.json` - Admin user credentials
- `user-login.json` - Worker user credentials

## Sample Test Data

To help with testing, we provide sample test data and API endpoint examples:

### User Credentials

#### Admin User
```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

#### Supervisor User
```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

#### Worker User
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!"
}
```

### Sample Projects

We provide a collection of sample projects for testing purposes. Each project has the following structure:

```json
{
  "name": "Road Construction Project",
  "description": "Construction of rural roads in the district",
  "location": "Sample District, State",
  "worker_need": 50,
  "start_date": "2023-06-01",
  "end_date": "2023-12-31",
  "status": "pending"
}
```

## Image Upload API Usage

### Register User with Image
```bash
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg" \
  -F 'data={"role":"admin","name":"Test Worker","phone_number":"1234567890","aadhaar_number":"123456789012","email":"testworker@example.com","panchayat_id":"123e4567-e89b-12d3-a456-426614174000","government_id":"GOV123456789012","password":"TestPass123!","state":"Test State","district":"Test District","village_name":"Test Village","pincode":"123456"};application/json'
```

### Update Profile with Image
```bash
curl -X PUT http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg" \
  -F 'data={"name":"Updated Name"};application/json'
```

The image URLs will be returned in the user data and can be used to display images in the frontend.