# Admin User Management API

This document describes the admin-only endpoints for user management in the Capstone Backend API.

## Authentication Requirements

All endpoints in this section require:
1. A valid JWT token in the `Authorization` header
2. The authenticated user must have the `ADMIN` role

### Header Format
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Get All Users
**GET** `/api/v1/users`

Retrieve a paginated list of all active users in the system.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Number of users per page (max: 100) |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

#### Example Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "adminuser",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "ADMIN",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "username": "worker1",
      "email": "worker1@example.com",
      "first_name": "Worker",
      "last_name": "One",
      "role": "WORKER",
      "is_active": true,
      "created_at": "2023-01-02T00:00:00.000Z",
      "updated_at": "2023-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get User by ID
**GET** `/api/v1/users/:id`

Retrieve details of a specific user by their ID.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer <admin_token>"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "worker1",
    "email": "worker1@example.com",
    "first_name": "Worker",
    "last_name": "One",
    "role": "WORKER",
    "is_active": true,
    "created_at": "2023-01-02T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

### Update User
**PUT** `/api/v1/users/:id`

Update a user's information.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Request Body
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "first_name": "New",
  "last_name": "Name",
  "role": "WORKER"
}
```

#### Example Request
```bash
curl -X PUT "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updatedworker",
    "email": "updated@example.com",
    "first_name": "Updated",
    "last_name": "Worker",
    "role": "WORKER"
  }'
```

### Delete User
**DELETE** `/api/v1/users/:id`

Deactivate a user (soft delete - sets `is_active` to false).

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Example Request
```bash
curl -X DELETE "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer <admin_token>"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

## Error Responses

### Unauthorized (No Token)
```json
{
  "success": false,
  "error": {
    "message": "Access token is required"
  }
}
```

### Forbidden (Non-Admin)
```json
{
  "success": false,
  "error": {
    "message": "Only admins can access this resource"
  }
}
```

### Invalid Token
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token"
  }
}
```

### User Not Found
```json
{
  "success": false,
  "error": {
    "message": "User not found"
  }
}
```

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

## Role Permissions

| Role | Can Access Admin Endpoints |
|------|---------------------------|
| ADMIN | ✅ Yes |
| SUPERVISOR | ❌ No |
| WORKER | ❌ No |

## Testing with cURL

### 1. Login as Admin
```bash
curl -X POST "http://localhost:3001/api/v1/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Use Token to Get All Users
```bash
curl -X GET "http://localhost:3001/api/v1/users" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Get Specific User
```bash
curl -X GET "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Update User
```bash
curl -X PUT "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updatedworker",
    "email": "updated@example.com"
  }'
```

### 5. Delete User
```bash
curl -X DELETE "http://localhost:3001/api/v1/users/2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```