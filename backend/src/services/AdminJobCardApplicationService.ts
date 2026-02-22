import { JobCardApplicationModel } from '../models/JobCardApplicationModel';
import { JobCardModel } from '../models/JobCardModel';
import { UserModel } from '../models/UserModel';
import { AppError } from '../middlewares/errorMiddleware';
import { v4 as uuidv4 } from 'uuid';

export class AdminJobCardApplicationService {
  private jobCardApplicationModel: JobCardApplicationModel;
  private jobCardModel: JobCardModel;
  private userModel: UserModel;

  constructor() {
    this.jobCardApplicationModel = new JobCardApplicationModel();
    this.jobCardModel = new JobCardModel();
    this.userModel = new UserModel();
  }

  async approveApplication(trackingId: string): Promise<{ message: string; jobCardId: string }> {
    // Find the application
    const application = await this.jobCardApplicationModel.findByTrackingId(trackingId);
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.status !== 'pending') {
      throw new AppError('Application is not in pending status', 400);
    }

    // Check if user already exists by aadhaar number
    const existingUser = await this.userModel.findByAadhaar(application.aadhaar_number);
    if (existingUser) {
      throw new AppError('User with this Aadhaar number already exists', 409);
    }

    // Create a user account from the application data
    const createUserData = {
      role: 'supervisor',
      name: application.head_of_household_name,
      phone_number: application.phone_number,
      aadhaar_number: application.aadhaar_number,
      email: this.generateEmail(application.aadhaar_number),
      panchayat_id: uuidv4(), // Generate a random panchayat ID for now
      government_id: `GOV${application.aadhaar_number}`,
      password: 'TempPass123!', // Temporary password, should be changed by user
      state: '', // Placeholder
      district: application.district,
      village_name: application.village || '',
      pincode: '' // Placeholder
    };

    const user = await this.userModel.createRegistration(createUserData);

    // Create a job card from the application data
    // Extract bank details from the first applicant (assuming the first applicant is the main applicant)
    let bankName = '';
    let accountNumber = '';
    let ifscCode = '';
    
    if (application.applicants && application.applicants.length > 0) {
      const firstApplicant = application.applicants[0];
      if (firstApplicant.bankDetails) {
        // Split the bank details string to extract individual components
        const bankDetailsParts = firstApplicant.bankDetails.split('|');
        if (bankDetailsParts.length === 3) {
          bankName = bankDetailsParts[0];
          accountNumber = bankDetailsParts[1];
          ifscCode = bankDetailsParts[2];
        }
      }
    }
    
    const jobCardData = {
      aadhaar_number: application.aadhaar_number,
      phone_number: application.phone_number,
      password_hash: '', // Will be set properly in the model
      date_of_birth: new Date(), // Placeholder
      age: 0, // Placeholder
      family_id: application.family_id,
      head_of_household_name: application.head_of_household_name,
      father_or_husband_name: application.father_or_husband_name,
      category: application.category,
      epic_number: application.epic_number || '',
      belongs_to_bpl: application.is_bpl,
      state: '', // Placeholder
      district: application.district,
      village: application.village || '',
      panchayat: application.panchayat,
      block: application.block,
      pincode: '', // Placeholder
      full_address: application.full_address,
      bank_name: bankName,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      image_url: application.image_url
    };

    const jobCard = await this.jobCardModel.createJobCard(jobCardData);
    
    // Update the application status to approved and link to the job card
    await this.jobCardApplicationModel.updateStatus(trackingId, 'approved', jobCard.job_card_id);

    return {
      message: 'Application approved successfully',
      jobCardId: jobCard.job_card_id
    };
  }

  async rejectApplication(trackingId: string, rejectionReason?: string): Promise<{ message: string }> {
    // Find the application
    const application = await this.jobCardApplicationModel.findByTrackingId(trackingId);
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.status !== 'pending') {
      throw new AppError('Application is not in pending status', 400);
    }

    // Update the application status to rejected
    await this.jobCardApplicationModel.updateStatus(trackingId, 'rejected', undefined, rejectionReason);

    return {
      message: 'Application rejected successfully'
    };
  }

  private generateEmail(aadhaar: string): string {
    return `${aadhaar}@jobcardapp.com`;
  }
}