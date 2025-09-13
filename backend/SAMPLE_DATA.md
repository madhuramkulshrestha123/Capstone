# Sample Data for Registration and Login Testing

This document provides sample data and examples for testing the OTP-based registration and login flows.

## Registration Flow

### 1. Send Registration OTP
**Endpoint**: `POST /api/v1/users/register/send-otp`

**Request Body**:
```json
{
  "email": "newuser@example.com"
}
```

**Expected Response**:
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
  "email": "newuser@example.com",
  "otp": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "message": "OTP verified successfully",
    "email": "newuser@example.com"
  }
}
```

### 3. Complete Registration
**Endpoint**: `POST /api/v1/users/register/complete`

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "username": "newuser123",
  "first_name": "New",
  "last_name": "User",
  "password": "SecurePass123!",
  "role": "WORKER"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "newuser123",
      "email": "newuser@example.com",
      "first_name": "New",
      "last_name": "User",
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

### 1. Send Login OTP
**Endpoint**: `POST /api/v1/users/login/send-otp`

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response**:
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
  "email": "newuser@example.com",
  "otp": "654321"
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "newuser123",
      "email": "newuser@example.com",
      "first_name": "New",
      "last_name": "User",
      "role": "WORKER",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Login successful"
  }
}
```

## Password Requirements

Passwords must meet the following requirements:
- Minimum 8 characters long
- At least one lowercase letter (a-z)
- At least one uppercase letter (A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)

**Valid Password Examples**:
- `SecurePass123!`
- `MyPassword1!`
- `Test1234@`

## Role Options

Available role values:
- `WORKER` (default)
- `SUPERVISOR`
- `ADMIN`

## Error Responses

### Invalid Email Format
```json
{
  "success": false,
  "error": {
    "message": "Please provide a valid email address"
  }
}
```

### Invalid Password
```json
{
  "success": false,
  "error": {
    "message": "Password must be at least 8 characters long"
  }
}
```

### Wrong Credentials
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

### Expired or Invalid OTP
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired OTP"
  }
}
```

### User Already Exists
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists"
  }
}
```

### Rate Limit Exceeded
```json
{
  "success": false,
  "error": {
    "message": "Too many requests. Please try again later."
  }
}
```

## Testing Tips

1. **Development Mode**: In development mode, OTP codes are included in the response for easier testing
2. **Rate Limiting**: The system allows 3 OTP requests per hour per email
3. **OTP Expiration**: OTP codes expire after 15 minutes
4. **Email Verification**: Check spam/junk folders if emails don't arrive in the inbox
5. **Content-Type**: Always set `Content-Type: application/json` header in requests

## Example cURL Commands

### Send Registration OTP
```bash
curl -X POST http://localhost:3001/api/v1/users/register/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com"}'
```

### Verify Registration OTP
```bash
curl -X POST http://localhost:3001/api/v1/users/register/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "otp": "123456"}'
```

### Complete Registration
```bash
curl -X POST http://localhost:3001/api/v1/users/register/complete \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser123",
    "first_name": "New",
    "last_name": "User",
    "password": "SecurePass123!",
    "role": "WORKER"
  }'
```

### Send Login OTP
```bash
curl -X POST http://localhost:3001/api/v1/users/login/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "SecurePass123!"}'
```

### Verify Login OTP
```bash
curl -X POST http://localhost:3001/api/v1/users/login/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "otp": "654321"}'
```