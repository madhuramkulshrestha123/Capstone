# Capstone Backend API

## Overview

This is the backend API for the Capstone project, implementing a role-based system for managing workers, supervisors, and administrators in a work management system.

## Role-Based Access Control

The system implements three distinct user roles:

1. **Worker (WORKER)**: Registers once, asks for work, attends, gets paid in bank
2. **Supervisor (SUPERVISOR)**: Marks digital attendance at the site
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

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/refresh-token` - Refresh authentication token

### User Management
- `GET /api/v1/users/profile` - Get authenticated user's profile
- `PUT /api/v1/users/profile` - Update authenticated user's profile
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `PUT /api/v1/users/:id` - Update user by ID (Admin only)
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
- `POST /api/v1/attendances` - Mark attendance (Supervisor/Admin only)
- `PUT /api/v1/attendances/:id` - Update attendance record (Supervisor/Admin only)
- `DELETE /api/v1/attendances/:id` - Delete attendance record (Admin only)
- `GET /api/v1/attendances/my/attendances` - Get attendance records for authenticated worker (Worker only)
- `GET /api/v1/attendances/project/:projectId` - Get attendance records by project ID (Supervisor/Admin only)
- `GET /api/v1/attendances/project/:projectId/date-range` - Get attendance records by project and date range (Supervisor/Admin only)

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

## Technology Stack

- Node.js with TypeScript
- Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- bcrypt.js for password hashing

## Database Setup

Before running the application, you need to set up a PostgreSQL database. See [Database Setup Guide](SETUP_DATABASE.md) for detailed instructions.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Set up your database (see [Database Setup Guide](SETUP_DATABASE.md))
5. Run database migrations: `npx prisma migrate dev`
6. Start the server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
# Server Configuration
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
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
- `supervisor-login.json` - Supervisor user credentials
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
  "email": "supervisor@example.com",
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
  "name": "Rural Road Construction Project",
  "description": "Construction of 10km rural roads connecting remote villages to the main highway network. This project aims to improve transportation and access to markets for local farmers.",
  "location": "Rajasthan, India",
  "worker_need": 75,
  "start_date": "2023-07-01",
  "end_date": "2024-06-30",
  "status": "active"
}
```

The sample projects include various types of infrastructure projects from different regions of India. You can find the complete list of sample projects in the `test-data/sample-projects.json` file.

### Project API Endpoints

The following API endpoints are available for project management:

#### Base URL
```
/api/v1/projects
```

#### GET /api/v1/projects
Retrieve all projects with pagination. Optional query parameters include `page`, `limit`, and `status`.

#### GET /api/v1/projects/:id
Retrieve a specific project by ID.

#### GET /api/v1/projects/status/:status
Filter projects by status (pending, active, completed).

#### POST /api/v1/projects
Create a new project. Requires admin or supervisor role. Example request body:

```json
{
  "name": "New Road Construction Project",
  "description": "Construction of rural roads",
  "location": "Rajasthan, India",
  "worker_need": 50,
  "start_date": "2023-07-01",
  "end_date": "2024-06-30",
  "status": "pending"
}
```

#### PUT /api/v1/projects/:id
Update an existing project. Requires admin or supervisor role.

#### DELETE /api/v1/projects/:id
Delete a project. Requires admin role.

#### GET /api/v1/projects/my/projects
Get projects created by the authenticated user.

## Documentation

- [Role-Based Access Control](docs/role-based-access-control.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Test Files Summary](TEST_SUMMARY.md)
- [Database Setup Guide](SETUP_DATABASE.md)