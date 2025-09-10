import Database from '../config/database';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export class UserModel {
  private prisma: PrismaClient;

  constructor() {
    const db = Database.getInstance();
    this.prisma = db.client;
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });
    
    return users.map((user) => {
      const result: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        // Default role since we can't select it from DB
        role: 'WORKER',
        is_active: user.isActive,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        password_hash: '',
      };
      
      if (user.firstName !== null) {
        result.first_name = user.firstName;
      }
      
      if (user.lastName !== null) {
        result.last_name = user.lastName;
      }
      
      if (user.avatarUrl !== null) {
        result.avatar_url = user.avatarUrl;
      }
      
      return result;
    });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });

    if (!user) return null;

    const result: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      // Default role since we can't select it from DB
      role: 'WORKER',
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      password_hash: '',
    };
    
    if (user.firstName !== null) {
      result.first_name = user.firstName;
    }
    
    if (user.lastName !== null) {
      result.last_name = user.lastName;
    }
    
    if (user.avatarUrl !== null) {
      result.avatar_url = user.avatarUrl;
    }
    
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        isActive: true,
      },
    });

    if (!user) return null;

    const result: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      // Default role since we can't select it from DB
      role: 'WORKER',
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      password_hash: user.passwordHash,
    };
    
    if (user.firstName !== null) {
      result.first_name = user.firstName;
    }
    
    if (user.lastName !== null) {
      result.last_name = user.lastName;
    }
    
    if (user.avatarUrl !== null) {
      result.avatar_url = user.avatarUrl;
    }
    
    return result;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });

    if (!user) return null;

    const result: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      // Default role since we can't select it from DB
      role: 'WORKER',
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      password_hash: '',
    };
    
    if (user.firstName !== null) {
      result.first_name = user.firstName;
    }
    
    if (user.lastName !== null) {
      result.last_name = user.lastName;
    }
    
    if (user.avatarUrl !== null) {
      result.avatar_url = user.avatarUrl;
    }
    
    return result;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        passwordHash,
        firstName: userData.first_name || null,
        lastName: userData.last_name || null,
        // Note: We're not setting role in DB since the column doesn't exist yet
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    });

    const result: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      // Use the role from the request or default to WORKER
      role: userData.role || 'WORKER',
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      password_hash: '',
    };
    
    if (user.firstName !== null) {
      result.first_name = user.firstName;
    }
    
    if (user.lastName !== null) {
      result.last_name = user.lastName;
    }
    
    if (user.avatarUrl !== null) {
      result.avatar_url = user.avatarUrl;
    }
    
    return result;
  }

  async update(id: number, userData: UpdateUserRequest): Promise<User | null> {
    const updateData: any = {};

    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.first_name !== undefined) updateData.firstName = userData.first_name;
    if (userData.last_name !== undefined) updateData.lastName = userData.last_name;
    if (userData.avatar_url !== undefined) updateData.avatarUrl = userData.avatar_url;
    // Note: We're not updating role in DB since the column doesn't exist yet

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    try {
      const user = await this.prisma.user.update({
        where: {
          id,
          isActive: true,
        },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });

      const result: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        // For updates, we'll need to get the role from the database or use a default
        role: 'WORKER',
        is_active: user.isActive,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        password_hash: '',
      };
      
      if (user.firstName !== null) {
        result.first_name = user.firstName;
      }
      
      if (user.lastName !== null) {
        result.last_name = user.lastName;
      }
      
      if (user.avatarUrl !== null) {
        result.avatar_url = user.avatarUrl;
      }
      
      return result;
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: {
          id,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async count(): Promise<number> {
    return await this.prisma.user.count({
      where: {
        isActive: true,
      },
    });
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password_hash) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  }
}