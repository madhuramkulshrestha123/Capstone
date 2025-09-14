import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  public getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.paymentService.getAllPayments(page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.payments,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      const payment = await this.paymentService.getPaymentById(id);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payment = await this.paymentService.createPayment(req.body);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updatePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      const payment = await this.paymentService.updatePayment(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deletePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      await this.paymentService.deletePayment(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Payment deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getMyPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get worker ID from authenticated user
      const workerId = req.user?.user_id;
      
      if (!workerId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.paymentService.getPaymentsByWorkerId(workerId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.payments,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getPaymentsByProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.paymentService.getPaymentsByProjectId(projectId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.payments,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: result.totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public approvePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      // Get admin ID from authenticated user
      const adminId = req.user?.user_id;
      
      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const payment = await this.paymentService.approvePayment(id, adminId);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public rejectPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      // Get admin ID from authenticated user
      const adminId = req.user?.user_id;
      
      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const payment = await this.paymentService.rejectPayment(id, adminId);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public markAsPaid = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
        return;
      }
      
      const payment = await this.paymentService.markAsPaid(id);

      const response: ApiResponse = {
        success: true,
        data: payment,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}