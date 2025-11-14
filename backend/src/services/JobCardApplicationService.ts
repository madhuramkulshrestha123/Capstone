import { JobCardApplicationModel, CreateJobCardApplication } from '../models/JobCardApplicationModel';
import { AppError } from '../middlewares/errorMiddleware';

export class JobCardApplicationService {
  private jobCardApplicationModel: JobCardApplicationModel;

  constructor() {
    this.jobCardApplicationModel = new JobCardApplicationModel();
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
      headOfHouseholdName: application.head_of_household_name,
      district: application.district,
      jobCardId: application.job_card_id,
      createdAt: application.created_at,
      updatedAt: application.updated_at
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
}