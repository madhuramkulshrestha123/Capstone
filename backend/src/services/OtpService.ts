import { OtpModel, OtpRecord } from '../models/OtpModel';
import { EmailService } from './EmailService';
import { SMSService } from './SMSService';
import crypto from 'crypto';

export class OtpService {
  private otpModel: OtpModel;
  private emailService: EmailService;
  private smsService: SMSService;

  constructor() {
    this.otpModel = new OtpModel();
    this.emailService = new EmailService();
    this.smsService = new SMSService();
  }

  generateOtp(): string {
    // Generate a 6-digit OTP
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOtp(email: string, phoneNumber?: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      // Generate a single OTP to be used for both email and SMS
      const generatedOtp = this.generateOtp();
      
      // Set expiration time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      
      let emailSent = true;
      let smsSent = true;
      
      // Send OTP via email
      if (email) {
        // Save OTP to storage for email verification
        await this.otpModel.createOtp(email, generatedOtp, expiresAt);
        
        // Send OTP via email
        emailSent = await this.emailService.sendOtpEmail(email, generatedOtp);
      }
      
      // Send OTP via SMS using regular SMS (not Twilio Verify) to use the same OTP
      if (phoneNumber) {
        try {
          smsSent = await this.smsService.sendOtpSmsWithCustomOtp(phoneNumber, generatedOtp);
        } catch (smsError) {
          console.error('Error sending SMS:', smsError);
          // Don't fail the entire operation if SMS fails, just log it
          smsSent = false;
        }
      }
      
      if (emailSent && (phoneNumber ? smsSent : true)) {
        // In development, return the OTP in the response
        if (process.env.NODE_ENV === 'development') {
          return {
            success: true,
            message: 'OTP sent successfully to both email and SMS',
            otp: generatedOtp // Return OTP for development testing
          };
        }
        
        return {
          success: true,
          message: 'OTP sent successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to send OTP'
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // Try to verify using local database (email verification)
      const otpRecord = await this.otpModel.verifyOtp(email, otp);
      
      if (otpRecord) {
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      }
      
      // If not found in local database, try SMS verification
      const smsVerification = await this.smsService.verifyOtp('', otp);
      
      if (smsVerification.success) {
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      }
      
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  async isOtpVerified(email: string): Promise<boolean> {
    const otpRecord = await this.otpModel.findUnverifiedOtpByEmail(email);
    return otpRecord === null; // If no unverified OTP exists, then it's verified
  }

  async cleanupExpiredOtps(): Promise<void> {
    try {
      const deletedCount = await this.otpModel.deleteExpiredOtps();
      console.log(`Cleaned up ${deletedCount} expired OTPs`);
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}