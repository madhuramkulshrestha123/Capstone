# Test Files Summary

This document provides a summary of all test files and scripts created for the Capstone Backend API.

## Main Documentation

1. **TESTING_GUIDE.md** - Comprehensive guide for running and testing all functionalities

## Test Data Files (in test-data/ directory)

1. **job-card-registration.json** - Data for job card registration
2. **user-login.json** - Credentials for user login
3. **admin-registration.json** - Data for admin user registration
4. **admin-login.json** - Credentials for admin login
5. **supervisor-registration.json** - Data for supervisor registration
6. **supervisor-login.json** - Credentials for supervisor login
7. **create-project.json** - Data for creating a new project
8. **create-work-request.json** - Data for creating a work request
9. **approve-work-request.json** - Data for approving a work request
10. **mark-attendance.json** - Data for marking attendance
11. **create-payment.json** - Data for creating a payment
12. **README.md** - Description of test data files

## Test Scripts

1. **run-tests.bat** - Windows batch script to install dependencies, run migrations, and start server
2. **run-tests.sh** - Shell script (Linux/Mac) to install dependencies, run migrations, and start server
3. **test-workflow.sh** - Shell script demonstrating complete test workflow
4. **test-workflow.bat** - Windows batch script demonstrating complete test workflow

## API Endpoints Covered

### Authentication & Registration
- Job card registration (`POST /job-cards/register`)
- User login (`POST /users/login`)
- Admin registration (`POST /users/register`)
- Admin login (`POST /users/login`)
- Supervisor registration (`POST /users/register`)
- Supervisor login (`POST /users/login`)

### Project Management (Admin Only)
- Create project (`POST /projects`)
- Get all projects (`GET /projects`)
- Get project by ID (`GET /projects/{id}`)

### Work Request Management
- Create work request (`POST /work-requests`)
- Get my work requests (`GET /work-requests/my/requests`)
- Approve work request (`PATCH /work-requests/{id}/approve`)
- Reject work request (`PATCH /work-requests/{id}/reject`)

### Attendance Management
- Mark attendance (`POST /attendances`)

### Payment Management
- Create payment (`POST /payments`)
- Approve payment (`PATCH /payments/{id}/approve`)

## How to Use

1. **Setup**: Run either `run-tests.bat` (Windows) or `run-tests.sh` (Linux/Mac)
2. **Testing**: Use the JSON files with curl commands or import into Postman
3. **Workflow Testing**: Run either `test-workflow.bat` (Windows) or `test-workflow.sh` (Linux/Mac)

## Prerequisites

1. Node.js (v16 or higher)
2. PostgreSQL database
3. npm package manager
4. curl (for command-line testing)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/capstone_db"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```