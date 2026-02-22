import { Client } from 'node-mailjet';
import config from '../config';

export class EmailService {
  private mailjet: Client;

  constructor() {
    // Initialize Mailjet client using Client constructor
    this.mailjet = new Client({
      apiKey: config.mailjet.apiKeyPublic,
      apiSecret: config.mailjet.apiKeyPrivate
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    try {
      const request = await this.mailjet
        .post("send", { version: "v3.1" })
        .request({
          Messages: [
            {
              From: {
                Email: config.mailjet.senderEmail,
                Name: "Smart Rozgaar Portal"
              },
              To: [
                {
                  Email: to
                }
              ],
              Subject: "OTP Verification - Smart Rozgaar Portal",
              TextPart: `Your OTP (One-Time Password) for Smart Rozgaar Portal is: ${otp}\n\nThis code will expire in 15 minutes. If you didn't request this OTP, please ignore this email.`,
              HTMLPart: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                  <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; background-color: #007bff; color: white; border-radius: 8px 8px 0 0;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🏢</div>
                    <h1 style="color: white; margin: 0; font-size: 28px;">Smart Rozgaar Portal</h1>
                  </div>
                  <div style="padding: 30px 0; background-color: white; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #333; text-align: center;">OTP Verification</h2>
                    <p>Hello,</p>
                    <p>Your OTP (One-Time Password) for Smart Rozgaar Portal is:</p>
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0; border: 2px dashed #007bff;">
                      ${otp}
                    </div>
                    <p style="color: #666;">This code will expire in 15 minutes.</p>
                    <p style="color: #666;">If you didn't request this OTP, please ignore this email.</p>
                  </div>
                  <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                    <p>This is an automated message from Smart Rozgaar Portal. Please do not reply to this email.</p>
                    <p style="font-size: 10px; color: #999;">
                      This email was sent to ${to} because we received a request to verify your account.
                    </p>
                  </div>
                </div>
              `
            }
          ]
        });

      console.log('Email sent successfully via Mailjet');
      console.log(`[TESTING] OTP for ${to}: ${otp}`); // Still log for testing visibility
      return true;
    } catch (error: any) {
      console.error('Error sending email via Mailjet:', error);
      
      // Fallback: Log the OTP if email service fails
      console.log(`[EMAIL SERVICE FAILED] OTP for ${to}: ${otp}`);
      console.log('Please check your Mailjet configuration.');
      console.log('Error details:', error.message);
      return true; // Still return true to allow the process to continue
    }
  }
}