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
      id: user.id,
      username: user.username,
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

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.mapUserToResponse(user);
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    // Check if user already exists
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      this.userModel.findByEmail(userData.email),
      this.userModel.findByUsername(userData.username),
    ]);

    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 409);
    }

    if (existingUserByUsername) {
      throw new AppError('User with this username already exists', 409);
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
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      this.userModel.findByEmail(userData.email),
      this.userModel.findByUsername(userData.username),
    ]);

    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 409);
    }

    if (existingUserByUsername) {
      throw new AppError('User with this username already exists', 409);
    }

    const user = await this.userModel.createRegistration(userData);
    return this.mapUserToResponse(user);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Check for email/username conflicts if being updated
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userModel.findByEmail(userData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new AppError('User with this email already exists', 409);
      }
    }

    if (userData.username && userData.username !== existingUser.username) {
      const userWithUsername = await this.userModel.findByUsername(userData.username);
      if (userWithUsername && userWithUsername.id !== id) {
        throw new AppError('User with this username already exists', 409);
      }
    }

    const updatedUser = await this.userModel.update(id, userData);
    if (!updatedUser) {
      throw new AppError('Failed to update user', 500);
    }

    return this.mapUserToResponse(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const deleted = await this.userModel.delete(id);
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
      const user = await this.userModel.findById(decoded.id);
      
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
}