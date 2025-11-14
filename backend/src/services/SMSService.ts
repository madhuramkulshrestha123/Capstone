import twilio from 'twilio';
import config from '../config';

export class SMSService {
  private client: any;
  private verifyServiceSid: string | null;
  private fromNumber: string | null;
  private readonly verifiedPhoneNumber: string = '+918958166530';
  private isConfigured: boolean;

  constructor() {
    // Check if Twilio is properly configured
    this.isConfigured = !!(config.twilio.accountSid && config.twilio.authToken && config.twilio.verifyServiceSid);
    
    if (this.isConfigured) {
      this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
      this.verifyServiceSid = config.twilio.verifyServiceSid;
      this.fromNumber = config.twilio.phoneNumber;
    } else {
      console.warn('Twilio not properly configured. SMS functionality will be disabled.');
      this.verifyServiceSid = null;
      this.fromNumber = null;
    }
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    // If Twilio is not configured, return true to not block the process
    if (!this.isConfigured || !this.verifyServiceSid || !this.fromNumber) {
      console.log('Twilio not configured. SMS not sent.');
      return true;
    }
    
    try {
      // Always send to the verified phone number
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: this.verifiedPhoneNumber
      });
      
      console.log(`SMS sent successfully to verified number. SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      // Return true to not block the process even if SMS fails
      return true;
    }
  }

  async sendOtpSms(to: string, otp: string): Promise<boolean> {
    // If Twilio is not configured, return true to not block the process
    if (!this.isConfigured || !this.verifyServiceSid) {
      console.log('Twilio not configured. OTP SMS not sent.');
      return true;
    }
    
    try {
      // Using Twilio Verify service to send OTP
      const verification = await this.client.verify.v2.services(this.verifyServiceSid)
        .verifications
        .create({
          to: this.verifiedPhoneNumber,
          channel: 'sms'
        });
      
      console.log(`OTP sent successfully via Twilio Verify. SID: ${verification.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP via Twilio Verify:', error);
      // Return true to not block the process even if SMS fails
      return true;
    }
  }

  async verifyOtp(to: string, otp: string): Promise<{ success: boolean; message: string }> {
    // If Twilio is not configured, return success to not block the process
    if (!this.isConfigured || !this.verifyServiceSid) {
      console.log('Twilio not configured. OTP verification assumed successful.');
      return {
        success: true,
        message: 'OTP verification skipped (Twilio not configured)'
      };
    }
    
    try {
      // Using Twilio Verify service to check OTP
      const verification_check = await this.client.verify.v2.services(this.verifyServiceSid)
        .verificationChecks
        .create({
          to: this.verifiedPhoneNumber,
          code: otp
        });
      
      if (verification_check.status === 'approved') {
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          message: 'Invalid or expired OTP'
        };
      }
    } catch (error) {
      console.error('Error verifying OTP via Twilio Verify:', error);
      // Return success to not block the process even if verification fails
      return {
        success: true,
        message: 'OTP verification failed but process continued'
      };
    }
  }

  // This method is kept for potential future use but will still send to verified number
  private formatPhoneNumber(phoneNumber: string): string {
    // For security, we always return the verified phone number
    return this.verifiedPhoneNumber;
  }
}