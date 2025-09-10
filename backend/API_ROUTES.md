# API Routes Reference

This document provides a comprehensive reference of all API routes available in the Capstone Backend API.

## Authentication Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| POST | `/users/register` | Register a new user | No | None |
| POST | `/users/login` | Login user | No | None |
| POST | `/users/refresh-token` | Refresh authentication token | No | None |

## User Management Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| GET | `/users/profile` | Get authenticated user's profile | Yes | Any |
| PUT | `/users/profile` | Update authenticated user's profile | Yes | Any |
| GET | `/users` | Get all users | Yes | Admin |
| GET | `/users/:id` | Get user by ID | Yes | Admin |
| PUT | `/users/:id` | Update user by ID | Yes | Admin |
| DELETE | `/users/:id` | Delete user by ID | Yes | Admin |

## Job Card Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| POST | `/job-cards/register` | Register a new job card | No | None |
| GET | `/job-cards/:id` | Get job card by ID | Yes | Any |
| GET | `/job-cards/user/:userId` | Get job cards by user ID | Yes | Any |

## Project Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| GET | `/projects` | Get all projects | Yes | Any |
| GET | `/projects/:id` | Get project by ID | Yes | Any |
| POST | `/projects` | Create a new project | Yes | Admin |
| PUT | `/projects/:id` | Update project by ID | Yes | Admin |
| DELETE | `/projects/:id` | Delete project by ID | Yes | Admin |
| GET | `/projects/my/projects` | Get projects created by authenticated user | Yes | Any |
| GET | `/projects/status/:status` | Get projects by status | Yes | Any |

## Work Request Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| GET | `/work-requests` | Get all work requests | Yes | Admin |
| GET | `/work-requests/:id` | Get work request by ID | Yes | Admin |
| POST | `/work-requests` | Create a new work request | Yes | Worker |
| PUT | `/work-requests/:id` | Update work request by ID | Yes | Admin |
| DELETE | `/work-requests/:id` | Delete work request by ID | Yes | Admin |
| GET | `/work-requests/my/requests` | Get work requests by authenticated worker | Yes | Worker |
| GET | `/work-requests/project/:projectId` | Get work requests by project ID | Yes | Admin |
| PATCH | `/work-requests/:id/approve` | Approve work request | Yes | Admin |
| PATCH | `/work-requests/:id/reject` | Reject work request | Yes | Admin |

## Attendance Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| GET | `/attendances` | Get all attendance records | Yes | Admin |
| GET | `/attendances/:id` | Get attendance record by ID | Yes | Admin |
| POST | `/attendances` | Mark attendance | Yes | Supervisor/Admin |
| PUT | `/attendances/:id` | Update attendance record | Yes | Supervisor/Admin |
| DELETE | `/attendances/:id` | Delete attendance record | Yes | Admin |
| GET | `/attendances/my/attendances` | Get attendance records for authenticated worker | Yes | Worker |
| GET | `/attendances/project/:projectId` | Get attendance records by project ID | Yes | Supervisor/Admin |
| GET | `/attendances/project/:projectId/date-range` | Get attendance records by project and date range | Yes | Supervisor/Admin |

## Payment Routes

| Method | Route | Description | Authentication Required | Role Required |
|--------|-------|-------------|-------------------------|---------------|
| GET | `/payments` | Get all payments | Yes | Admin |
| GET | `/payments/:id` | Get payment by ID | Yes | Admin |
| POST | `/payments` | Create a new payment | Yes | Admin |
| PUT | `/payments/:id` | Update payment by ID | Yes | Admin |
| DELETE | `/payments/:id` | Delete payment by ID | Yes | Admin |
| GET | `/payments/my/payments` | Get payments for authenticated worker | Yes | Worker |
| GET | `/payments/project/:projectId` | Get payments by project ID | Yes | Admin |
| PATCH | `/payments/:id/approve` | Approve payment | Yes | Admin |
| PATCH | `/payments/:id/reject` | Reject payment | Yes | Admin |
| PATCH | `/payments/:id/paid` | Mark payment as paid | Yes | Admin |

## Base URL

All endpoints are relative to: `http://localhost:3001/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    // Pagination metadata (for list endpoints)
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": {
      // Additional error details (optional)
    }
  }
}
```

## Role-Based Access Control

The API implements three user roles with different permissions:

1. **Worker**: Can create work requests, view their own requests/payments/attendance
2. **Supervisor**: Can mark attendance, view project attendance
3. **Admin**: Full access to all features

Refer to [Role-Based Access Control Documentation](docs/role-based-access-control.md) for detailed permissions matrix.