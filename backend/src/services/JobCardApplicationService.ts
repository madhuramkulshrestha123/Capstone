import { JobCardApplicationModel, CreateJobCardApplication } from '../models/JobCardApplicationModel';
import { JobCardModel } from '../models/JobCardModel';
import { AppError } from '../middlewares/errorMiddleware';
import axios from 'axios';

export class JobCardApplicationService {
  private jobCardApplicationModel: JobCardApplicationModel;
  private jobCardModel: JobCardModel;

  constructor() {
    this.jobCardApplicationModel = new JobCardApplicationModel();
    this.jobCardModel = new JobCardModel();
  }

  async submitApplication(applicationData: CreateJobCardApplication): Promise<{ trackingId: string; message: string }> {
    // Validate Aadhaar number (simplified validation)
    if (!this.isValidAadhaar(applicationData.aadhaar_number)) {
      throw new AppError('Invalid Aadhaar number', 400);
    }

    // Validate phone number (simplified validation)
    if (!this.isValidPhone(applicationData.phone_number)) {
      throw new AppError('Invalid phone number', 400);
    }

    // Validate Google reCAPTCHA (skip in development mode)
    if (process.env.NODE_ENV !== 'development') {
      if (!await this.isValidCaptcha(applicationData.captchaToken)) {
        throw new AppError('Invalid reCAPTCHA verification', 400);
      }
    }

    // Check if an application with this Aadhaar number already exists and is pending
    const existingApplication = await this.jobCardApplicationModel.findByAadhaarNumber(applicationData.aadhaar_number);
    if (existingApplication && existingApplication.status === 'pending') {
      throw new AppError('An application with this Aadhaar number is already pending approval', 409);
    }

    // Create the application
    const application = await this.jobCardApplicationModel.createApplication(applicationData);

    return {
      trackingId: application.tracking_id,
      message: 'Application submitted successfully. You can track your application using the tracking ID.'
    };
  }

  async getApplicationByTrackingId(trackingId: string): Promise<any> {
    const application = await this.jobCardApplicationModel.findByTrackingId(trackingId);
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    return {
      trackingId: application.tracking_id,
      status: application.status,
      aadhaarNumber: application.aadhaar_number,
      phoneNumber: application.phone_number,
      headOfHouseholdName: application.head_of_household_name,
      fatherOrHusbandName: application.father_or_husband_name,
      category: application.category,
      dateOfRegistration: application.date_of_registration,
      isBPL: application.is_bpl,
      epicNumber: application.epic_number,
      fullAddress: application.full_address,
      village: application.village,
      panchayat: application.panchayat,
      block: application.block,
      district: application.district,
      pincode: application.pincode,
      jobCardId: application.job_card_id,
      applicants: application.applicants,
      imageUrl: application.image_url,
      createdAt: application.created_at,
      updatedAt: application.updated_at
    };
  }

  async getApplicationByJobCardId(jobCardId: string): Promise<any> {
    const jobCard = await this.jobCardModel.findById(jobCardId);
    
    if (!jobCard) {
      throw new AppError('Job card not found', 404);
    }

    // Format job card data to match application structure
    return {
      trackingId: jobCard.job_card_id,
      status: 'approved',
      aadhaarNumber: jobCard.aadhaar_number,
      phoneNumber: jobCard.phone_number,
      headOfHouseholdName: jobCard.head_of_household_name,
      fatherOrHusbandName: jobCard.father_or_husband_name,
      category: jobCard.category,
      dateOfRegistration: jobCard.created_at,
      isBPL: jobCard.belongs_to_bpl,
      epicNumber: jobCard.epic_number,
      fullAddress: jobCard.full_address,
      village: jobCard.village,
      panchayat: jobCard.panchayat,
      block: jobCard.block,
      district: jobCard.district,
      pincode: jobCard.pincode,
      jobCardId: jobCard.job_card_id,
      applicants: [],
      imageUrl: jobCard.image_url,
      createdAt: jobCard.created_at,
      updatedAt: jobCard.updated_at
    };
  }

  async getAllApplications(limit: number = 10, offset: number = 0): Promise<any[]> {
    const applications = await this.jobCardApplicationModel.getAllApplications(limit, offset);
    
    return applications.map(app => ({
      trackingId: app.tracking_id,
      status: app.status,
      aadhaarNumber: app.aadhaar_number,
      headOfHouseholdName: app.head_of_household_name,
      district: app.district,
      createdAt: app.created_at
    }));
  }

  async getApplicationsByStatus(status: string, limit: number = 10, offset: number = 0): Promise<any[]> {
    const applications = await this.jobCardApplicationModel.getApplicationsByStatus(status, limit, offset);
    
    return applications.map(app => ({
      trackingId: app.tracking_id,
      status: app.status,
      aadhaarNumber: app.aadhaar_number,
      headOfHouseholdName: app.head_of_household_name,
      district: app.district,
      createdAt: app.created_at
    }));
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
    // In development mode, accept the dummy token
    if (process.env.NODE_ENV === 'development' && captchaToken === 'dummy-development-token') {
      return true;
    }
    
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
}