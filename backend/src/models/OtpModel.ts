// In-memory OTP storage for development
// In production, you would use a database table
const otpStorage = new Map<string, any>();

export interface OtpRecord {
  id: number;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  resendCount: number;
  lastResendAt: Date | null;
  isVerified: boolean;
}

export class OtpModel {
  private idCounter = 1;

  async createOtp(email: string, otp: string, expiresAt: Date): Promise<OtpRecord> {
    // Check if there's an existing unverified OTP for this email
    let existingRecord = null;
    for (const [key, record] of otpStorage.entries()) {
      if (record.email === email && !record.isVerified) {
        existingRecord = record;
        break;
      }
    }

    // If exists, update it instead of creating a new one
    if (existingRecord) {
      existingRecord.otp = otp;
      existingRecord.expiresAt = expiresAt;
      existingRecord.resendCount = existingRecord.resendCount + 1;
      existingRecord.lastResendAt = new Date();
      
      return existingRecord;
    }

    // Create a new OTP record
    const id = this.idCounter++;
    const otpRecord: OtpRecord = {
      id,
      email,
      otp,
      expiresAt,
      createdAt: new Date(),
      resendCount: 0,
      lastResendAt: null,
      isVerified: false,
    };

    otpStorage.set(email, otpRecord);
    return otpRecord;
  }

  async verifyOtp(email: string, otp: string): Promise<OtpRecord | null> {
    const otpRecord = otpStorage.get(email);

    if (!otpRecord || otpRecord.isVerified) {
      return null;
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return null;
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return null;
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    return otpRecord;
  }

  async findUnverifiedOtpByEmail(email: string): Promise<OtpRecord | null> {
    const otpRecord = otpStorage.get(email);
    
    if (!otpRecord || otpRecord.isVerified) {
      return null;
    }
    
    return otpRecord;
  }

  async canResendOtp(email: string): Promise<boolean> {
    const otpRecord = otpStorage.get(email);
    
    if (!otpRecord || otpRecord.isVerified) {
      return true; // No existing OTP, can resend
    }

    // Check if resend limit reached (3 attempts)
    if (otpRecord.resendCount >= 3) {
      // Check if 1 hour has passed since last resend
      if (otpRecord.lastResendAt) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return otpRecord.lastResendAt < oneHourAgo;
      }
      return false;
    }

    return true;
  }

  async deleteExpiredOtps(): Promise<number> {
    let deletedCount = 0;
    const now = new Date();
    
    for (const [key, record] of otpStorage.entries()) {
      if (record.expiresAt < now) {
        otpStorage.delete(key);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}