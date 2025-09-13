import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    // Set SendGrid API key if provided
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    try {
      // Always try to send via SendGrid if API key is configured
      // (Even in development mode for testing)
      if (process.env.SENDGRID_API_KEY) {
        try {
          const msg = {
            to: to,
            from: 'madhukull2701@gmail.com', // Your specific email address
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
            // Add headers to help with deliverability
            headers: {
              'List-Unsubscribe': '<mailto:madhukull2701@gmail.com?subject=unsubscribe>',
              'X-Entity-Ref-ID': 'capstone-otp-verification'
            },
            // Add categories for SendGrid analytics
            categories: ['otp', 'verification', 'capstone-app']
          };

          await sgMail.send(msg);
          console.log('Email sent via SendGrid');
          console.log(`[TESTING] OTP for ${to}: ${otp}`); // Still log for testing visibility
          return true;
        } catch (sendGridError) {
          console.error('Error sending email via SendGrid:', sendGridError);
          return false;
        }
      }

      // Fallback: Log the OTP if no email service is configured
      console.log(`[EMAIL SERVICE NOT CONFIGURED] OTP for ${to}: ${otp}`);
      console.log('Please configure SendGrid or another email service for production use.');
      return true;
    } catch (error) {
      console.error('Error in email service:', error);
      return false;
    }
  }
}