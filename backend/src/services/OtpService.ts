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
      // Check if we can resend OTP
      const canResend = await this.otpModel.canResendOtp(email);
      if (!canResend) {
        return {
          success: false,
          message: 'Too many resend attempts. Please try again after 1 hour.'
        };
      }

      // Generate OTP
      const otp = this.generateOtp();
      
      // Set expiration time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      
      // Save OTP to storage
      await this.otpModel.createOtp(email, otp, expiresAt);
      
      // Send OTP via email
      const emailSent = await this.emailService.sendOtpEmail(email, otp);
      
      // Send OTP via SMS if phone number is provided
      let smsSent = true;
      if (phoneNumber) {
        smsSent = await this.smsService.sendOtpSms(phoneNumber, otp);
      }
      
      if (emailSent && (smsSent || !phoneNumber)) {
        // In development, return the OTP in the response
        if (process.env.NODE_ENV === 'development') {
          return {
            success: true,
            message: 'OTP sent successfully',
            otp: otp // Return OTP for development testing
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
      const otpRecord = await this.otpModel.verifyOtp(email, otp);
      
      if (otpRecord) {
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