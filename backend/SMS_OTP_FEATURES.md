# SMS OTP Features

This document describes the new SMS OTP functionality added to the Capstone backend.

## Overview

The system now supports sending OTPs via SMS using Twilio in addition to the existing email functionality. This provides users with an alternative method for receiving OTPs during registration and login.

## Security Implementation

For security reasons, all OTP SMS messages are sent to a single verified phone number: `+918958166530`. This ensures that OTPs can only be received by the verified recipient, preventing potential security issues with unverified phone numbers.

## Implementation Details

### SMSService

A new service `SMSService` has been added to handle SMS sending via Twilio:

- Located at: `src/services/SMSService.ts`
- Uses Twilio SDK to send SMS messages
- Always sends SMS to the verified phone number `+918958166530` for security
- Supports sending generic SMS messages and OTP-specific messages

### OtpService Updates

The existing `OtpService` has been updated to support SMS sending:

- Modified `sendOtp` method to accept an optional phone number parameter
- Sends OTP via both email and SMS when a phone number is provided
- Maintains backward compatibility with existing email-only functionality

### UserController Updates

The `UserController` has been updated to pass phone numbers to the OTP service:

- `sendRegistrationOtp` now accepts a `phone_number` field in the request body
- `sendLoginOtp` automatically uses the user's stored phone number for SMS

## Environment Variables

The following environment variables should be configured for Twilio:

```env
TWILIO_ACCOUNT_SID=ACace1c2970d6d4b0eead0e6d54b52c339
TWILIO_AUTH_TOKEN=fd25b1e419e606210ac868b130db7f14
TWILIO_PHONE_NUMBER=+16892639801
```

If these are not set, the service will use the default values provided in the code.

## API Usage

### Registration OTP

To send an OTP during registration with SMS support:

```http
POST /api/v1/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone_number": "+919999999999"  // This will be ignored for SMS, OTP always goes to +918958166530
}
```

### Login OTP

For login, the system automatically uses the phone number stored in the user's profile:

```http
POST /api/v1/users/login/otp
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userpassword"
}
```

Note: Regardless of the phone number stored in the user's profile, OTPs will always be sent to `+918958166530`.

## Testing

A test script `testSmsService.ts` has been added to verify SMS functionality:

```bash
npx ts-node testSmsService.ts
```

## Error Handling

The SMS service includes proper error handling:

- Logs errors when SMS sending fails
- Continues with email sending even if SMS fails
- Returns appropriate error messages to the client

## Phone Number Formatting

The service automatically formats phone numbers to E.164 format, but for security reasons, all SMS messages are sent to the verified number `+918958166530`.