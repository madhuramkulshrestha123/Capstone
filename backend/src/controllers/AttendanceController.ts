import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/AttendanceService';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public getAllAttendances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.attendanceService.getAllAttendances(page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.attendances,
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

  public getAttendanceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Attendance ID is required'
        });
        return;
      }
      
      const attendance = await this.attendanceService.getAttendanceById(id);

      const response: ApiResponse = {
        success: true,
        data: attendance,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public markAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get supervisor ID from authenticated user
      const supervisorId = req.user?.user_id;
      
      if (!supervisorId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const attendance = await this.attendanceService.markAttendance(req.body, supervisorId);

      const response: ApiResponse = {
        success: true,
        data: attendance,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Attendance ID is required'
        });
        return;
      }
      
      const attendance = await this.attendanceService.updateAttendance(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: attendance,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Attendance ID is required'
        });
        return;
      }
      
      await this.attendanceService.deleteAttendance(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Attendance record deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getMyAttendances = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.attendanceService.getAttendancesByWorkerId(workerId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.attendances,
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

  public getAttendancesByProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.attendanceService.getAttendancesByProjectId(projectId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.attendances,
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

  public getAttendancesByDateRange = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const { startDate, endDate } = req.query;

      if (!projectId) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required'
        });
        return;
      }

      const attendances = await this.attendanceService.getAttendancesByDateRange(
        projectId,
        startDate as string,
        endDate as string
      );

      const response: ApiResponse = {
        success: true,
        data: attendances,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}