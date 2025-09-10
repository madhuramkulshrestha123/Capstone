import { Request, Response, NextFunction } from 'express';
import { WorkDemandRequestService } from '../services/WorkDemandRequestService';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class WorkDemandRequestController {
  private workDemandRequestService: WorkDemandRequestService;

  constructor() {
    this.workDemandRequestService = new WorkDemandRequestService();
  }

  public getAllRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await this.workDemandRequestService.getAllRequests(page, limit, status);

      const response: ApiResponse = {
        success: true,
        data: result.requests,
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

  public getRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Request ID is required'
        });
        return;
      }
      
      const request = await this.workDemandRequestService.getRequestById(id);

      const response: ApiResponse = {
        success: true,
        data: request,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only workers can create work demand requests
      if (req.user?.role !== 'WORKER') {
        res.status(403).json({
          success: false,
          error: 'Only workers can create work demand requests'
        });
        return;
      }

      // Set worker ID from authenticated user
      const requestData = {
        ...req.body,
        worker_id: req.user.id
      };

      const request = await this.workDemandRequestService.createRequest(requestData);

      const response: ApiResponse = {
        success: true,
        data: request,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Request ID is required'
        });
        return;
      }
      
      // Only admins can update work demand requests
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Only admins can update work demand requests'
        });
        return;
      }

      const request = await this.workDemandRequestService.updateRequest(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: request,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Request ID is required'
        });
        return;
      }
      
      // Only admins can delete work demand requests
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Only admins can delete work demand requests'
        });
        return;
      }

      await this.workDemandRequestService.deleteRequest(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Work demand request deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getMyRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get user ID from authenticated user
      const workerId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.workDemandRequestService.getRequestsByWorkerId(workerId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.requests,
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

  public getRequestsByProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.workDemandRequestService.getRequestsByProjectId(projectId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.requests,
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

  public approveRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Request ID is required'
        });
        return;
      }
      
      // Only admins can approve work demand requests
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Only admins can approve work demand requests'
        });
        return;
      }

      const { allocatedAt } = req.body;
      const request = await this.workDemandRequestService.approveRequest(id, allocatedAt);

      const response: ApiResponse = {
        success: true,
        data: request,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public rejectRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Request ID is required'
        });
        return;
      }
      
      // Only admins can reject work demand requests
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Only admins can reject work demand requests'
        });
        return;
      }

      const request = await this.workDemandRequestService.rejectRequest(id);

      const response: ApiResponse = {
        success: true,
        data: request,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}