# OTP-Based Registration and Login Features

This document describes the new OTP-based registration and login flows implemented in the backend.

## Registration Flow

The registration process now consists of three steps:

### 1. Send Registration OTP

**Endpoint**: `POST /api/v1/users/register/send-otp`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "is_verified": false
  }
}
```

### 2. Verify Registration OTP

**Endpoint**: `POST /api/v1/users/register/verify-otp`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "OTP verified successfully",
    "email": "user@example.com"
  }
}
```

### 3. Complete Registration

**Endpoint**: `POST /api/v1/users/register/complete`

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "role": "WORKER"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "johndoe",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "WORKER",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    },
    "message": "Registration completed successfully"
  }
}
```

## Login Flow

The login process also uses OTP authentication:

### 1. Send Login OTP

**Endpoint**: `POST /api/v1/users/login/send-otp`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully for login"
  }
}
```

### 2. Verify Login OTP

**Endpoint**: `POST /api/v1/users/login/verify-otp`

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "johndoe",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "WORKER",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "message": "Login successful"
  }
}
```

## OTP Security Features

1. **Expiration**: OTPs expire after 15 minutes
2. **Resend Limit**: Users can request OTP resend up to 3 times
3. **Rate Limiting**: After 3 resend attempts, users must wait 1 hour before requesting another OTP
4. **Single Use**: Each OTP can only be used once

## Testing

To test the OTP flows, you can use the provided test script:

```bash
node test-otp-flow.js
```

This script will test both registration and login flows using dummy data.