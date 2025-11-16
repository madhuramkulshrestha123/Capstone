import jwt, { SignOptions } from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';
import { AppError } from '../middlewares/errorMiddleware';
import config from '../config';
import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserResponse, 
  LoginRequest, 
  LoginResponse,
  User,
  CreateRegistrationRequest
} from '../types';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  // Expose userModel for use in controller
  public getUserModel(): UserModel {
    return this.userModel;
  }

  // Make generateTokens public for use in controller
  public generateTokens(user: User): { token: string; refreshToken: string } {
    const tokenPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role in token
    };

    // Ensure secrets are properly typed and not undefined
    const jwtSecret = config.jwt.secret;
    const jwtRefreshSecret = config.jwt.refreshSecret;
    
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new AppError('JWT secrets are not configured', 500);
    }

    const signOptions: any = {
      expiresIn: config.jwt.expiresIn,
    };

    const refreshSignOptions: any = {
      expiresIn: config.jwt.refreshExpiresIn,
    };

    const token = jwt.sign(tokenPayload, jwtSecret as string, signOptions);
    const refreshToken = jwt.sign(tokenPayload, jwtRefreshSecret as string, refreshSignOptions);

    return { token, refreshToken };
  }

  private mapUserToResponse(user: User): UserResponse {
    const { password_hash, ...userResponse } = user;
    return userResponse as UserResponse;
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: UserResponse[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.findAll(limit, offset),
      this.userModel.count(),
    ]);

    return {
      users: users.map(user => this.mapUserToResponse(user)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(user_id: string): Promise<UserResponse> {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.mapUserToResponse(user);
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    // Check if user already exists
    const [existingUserByEmail, existingUserByPhone, existingUserByAadhaar, existingUserByGovId] = await Promise.all([
      this.userModel.findByEmail(userData.email),
      this.userModel.findByPhoneNumber(userData.phone_number),
      this.userModel.findByAadhaar(userData.aadhaar_number),
      this.userModel.findByGovernmentId(userData.government_id),
    ]);

    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 409);
    }

    if (existingUserByPhone) {
      throw new AppError('User with this phone number already exists', 409);
    }

    if (existingUserByAadhaar) {
      throw new AppError('User with this Aadhaar number already exists', 409);
    }

    if (existingUserByGovId) {
      throw new AppError('User with this government ID already exists', 409);
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }

    const user = await this.userModel.create(userData);
    return this.mapUserToResponse(user);
  }

  async createRegistration(userData: CreateRegistrationRequest): Promise<UserResponse> {
    // Check if user already exists
    const [existingUserByEmail, existingUserByPhone, existingUserByAadhaar, existingUserByGovId] = await Promise.all([
      this.userModel.findByEmail(userData.email),
      this.userModel.findByPhoneNumber(userData.phone_number),
      this.userModel.findByAadhaar(userData.aadhaar_number),
      this.userModel.findByGovernmentId(userData.government_id),
    ]);

    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 409);
    }

    if (existingUserByPhone) {
      throw new AppError('User with this phone number already exists', 409);
    }

    if (existingUserByAadhaar) {
      throw new AppError('User with this Aadhaar number already exists', 409);
    }

    if (existingUserByGovId) {
      throw new AppError('User with this government ID already exists', 409);
    }

    const user = await this.userModel.createRegistration(userData);
    return this.mapUserToResponse(user);
  }

  async updateUser(user_id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await this.userModel.findById(user_id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Check for email/phone/aadhaar/govId conflicts if being updated
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userModel.findByEmail(userData.email);
      if (userWithEmail && userWithEmail.user_id !== user_id) {
        throw new AppError('User with this email already exists', 409);
      }
    }

    if (userData.phone_number && userData.phone_number !== existingUser.phone_number) {
      const userWithPhone = await this.userModel.findByPhoneNumber(userData.phone_number);
      if (userWithPhone && userWithPhone.user_id !== user_id) {
        throw new AppError('User with this phone number already exists', 409);
      }
    }

    if (userData.aadhaar_number && userData.aadhaar_number !== existingUser.aadhaar_number) {
      const userWithAadhaar = await this.userModel.findByAadhaar(userData.aadhaar_number);
      if (userWithAadhaar && userWithAadhaar.user_id !== user_id) {
        throw new AppError('User with this Aadhaar number already exists', 409);
      }
    }

    if (userData.government_id && userData.government_id !== existingUser.government_id) {
      const userWithGovId = await this.userModel.findByGovernmentId(userData.government_id);
      if (userWithGovId && userWithGovId.user_id !== user_id) {
        throw new AppError('User with this government ID already exists', 409);
      }
    }

    const updatedUser = await this.userModel.update(user_id, userData);
    if (!updatedUser) {
      throw new AppError('Failed to update user', 500);
    }

    return this.mapUserToResponse(updatedUser);
  }

  async deleteUser(user_id: string): Promise<void> {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const deleted = await this.userModel.delete(user_id);
    if (!deleted) {
      throw new AppError('Failed to delete user', 500);
    }
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const user = await this.userModel.verifyPassword(loginData.email, loginData.password);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.is_active) {
      throw new AppError('Account is deactivated', 403);
    }

    const tokens = this.generateTokens(user);
    
    return {
      user: this.mapUserToResponse(user),
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const jwtRefreshSecret = config.jwt.refreshSecret;
      
      if (!jwtRefreshSecret) {
        throw new AppError('JWT refresh secret is not configured', 500);
      }
      
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret as string) as any;
      const user = await this.userModel.findById(decoded.user_id);
      
      if (!user || !user.is_active) {
        throw new AppError('Invalid refresh token', 401);
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  // Get workers with job card details and work history (Admin only)
  async getWorkersWithDetails(): Promise<any[]> {
    try {
      // Get all users with role 'supervisor' (workers in this system)
      const users = await this.userModel.getUsersByRole('supervisor');
      
      // For each worker, get their job card details and work history
      const workersWithDetails = await Promise.all(users.map(async (user) => {
        try {
          // Get job card details
          const jobCard = await this.userModel.getJobCardByUserId(user.user_id);
          
          // Get work history (projects assigned to this worker)
          const workHistory = await this.userModel.getWorkHistoryByUserId(user.user_id);
          
          // Calculate total amount to be paid
          let totalAmount = 0;
          let paymentDeadline = null;
          let currentStatus = 'available';
          
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
          
          return {
            id: user.user_id,
            name: user.name,
            aadhaar_number: user.aadhaar_number,
            job_card_id: jobCard?.job_card_id || null,
            current_status: currentStatus,
            work_history: workHistory,
            total_amount: totalAmount,
            payment_deadline: paymentDeadline,
            district: user.district,
            panchayat_id: user.panchayat_id
          };
        } catch (workerError) {
          console.error(`Error processing worker ${user.user_id}:`, workerError);
          throw workerError;
        }
      }));
      
      return workersWithDetails;
    } catch (error: any) {
      console.error('Error in getWorkersWithDetails:', error);
      throw new AppError('Failed to fetch workers with details: ' + (error.message || 'Unknown error'), 500);
    }
  }
}