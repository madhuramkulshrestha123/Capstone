import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApiResponse } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt((req.query.page as string) || '1') || 1;
      const limit = parseInt((req.query.limit as string) || '10') || 10;

      const result = await this.userService.getAllUsers(page, limit);

      const response: ApiResponse = {
        success: true,
        data: result.users,
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

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid user ID format',
          },
        });
        return;
      }
      
      const user = await this.userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid user ID format',
          },
        });
        return;
      }
      
      // Users can only update their own profile unless they're admin
      if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            message: 'You can only update your own profile or you need admin privileges',
          },
        });
        return;
      }

      // Only admins can update user roles
      if (req.body.role && req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can update user roles',
          },
        });
        return;
      }

      const user = await this.userService.updateUser(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid user ID format',
          },
        });
        return;
      }
      
      // Only admins can delete users
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can delete users',
          },
        });
        return;
      }

      await this.userService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'User deleted successfully',
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User not authenticated',
          },
        });
        return;
      }

      const user = await this.userService.getUserById(req.user.id);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User not authenticated',
          },
        });
        return;
      }

      // Prevent users from updating their own role
      if (req.body.role) {
        delete req.body.role;
      }

      const user = await this.userService.updateUser(req.user.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData = await this.userService.login(req.body);

      const response: ApiResponse = {
        success: true,
        data: loginData,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.userService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: tokens,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}