import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { OtpService } from '../services/OtpService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ApiResponse } from '../types';
import upload from '../middlewares/uploadMiddleware';
import { CloudinaryService } from '../services/CloudinaryService';
import { WorkDemandRequestService } from '../services/WorkDemandRequestService';
import axios from 'axios';
import config from '../config';

export class UserController {
  private userService: UserService;
  private otpService: OtpService;
  private cloudinaryService: CloudinaryService;
  private workDemandRequestService: WorkDemandRequestService;

  constructor() {
    this.userService = new UserService();
    this.otpService = new OtpService();
    this.cloudinaryService = new CloudinaryService();
    this.workDemandRequestService = new WorkDemandRequestService();
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

      // Handle image upload if file is provided
      let imageUrl: string | undefined;
      if (req.file) {
        try {
          const fileName = `user_${userId}_${Date.now()}`;
          imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, fileName);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          res.status(500).json({
            success: false,
            error: {
              message: 'Error uploading image',
            },
          });
          return;
        }
      }

      // Prepare update data
      const updateData = { ...req.body };
      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const user = await this.userService.updateUser(userId, updateData);

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

      // Handle image upload if file is provided
      let imageUrl: string | undefined;
      if (req.file) {
        try {
          const fileName = `user_${req.user.user_id}_${Date.now()}`;
          imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, fileName);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          res.status(500).json({
            success: false,
            error: {
              message: 'Error uploading image',
            },
          });
          return;
        }
      }

      // Prepare update data
      const updateData = { ...req.body };
      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const user = await this.userService.updateUser(req.user.user_id, updateData);

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

      // Handle image upload if file is provided
      let imageUrl: string | undefined;
      if (req.file) {
        try {
          const fileName = `user_${req.body.email}_${Date.now()}`;
          imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, fileName);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          res.status(500).json({
            success: false,
            error: {
              message: 'Error uploading image',
            },
          });
          return;
        }
      }

      // Add image URL to registration data
      const registrationData = { ...req.body };
      if (imageUrl) {
        registrationData.image_url = imageUrl;
      }

      const user = await this.userService.createRegistration(registrationData);

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
              image_url: user.image_url,
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
      // Handle image upload if file is provided
      let imageUrl: string | undefined;
      if (req.file) {
        try {
          const fileName = `user_${req.body.email}_${Date.now()}`;
          imageUrl = await this.cloudinaryService.uploadImage(req.file.buffer, fileName);
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          res.status(500).json({
            success: false,
            error: {
              message: 'Error uploading image',
            },
          });
          return;
        }
      }

      // Add image URL to user data
      const userData = { ...req.body };
      if (imageUrl) {
        userData.image_url = imageUrl;
      }

      const user = await this.userService.createUser(userData);

      const response: ApiResponse = {
        success: true,
        data: user,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  // Method to verify worker by aadhaar number and job card ID
  public verifyWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { aadhaarNumber, jobCardId } = req.body;
      
      // Get user model instance
      const userModel = this.userService.getUserModel();
      
      // First, find the job card by job card ID
      const jobCard = await userModel.getJobCardById(jobCardId);
      if (!jobCard) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Job card not found',
          },
        });
        return;
      }
      
      // Verify aadhaar number matches
      // Trim whitespace and ensure both values are strings for comparison
      const jobCardAadhaar = String(jobCard.aadhaar_number).trim();
      const providedAadhaar = String(aadhaarNumber).trim();
      
      if (jobCardAadhaar !== providedAadhaar) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Aadhaar number does not match',
          },
        });
        return;
      }
      
      // Find the user associated with this job card
      const user = await userModel.findByAadhaar(jobCard.aadhaar_number);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            message: 'User not found for this job card',
          },
        });
        return;
      }
      
      // Get work history for this user
      const workHistory = await userModel.getWorkHistoryByUserId(user.user_id);
      
      // Calculate current status and payment information
      let currentStatus = 'available';
      let totalAmount = 0;
      let paymentDeadline = null;
      
      if (workHistory.length > 0) {
        // Get the most recent project assignment
        const latestProject = workHistory[workHistory.length - 1];
        if (latestProject) {
          totalAmount = latestProject.wage_per_worker || 374;
          currentStatus = 'assigned';
          
          // Calculate payment deadline (15 days from project assignment date)
          if (latestProject.allocated_at) {
            const assignedDate = new Date(latestProject.allocated_at);
            assignedDate.setDate(assignedDate.getDate() + 15);
            paymentDeadline = assignedDate.toISOString().split('T')[0];
          }
        }
      }
      
      // Prepare response data
      const workerDetails = {
        id: user.user_id,
        name: user.name,
        aadhaar_number: user.aadhaar_number,
        job_card_id: jobCard.job_card_id,
        current_status: currentStatus,
        work_history: workHistory,
        total_amount: totalAmount,
        payment_deadline: paymentDeadline,
        district: user.district,
        panchayat_id: user.panchayat_id
      };
      
      const response: ApiResponse = {
        success: true,
        data: workerDetails,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
  // Worker login method
  public workerLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobCardNumber, aadhaarNumber, captchaToken } = req.body;
      
      // Validate reCAPTCHA
      
      // Validate reCAPTCHA (skip in development mode for testing)
      let isValidCaptcha = await this.isValidCaptcha(captchaToken);
      
      // In development mode, allow test-token to bypass reCAPTCHA
      if (process.env.NODE_ENV === 'development' && captchaToken === 'test-token') {
        isValidCaptcha = true;
      }
      
      if (!isValidCaptcha) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid reCAPTCHA. Please try again.',
          },
        });
        return;
      }
      
      // Validate inputs
      if (!jobCardNumber || !aadhaarNumber) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Job card number and Aadhaar number are required',
          },
        });
        return;
      }
      
      // Validate Aadhaar format
      if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid Aadhaar number format',
          },
        });
        return;
      }
      
      // Get user model instance
      const userModel = this.userService.getUserModel();
      
      // Find job card by job card ID
      const jobCard = await userModel.getJobCardById(jobCardNumber);
      if (!jobCard) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Job card not found. Please check your Job Card Number.',
          },
        });
        return;
      }
      
      // Verify Aadhaar number matches
      const jobCardAadhaar = String(jobCard.aadhaar_number).trim();
      const providedAadhaar = String(aadhaarNumber).trim();
      
      if (jobCardAadhaar !== providedAadhaar) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Aadhaar number does not match the job card records.',
          },
        });
        return;
      }
      
      // Find the user associated with this job card
      const user = await userModel.findByAadhaar(jobCard.aadhaar_number);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            message: 'User not found for this job card.',
          },
        });
        return;
      }
      
      // Get work history for this user
      const workHistory = await userModel.getWorkHistoryByUserId(user.user_id);
      
      // Calculate current status and payment information
      let currentStatus = 'available';
      let totalAmount = 0;
      let paymentDeadline = null;
      
      if (workHistory.length > 0) {
        // Get the most recent project assignment
        const latestProject = workHistory[0]; // Already ordered by allocated_at DESC
        if (latestProject) {
          totalAmount = latestProject.wage_per_worker || 374;
          currentStatus = 'assigned';
          
          // Calculate payment deadline (15 days from project assignment date)
          if (latestProject.allocated_at) {
            const assignedDate = new Date(latestProject.allocated_at);
            assignedDate.setDate(assignedDate.getDate() + 15);
            paymentDeadline = assignedDate.toISOString().split('T')[0];
          }
        }
      }
      
      // Prepare worker data
      const workerData = {
        id: user.user_id,
        name: user.name,
        aadhaar_number: user.aadhaar_number,
        phone_number: user.phone_number,
        job_card_id: jobCard.job_card_id,
        head_of_household_name: jobCard.head_of_household_name,
        father_or_husband_name: jobCard.father_or_husband_name,
        category: jobCard.category,
        date_of_registration: jobCard.created_at,
        full_address: jobCard.full_address,
        village: jobCard.village,
        panchayat: jobCard.panchayat,
        block: jobCard.block,
        district: jobCard.district,
        belongs_to_bpl: jobCard.belongs_to_bpl,
        image_url: jobCard.image_url,
        current_status: currentStatus,
        work_history: workHistory,
        total_amount: totalAmount,
        paymentDeadline: paymentDeadline,
        login_time: new Date().toISOString()
      };
      
      const response: ApiResponse = {
        success: true,
        data: workerData,
        message: 'Worker login successful'
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
  // Method to demand work for a worker
  public demandWork = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { jobCardId } = req.body;
      
      // Get user model instance
      const userModel = this.userService.getUserModel();
      
      // First, find the job card by job card ID
      const jobCard = await userModel.getJobCardById(jobCardId);
      if (!jobCard) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Job card not found',
          },
        });
        return;
      }
      
      // Find the user associated with this job card
      const user = await userModel.findByAadhaar(jobCard.aadhaar_number);
      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            message: 'User not found for this job card',
          },
        });
        return;
      }
      
      // Check if user is already assigned to a project
      const workHistory = await userModel.getWorkHistoryByUserId(user.user_id);
      let currentStatus = 'available';
      let currentProject = null;
      
      if (workHistory.length > 0) {
        // Get the most recent project assignment
        const latestProject = workHistory[0]; // Already ordered by allocated_at DESC
        if (latestProject && latestProject.status !== 'completed') {
          currentStatus = 'assigned';
          currentProject = latestProject;
        }
      }
      
      // If already assigned, return error with completion date
      if (currentStatus === 'assigned' && currentProject) {
        // Format the end date for the response
        const endDate = new Date(currentProject.end_date);
        const formattedEndDate = endDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        res.status(400).json({
          success: false,
          error: {
            message: `Worker is already assigned to work, Kindly wait for this work to End`,
            completion_date: formattedEndDate
          },
        });
        return;
      }
      
      // Create a work demand request
      // For now, we'll create a request without a specific project
      // In a real implementation, you might want to let the worker select a project
      const requestData = {
        worker_id: user.user_id,
        status: 'pending' as const
      };
      
      const workDemandRequest = await this.workDemandRequestService.createRequest(requestData);
      
      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Work demand submitted successfully',
          requestId: workDemandRequest.id,
          workerId: user.user_id,
          jobCardId: jobCard.job_card_id
        },
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  

  
  // Validate reCAPTCHA token
  private async isValidCaptcha(captchaToken: string): Promise<boolean> {
    try {
      // In development mode, bypass reCAPTCHA validation entirely
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: bypassing reCAPTCHA validation');
        return true;
      }
      
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      
      if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
        return false;
      }
      
      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
      
      const response = await axios.post(verificationUrl, null, {
        params: {
          secret: secretKey,
          response: captchaToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('reCAPTCHA verification response:', response.data);
      
      // Check if response has the success property and it's true
      if (response.data && typeof response.data.success === 'boolean') {
        return response.data.success === true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error verifying reCAPTCHA:', error.message);
      if (error.response) {
        console.error('reCAPTCHA API error response:', error.response.data);
      }
      return false;
    }
  }
  
  // Expose userService methods for use in controller methods
  public getUserModel() {
    return this.userService.getUserModel();
  }

  // Get workers with job card details and work history (Admin only)
  public getWorkersWithDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Only admins can access this endpoint
      if (req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only admins can access worker details',
          },
        });
        return;
      }

      const workers = await this.userService.getWorkersWithDetails();

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