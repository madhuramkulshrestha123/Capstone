import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  public getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const result = await this.projectService.getAllProjects(page, limit, status);

      const response: ApiResponse = {
        success: true,
        data: result.projects,
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

  public getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      const project = await this.projectService.getProjectById(id);

      const response: ApiResponse = {
        success: true,
        data: project,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can create projects
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can create projects'
        });
        return;
      }

      // Get user ID from authenticated user
      const userId = req.user.user_id;
      const project = await this.projectService.createProject(req.body, userId);

      const response: ApiResponse = {
        success: true,
        data: project,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      // Only admins can update projects
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can update projects'
        });
        return;
      }

      const project = await this.projectService.updateProject(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: project,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      // Only admins can delete projects
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can delete projects'
        });
        return;
      }

      await this.projectService.deleteProject(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Project deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getMyProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get user ID from authenticated user
      const userId = req.user.user_id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.projectService.getProjectsByUserId(userId, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.projects,
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

  public getProjectsByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.params;
      if (!status) {
        res.status(400).json({
          success: false,
          error: 'Status is required'
        });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.projectService.getProjectsByStatus(status, page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.projects,
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

  public assignWorkersToProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { workerIds } = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      if (!workerIds || !Array.isArray(workerIds) || workerIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Worker IDs are required'
        });
        return;
      }
      
      // Only admins can assign workers to projects
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can assign workers to projects'
        });
        return;
      }

      // Assign workers to the project
      const result = await this.projectService.assignWorkersToProject(id, workerIds);

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAvailableWorkers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can get available workers
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can get available workers'
        });
        return;
      }

      // Get available workers
      const workers = await this.projectService.getAvailableWorkers();

      const response: ApiResponse = {
        success: true,
        data: workers,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
  public getAssignedWorkersByProjectId = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Project ID is required'
        });
        return;
      }
      
      // Only admins can get assigned workers
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: 'Only admins can get assigned workers'
        });
        return;
      }

      // Get assigned workers for this project
      const workers = await this.projectService.getAssignedWorkersByProjectId(id);

      const response: ApiResponse = {
        success: true,
        data: workers,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}