import { Request, Response, NextFunction } from 'express';
import { JobCardApplicationService } from '../services/JobCardApplicationService';
import { AppError } from '../middlewares/errorMiddleware';
import { ApiResponse } from '../types';

export class JobCardApplicationController {
  private jobCardApplicationService: JobCardApplicationService;

  constructor() {
    this.jobCardApplicationService = new JobCardApplicationService();
  }

  public submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract application data from request body
      const applicationData = {
        aadhaar_number: req.body.aadhaarNumber,
        phone_number: req.body.phoneNumber,
        family_id: req.body.jobCardDetails.familyId,
        head_of_household_name: req.body.jobCardDetails.headOfHouseholdName,
        father_or_husband_name: req.body.jobCardDetails.fatherHusbandName,
        category: req.body.jobCardDetails.category,
        date_of_registration: new Date(req.body.jobCardDetails.dateOfRegistration),
        full_address: req.body.jobCardDetails.address,
        village: req.body.jobCardDetails.village || null,
        panchayat: req.body.jobCardDetails.panchayat,
        block: req.body.jobCardDetails.block,
        district: req.body.jobCardDetails.district,
        is_bpl: req.body.jobCardDetails.isBPL,
        epic_number: req.body.jobCardDetails.epicNo || null,
        applicants: req.body.jobCardDetails.applicants,
        image_url: null, // Will be handled separately if image is uploaded
        status: 'pending' as const,
        job_card_id: null
      };

      // Handle image if uploaded
      if (req.file) {
        // In a real implementation, you would upload the image to cloud storage
        // and set the image_url field
        (applicationData as any).image_url = `placeholder-image-url-for-${req.body.aadhaarNumber}`;
      }

      const result = await this.jobCardApplicationService.submitApplication(applicationData);

      const response: ApiResponse = {
        success: true,
        data: result
      };

      res.status(201).json(response);
    } catch (error) {
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