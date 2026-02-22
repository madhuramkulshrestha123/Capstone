import { Request, Response, NextFunction } from 'express';
import { JobCardApplicationService } from '../services/JobCardApplicationService';
import { CloudinaryService } from '../services/CloudinaryService';
import { AppError } from '../middlewares/errorMiddleware';
import { ApiResponse } from '../types';

export class JobCardApplicationController {
  private jobCardApplicationService: JobCardApplicationService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.jobCardApplicationService = new JobCardApplicationService();
    this.cloudinaryService = new CloudinaryService();
  }

  public submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Received job card application request');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      let imageUrl: string | null = null;
      
      // Handle image if uploaded
      if (req.file) {
        try {
          // Extract aadhaar number from the request body for filename
          let aadhaarNumber = 'unknown';
          if (req.body.applicationData) {
            const applicationData = JSON.parse(req.body.applicationData);
            aadhaarNumber = applicationData.aadhaarNumber || 'unknown';
          } else if (req.body.aadhaarNumber) {
            aadhaarNumber = req.body.aadhaarNumber;
          }
          
          const fileName = `jobcard-${aadhaarNumber}-${Date.now()}`;
          console.log('Uploading image to Cloudinary with filename:', fileName);
          imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, fileName, 'jobcard-applications');
          console.log('Image uploaded successfully, URL:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          // Continue with application submission even if image upload fails
        }
      } else {
        console.log('No image file received');
      }

      // Parse application data from form data
      let applicationData;
      if (req.body.applicationData) {
        applicationData = JSON.parse(req.body.applicationData);
      } else {
        // Fallback to original method for JSON requests or direct form data
        applicationData = req.body;
      }
      
      console.log('Parsed application data:', applicationData);

      // Extract application data from request body
      const applicationDataForDB = {
        aadhaar_number: applicationData.aadhaarNumber,
        phone_number: applicationData.phoneNumber,
        family_id: applicationData.jobCardDetails.familyId,
        head_of_household_name: applicationData.jobCardDetails.headOfHouseholdName,
        father_or_husband_name: applicationData.jobCardDetails.fatherHusbandName,
        category: applicationData.jobCardDetails.category,
        date_of_registration: new Date(applicationData.jobCardDetails.dateOfRegistration),
        full_address: applicationData.jobCardDetails.address,
        village: applicationData.jobCardDetails.village || null,
        panchayat: applicationData.jobCardDetails.panchayat,
        block: applicationData.jobCardDetails.block,
        district: applicationData.jobCardDetails.district,
        pincode: applicationData.jobCardDetails.pincode || null,
        is_bpl: applicationData.jobCardDetails.isBPL,
        epic_number: applicationData.jobCardDetails.epicNo || null,
        applicants: applicationData.jobCardDetails.applicants,
        image_url: imageUrl,
        status: 'pending' as const,
        job_card_id: null,
        captchaToken: applicationData.captchaToken // Add captchaToken to the data passed to the service
      };
      
      console.log('Application data for DB:', applicationDataForDB);

      const result = await this.jobCardApplicationService.submitApplication(applicationDataForDB);

      const response: ApiResponse = {
        success: true,
        data: result
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error in submitApplication:', error);
      next(error);
    }
  };

  public getApplicationByTrackingId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { trackingId } = req.params;
      
      if (!trackingId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Tracking ID is required',
          },
        });
        return;
      }

      const application = await this.jobCardApplicationService.getApplicationByTrackingId(trackingId);

      const response: ApiResponse = {
        success: true,
        data: application,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAllApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const applications = await this.jobCardApplicationService.getAllApplications(limit, offset);

      const response: ApiResponse = {
        success: true,
        data: applications,
        meta: {
          page,
          limit,
          total: applications.length
        }
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getApplicationsByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const applications = await this.jobCardApplicationService.getApplicationsByStatus(status as string, limit, offset);

      const response: ApiResponse = {
        success: true,
        data: applications,
        meta: {
          page,
          limit,
          total: applications.length
        }
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}