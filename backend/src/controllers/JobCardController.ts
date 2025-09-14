import { Request, Response, NextFunction } from 'express';
import { JobCardService } from '../services/JobCardService';
import { AppError } from '../middlewares/errorMiddleware';
import { ApiResponse, JobCardRegistrationRequest } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class JobCardController {
  private jobCardService: JobCardService;

  constructor() {
    this.jobCardService = new JobCardService();
  }

  public registerJobCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registrationData: JobCardRegistrationRequest = req.body;
      
      // Validate required fields
      if (!registrationData.aadhaarNumber || !registrationData.phoneNumber || 
          !registrationData.captchaToken || !registrationData.jobCardDetails || 
          !registrationData.password) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields',
          },
        });
        return;
      }

      const result = await this.jobCardService.registerJobCard(registrationData);

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getJobCardById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Job card ID is required',
          },
        });
        return;
      }

      const jobCard = await this.jobCardService.getJobCardById(id);

      if (!jobCard) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Job card not found',
          },
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: jobCard,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}