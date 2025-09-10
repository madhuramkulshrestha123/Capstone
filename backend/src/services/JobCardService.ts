import { JobCardModel } from '../models/JobCardModel';
import { UserModel } from '../models/UserModel';
import { AppError } from '../middlewares/errorMiddleware';
import { JobCardRegistrationRequest, JobCardDetails, CreateUserRequest } from '../types';

export class JobCardService {
  private jobCardModel: JobCardModel;
  private userModel: UserModel;

  constructor() {
    this.jobCardModel = new JobCardModel();
    this.userModel = new UserModel();
  }

  async registerJobCard(registrationData: JobCardRegistrationRequest): Promise<{ userId: number; jobCardId: string; message: string }> {
    // Validate Aadhaar number (simplified validation)
    if (!this.isValidAadhaar(registrationData.aadhaarNumber)) {
      throw new AppError('Invalid Aadhaar number', 400);
    }

    // Validate phone number (simplified validation)
    if (!this.isValidPhone(registrationData.phoneNumber)) {
      throw new AppError('Invalid phone number', 400);
    }

    // Validate captcha (in a real app, you would verify with a captcha service)
    if (!this.isValidCaptcha(registrationData.captchaToken)) {
      throw new AppError('Invalid captcha', 400);
    }

    // Check if a job card with this number already exists
    if (registrationData.jobCardDetails.jobCardNumber) {
      const existingJobCard = await this.jobCardModel.findByJobCardNumber(registrationData.jobCardDetails.jobCardNumber);
      if (existingJobCard) {
        throw new AppError('Job card with this number already exists', 409);
      }
    }

    // Create user account
    const createUserRequest: CreateUserRequest = {
      username: this.generateUsername(registrationData.aadhaarNumber),
      email: this.generateEmail(registrationData.aadhaarNumber),
      password: registrationData.password,
      first_name: registrationData.jobCardDetails.headOfHouseholdName,
    };

    const user = await this.userModel.create(createUserRequest);
    
    // Create job card
    const jobCard = await this.jobCardModel.createJobCard(user.id, registrationData.jobCardDetails);

    return {
      userId: user.id,
      jobCardId: jobCard.jobCardNumber,
      message: 'Job card registered successfully',
    };
  }

  private isValidAadhaar(aadhaar: string): boolean {
    // Simplified Aadhaar validation - in a real app, you would use a more robust validation
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
  }

  private isValidPhone(phone: string): boolean {
    // Simplified phone validation - in a real app, you would use a more robust validation
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  private isValidCaptcha(captchaToken: string): boolean {
    // In a real app, you would verify the captcha token with a service like Google reCAPTCHA
    // For now, we'll just check if it's not empty
    return !!captchaToken && captchaToken.length > 0;
  }

  private generateUsername(aadhaar: string): string {
    return `user_${aadhaar}`;
  }

  private generateEmail(aadhaar: string): string {
    return `${aadhaar}@jobcardapp.com`;
  }
}