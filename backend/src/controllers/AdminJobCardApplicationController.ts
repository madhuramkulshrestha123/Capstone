import { Request, Response, NextFunction } from 'express';
import { AdminJobCardApplicationService } from '../services/AdminJobCardApplicationService';
import { AppError } from '../middlewares/errorMiddleware';
import { ApiResponse } from '../types';

export class AdminJobCardApplicationController {
  private adminJobCardApplicationService: AdminJobCardApplicationService;

  constructor() {
    this.adminJobCardApplicationService = new AdminJobCardApplicationService();
  }

  public approveApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.adminJobCardApplicationService.approveApplication(trackingId);

      const response: ApiResponse = {
        success: true,
        data: result
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public rejectApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.adminJobCardApplicationService.rejectApplication(trackingId);

      const response: ApiResponse = {
        success: true,
        data: result
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}