import { JobCardModel } from '../models/JobCardModel';
import { UserModel } from '../models/UserModel';
import { AppError } from '../middlewares/errorMiddleware';
import { JobCardRegistrationRequest, JobCardDetails, CreateRegistrationRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from '../services/CloudinaryService';
import axios from 'axios';

export class JobCardService {
  private jobCardModel: JobCardModel;
  private userModel: UserModel;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.jobCardModel = new JobCardModel();
    this.userModel = new UserModel();
    this.cloudinaryService = new CloudinaryService();
  }

  async registerJobCard(registrationData: JobCardRegistrationRequest, imageBuffer?: Buffer): Promise<{ userId: string; jobCardId: string; message: string }> {
    // Validate Aadhaar number (simplified validation)
    if (!this.isValidAadhaar(registrationData.aadhaarNumber)) {
      throw new AppError('Invalid Aadhaar number', 400);
    }

    // Validate phone number (simplified validation)
    if (!this.isValidPhone(registrationData.phoneNumber)) {
      throw new AppError('Invalid phone number', 400);
    }

    // Validate Google reCAPTCHA
    if (!await this.isValidCaptcha(registrationData.captchaToken)) {
      throw new AppError('Invalid reCAPTCHA verification', 400);
    }

    // Check if a job card with this Aadhaar number already exists
    const existingJobCard = await this.jobCardModel.findByAadhaarNumber(registrationData.aadhaarNumber);
    if (existingJobCard) {
      throw new AppError('Job card with this Aadhaar number already exists', 409);
    }

    // Check if user already exists by email
    const existingUser = await this.userModel.findByEmail(this.generateEmail(registrationData.aadhaarNumber));
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Handle image upload if file is provided
    let imageUrl: string | undefined;
    if (imageBuffer) {
      try {
        const fileName = `jobcard_${registrationData.aadhaarNumber}_${Date.now()}`;
        imageUrl = await this.cloudinaryService.uploadImage(imageBuffer, fileName, 'jobcards');
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        throw new AppError('Error uploading image', 500);
      }
    }

    // Create user account with the new schema
    const createUserData: CreateRegistrationRequest = {
      role: 'supervisor',
      name: registrationData.jobCardDetails.headOfHouseholdName,
      phone_number: registrationData.phoneNumber,
      aadhaar_number: registrationData.aadhaarNumber,
      email: this.generateEmail(registrationData.aadhaarNumber),
      password: registrationData.password,
      state: registrationData.jobCardDetails.state || '',
      district: registrationData.jobCardDetails.district || '',
      village_name: registrationData.jobCardDetails.village || '',
      pincode: registrationData.jobCardDetails.pincode || '',
      panchayat_id: uuidv4(), // Generate a new UUID for panchayat_id
      government_id: `GOV${Math.floor(100000 + Math.random() * 900000)}` // Generate a government ID
    };

    const user = await this.userModel.create(createUserData);

    // Create job card
    const jobCardData = {
      aadhaar_number: registrationData.aadhaarNumber,
      phone_number: registrationData.phoneNumber,
      password_hash: '', // Will be set by the model
      date_of_birth: new Date(), // Placeholder - should be collected in form
      age: 0, // Placeholder - should be calculated
      family_id: registrationData.jobCardDetails.familyId,
      head_of_household_name: registrationData.jobCardDetails.headOfHouseholdName,
      father_or_husband_name: registrationData.jobCardDetails.fatherHusbandName,
      category: registrationData.jobCardDetails.category,
      epic_number: registrationData.jobCardDetails.epicNo || '',
      belongs_to_bpl: registrationData.jobCardDetails.isBPL,
      state: registrationData.jobCardDetails.state,
      district: registrationData.jobCardDetails.district,
      village: registrationData.jobCardDetails.village || '',
      panchayat: registrationData.jobCardDetails.panchayat,
      block: registrationData.jobCardDetails.block,
      pincode: registrationData.jobCardDetails.pincode,
      full_address: registrationData.jobCardDetails.address,
      bank_name: '', // Placeholder
      account_number: '', // Placeholder
      ifsc_code: '', // Placeholder
      image_url: imageUrl || null // Add image URL to job card data, use null if undefined
    };

    const jobCard = await this.jobCardModel.createJobCard(jobCardData);

    return {
      userId: user.user_id,
      jobCardId: jobCard.job_card_id,
      message: 'Job card registered successfully',
    };
  }

  async getJobCardById(id: string): Promise<any> {
    return await this.jobCardModel.findById(id);
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

  private async isValidCaptcha(captchaToken: string): Promise<boolean> {
    // Verify Google reCAPTCHA token with Google's API
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      
      if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
        return false;
      }
      
      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
      
      const response = await axios.post(verificationUrl);
      const data = response.data;
      
      return data.success === true;
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      return false;
    }
  }

  private generateUsername(aadhaar: string): string {
    return `user_${aadhaar}`;
  }

  private generateEmail(aadhaar: string): string {
    return `${aadhaar}@jobcardapp.com`;
  }

  private generateJobCardId(): string {
    // Generate a job card ID in the format: 4 uppercase letters + 8 digits
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 8; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}