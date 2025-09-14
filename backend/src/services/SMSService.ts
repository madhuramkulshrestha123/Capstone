import twilio from 'twilio';

export class SMSService {
  private client: any;
  private fromNumber: string;
  private readonly verifiedPhoneNumber: string = '+918958166530';

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACace1c2970d6d4b0eead0e6d54b52c339';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'fd25b1e419e606210ac868b130db7f14';
    
    this.client = twilio(accountSid, authToken);
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+16892639801';
  }

  async sendSms(to: string, message: string): Promise<boolean> {
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
      return false;
    }
  }

  async sendOtpSms(to: string, otp: string): Promise<boolean> {
    const message = `Your OTP for Capstone Application is: ${otp}. This code will expire in 15 minutes.`;
    return await this.sendSms(to, message);
  }

  // This method is kept for potential future use but will still send to verified number
  private formatPhoneNumber(phoneNumber: string): string {
    // For security, we always return the verified phone number
    return this.verifiedPhoneNumber;
  }
}