# Testing Guide for Capstone Backend API

This guide provides instructions for running and testing all functionalities of the Capstone Backend API.

## Prerequisites

1. Node.js (v16 or higher)
2. PostgreSQL database
3. npm package manager

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
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

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Base URL

All endpoints are relative to: `http://localhost:3001/api/v1`

## Authentication Flow

### 1. Job Card Registration

**Endpoint**: `POST /job-cards/register`

**Description**: Register a new job card with associated user account

**Example Request Body** (`job-card-registration.json`):
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

### 2. Login through Job Card (User Login)

**Endpoint**: `POST /users/login`

**Description**: Login with email and password

**Example Request Body** (`user-login.json`):
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!"
}
```

## Admin Functionality

### 1. Admin Registration

**Endpoint**: `POST /users/register`

**Description**: Register a new admin user

**Example Request Body** (`admin-registration.json`):
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

### 2. Admin Login

**Endpoint**: `POST /users/login`

**Description**: Login as admin

**Example Request Body** (`admin-login.json`):
```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

## Gram Sevak (Supervisor) Functionality

### 1. Gram Sevak Registration

**Endpoint**: `POST /users/register`

**Description**: Register a new supervisor user

**Example Request Body** (`supervisor-registration.json`):
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

### 2. Gram Sevak Login

**Endpoint**: `POST /users/login`

**Description**: Login as supervisor

**Example Request Body** (`supervisor-login.json`):
```json
{
  "email": "supervisor@example.com",
  "password": "StrongPass123!"
}
```

## Project Management (Admin Only)

### 1. Create Project

**Endpoint**: `POST /projects`

**Description**: Create a new project (requires ADMIN role)

**Headers**: 
- Authorization: Bearer `<admin_jwt_token>`

**Example Request Body** (`create-project.json`):
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

### 2. Get All Projects

**Endpoint**: `GET /projects`

**Description**: Retrieve all projects

**Headers**: 
- Authorization: Bearer `<jwt_token>`

### 3. Get Project by ID

**Endpoint**: `GET /projects/{project_id}`

**Description**: Retrieve a specific project

**Headers**: 
- Authorization: Bearer `<jwt_token>`

## Work Request Functionality

### 1. Create Work Request (Worker Only)

**Endpoint**: `POST /work-requests`

**Description**: Submit a work request for a project (requires WORKER role)

**Headers**: 
- Authorization: Bearer `<worker_jwt_token>`

**Example Request Body** (`create-work-request.json`):
```json
{
  "project_id": "project-uuid-here",
  "status": "pending"
}
```

### 2. Get My Work Requests (Worker Only)

**Endpoint**: `GET /work-requests/my/requests`

**Description**: Retrieve work requests submitted by the authenticated worker

**Headers**: 
- Authorization: Bearer `<worker_jwt_token>`

## Work Request Approval (Admin Only)

### 1. Approve Work Request

**Endpoint**: `PATCH /work-requests/{request_id}/approve`

**Description**: Approve a work request (requires ADMIN role)

**Headers**: 
- Authorization: Bearer `<admin_jwt_token>`

**Example Request Body** (`approve-work-request.json`):
```json
{
  "allocatedAt": "2023-06-15T00:00:00.000Z"
}
```

### 2. Reject Work Request

**Endpoint**: `PATCH /work-requests/{request_id}/reject`

**Description**: Reject a work request (requires ADMIN role)

**Headers**: 
- Authorization: Bearer `<admin_jwt_token>`

## Other Features

### 1. Attendance Management

#### Mark Attendance (Supervisor/Admin)

**Endpoint**: `POST /attendances`

**Headers**: 
- Authorization: Bearer `<supervisor_or_admin_jwt_token>`

**Example Request Body** (`mark-attendance.json`):
```json
{
  "worker_id": 1,
  "project_id": "project-uuid-here",
  "date": "2023-06-15",
  "status": "PRESENT"
}
```

### 2. Payment Management

#### Create Payment (Admin)

**Endpoint**: `POST /payments`

**Headers**: 
- Authorization: Bearer `<admin_jwt_token>`

**Example Request Body** (`create-payment.json`):
```json
{
  "worker_id": 1,
  "project_id": "project-uuid-here",
  "amount": 5000.00
}
```

#### Approve Payment (Admin)

**Endpoint**: `PATCH /payments/{payment_id}/approve`

**Headers**: 
- Authorization: Bearer `<admin_jwt_token>`

## Testing with curl

### Job Card Registration
```bash
curl -X POST http://localhost:3001/api/v1/job-cards/register \
  -H "Content-Type: application/json" \
  -d @job-card-registration.json
```

### User Login
```bash
curl -X POST http://localhost:3001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d @user-login.json
```

### Create Project (Admin)
```bash
curl -X POST http://localhost:3001/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d @create-project.json
```

### Create Work Request (Worker)
```bash
curl -X POST http://localhost:3001/api/v1/work-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WORKER_JWT_TOKEN" \
  -d @create-work-request.json
```

### Approve Work Request (Admin)
```bash
curl -X PATCH http://localhost:3001/api/v1/work-requests/REQUEST_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d @approve-work-request.json
```

## Testing with Postman

1. Import the collection file (if available) or create requests manually
2. Set up environment variables for:
   - `base_url`: http://localhost:3001/api/v1
   - `admin_token`: JWT token from admin login
   - `worker_token`: JWT token from worker login
   - `supervisor_token`: JWT token from supervisor login
3. Use the example JSON files as request bodies
4. Set appropriate Authorization headers for each request

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Troubleshooting

1. **Database Connection Issues**: Ensure PostgreSQL is running and connection string is correct
2. **Authentication Errors**: Check that JWT tokens are properly generated and not expired
3. **Permission Errors**: Verify user roles match required permissions for each endpoint
4. **Validation Errors**: Ensure all required fields are provided and in correct format