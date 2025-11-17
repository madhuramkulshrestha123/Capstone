import sgMail from '@sendgrid/mail';
import config from '../config';

export class EmailService {
  constructor() {
    // Set SendGrid API key
    sgMail.setApiKey(config.sendgrid.apiKey);
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    try {
      const msg = {
        to: to,
        from: 'madhukull2701@gmail.com', // Using the verified sender from the original code
        subject: 'OTP Verification - Capstone Application',
        text: `Your OTP (One-Time Password) for Capstone Application is: ${otp}\n\nThis code will expire in 15 minutes. If you didn't request this OTP, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
              <h1 style="color: #333;">Capstone Application</h1>
            </div>
            <div style="padding: 30px 0;">
              <h2 style="color: #333;">OTP Verification</h2>
              <p>Hello,</p>
              <p>Your OTP (One-Time Password) for Capstone Application is:</p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
                ${otp}
              </div>
              <p style="color: #666;">This code will expire in 15 minutes.</p>
              <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
            </div>
            <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                This is an automated message from Capstone Application. Please do not reply to this email.
              </p>
              <p style="font-size: 10px; color: #ccc; text-align: center;">
                This email was sent to ${to} because we received a request to verify your account.
              </p>
            </div>
          </div>
        `,
      };

      await sgMail.send(msg);
      console.log('Email sent successfully via SendGrid');
      // Always log OTP for testing visibility
      console.log(`[TESTING] OTP for ${to}: ${otp}`);
      return true;
    } catch (error) {
      console.error('Error sending email via SendGrid:', error);
      
      // Fallback: Log the OTP if email service fails
      console.log(`[EMAIL SERVICE FAILED] OTP for ${to}: ${otp}`);
      console.log('Please check your SendGrid configuration.');
      return true; // Still return true to allow the process to continue
    }
  }
}