import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { OtpService } from '../services/OtpService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApiResponse } from '../types';

export class UserController {
  private userService: UserService;
  private otpService: OtpService;

  constructor() {
    this.userService = new UserService();
    this.otpService = new OtpService();
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
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      const user = await this.userService.getUserById(userId);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      // Users can only update their own profile unless they're admin
      if (req.user?.user_id !== userId && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'You can only update your own profile or you need admin privileges',
          },
        });
        return;
      }

      // Only admins can update user roles
      if (req.body.role && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can update user roles',
          },
        });
        return;
      }

      const user = await this.userService.updateUser(userId, req.body);

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
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            message: 'User ID parameter is required',
          },
        });
        return;
      }
      
      // Only admins can delete users
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can delete users',
          },
        });
        return;
      }

      await this.userService.deleteUser(userId);

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

      const user = await this.userService.getUserById(req.user.user_id);

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

      const user = await this.userService.updateUser(req.user.user_id, req.body);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public sendRegistrationOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, phone_number } = req.body;
      
      // Check if user already exists
      const existingUser = await this.userService.getUserModel().findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this email already exists',
          },
        });
        return;
      }

      // Send OTP via email and SMS if phone number is provided
      const result = await this.otpService.sendOtp(email, phone_number);

      if (result.success) {
        const responseData: any = {
          message: 'OTP sent successfully',
          is_verified: false,
        };
        
        // In development, include the OTP for testing
        if (process.env.NODE_ENV === 'development' && result.otp) {
          responseData.otp = result.otp;
        }
        
        res.status(200).json({
          success: true,
          data: responseData,
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            message: result.message,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public verifyRegistrationOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;

      const result = await this.otpService.verifyOtp(email, otp);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: {
            message: 'OTP verified successfully',
            email: email,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            message: result.message,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public completeRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if OTP is verified
      const isVerified = await this.otpService.isOtpVerified(req.body.email);
      if (!isVerified) {
        res.status(400).json({
          success: false,
          error: {
            message: 'OTP not verified. Please verify OTP first.',
          },
        });
        return;
      }

      // Check if user already exists by email, phone, aadhaar, or government ID
      const [existingUserByEmail, existingUserByPhone, existingUserByAadhaar, existingUserByGovId] = await Promise.all([
        this.userService.getUserModel().findByEmail(req.body.email),
        this.userService.getUserModel().findByPhoneNumber(req.body.phone_number),
        this.userService.getUserModel().findByAadhaar(req.body.aadhaar_number),
        this.userService.getUserModel().findByGovernmentId(req.body.government_id),
      ]);

      if (existingUserByEmail) {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this email already exists',
          },
        });
        return;
      }

      if (existingUserByPhone) {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this phone number already exists',
          },
        });
        return;
      }

      if (existingUserByAadhaar) {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this Aadhaar number already exists',
          },
        });
        return;
      }

      if (existingUserByGovId) {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this government ID already exists',
          },
        });
        return;
      }

      const user = await this.userService.createRegistration(req.body);

      res.status(201).json({
        success: true,
        data: {
          user,
          message: 'Registration completed successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public sendLoginOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists and verify password
      const user = await this.userService.getUserModel().verifyPassword(email, password);
      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Invalid email or password',
          },
        });
        return;
      }

      // Check if user is active
      if (!user.is_active) {
        res.status(403).json({
          success: false,
          error: {
            message: 'Account is deactivated',
          },
        });
        return;
      }

      // Send OTP via email and SMS using the user's phone number
      const result = await this.otpService.sendOtp(email, user.phone_number);

      if (result.success) {
        const responseData: any = {
          message: 'OTP sent successfully for login',
        };
        
        // In development, include the OTP for testing
        if (process.env.NODE_ENV === 'development' && result.otp) {
          responseData.otp = result.otp;
        }
        
        res.status(200).json({
          success: true,
          data: responseData,
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            message: result.message,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public verifyLoginOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;

      const result = await this.otpService.verifyOtp(email, otp);

      if (result.success) {
        // Get user and generate tokens
        const user = await this.userService.getUserModel().findByEmail(email);
        if (!user) {
          res.status(404).json({
            success: false,
            error: {
              message: 'User not found',
            },
          });
          return;
        }

        const tokens = this.userService.generateTokens(user);
        
        res.status(200).json({
          success: true,
          data: {
            user: {
              user_id: user.user_id,
              name: user.name,
              email: user.email,
              phone_number: user.phone_number,
              aadhaar_number: user.aadhaar_number,
              role: user.role,
              is_active: user.is_active,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            token: tokens.token,
            refreshToken: tokens.refreshToken,
            message: 'Login successful',
          },
        });
      } else {
        res.status(400).json({
          success: false,
          error: {
            message: result.message,
          },
        });
      }
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

  // Expose userService methods for use in controller methods
  public getUserModel() {
    return this.userService.getUserModel();
  }
}