import Database from '../config/database';
import { CreateUserRequest, CreateRegistrationRequest, UpdateUserRequest } from '../types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Define the User type based on the updated schema
interface User {
  user_id: string;
  role: 'supervisor' | 'admin';
  name: string;
  phone_number: string;
  aadhaar_number: string;
  email: string;
  panchayat_id: string;
  government_id: string;
  password_hash: string;
  state: string;
  district: string;
  village_name: string;
  pincode: string;
  image_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private db: any;

  constructor() {
    this.db = Database.getInstance().client;
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE phone_number = $1 AND is_active = true',
      [phoneNumber]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }
  
  async findByAadhaar(aadhaarNumber: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE aadhaar_number = $1 AND is_active = true',
      [aadhaarNumber]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async findByGovernmentId(governmentId: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE government_id = $1 AND is_active = true',
      [governmentId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async findById(userId: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async create(userData: any): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    const userId = uuidv4();

    const result = await this.db.query(
      `INSERT INTO users (
        user_id, role, name, phone_number, aadhaar_number, email, panchayat_id, government_id, 
        password_hash, state, district, village_name, pincode, image_url, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()) RETURNING *`,
      [
        userId,
        userData.role || 'supervisor',
        userData.name,
        userData.phone_number,
        userData.aadhaar_number,
        userData.email,
        userData.panchayat_id,
        userData.government_id,
        passwordHash,
        userData.state,
        userData.district,
        userData.village_name,
        userData.pincode,
        userData.image_url || null,
        true
      ]
    );

    return result.rows[0];
  }

  async update(userId: string, userData: any): Promise<User | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Build dynamic update query based on provided fields
    if (userData.name) {
      updateFields.push(`name = $${paramCount}`);
      values.push(userData.name);
      paramCount++;
    }
    
    if (userData.phone_number) {
      updateFields.push(`phone_number = $${paramCount}`);
      values.push(userData.phone_number);
      paramCount++;
    }
    
    if (userData.email) {
      updateFields.push(`email = $${paramCount}`);
      values.push(userData.email);
      paramCount++;
    }
    
    if (userData.state) {
      updateFields.push(`state = $${paramCount}`);
      values.push(userData.state);
      paramCount++;
    }
    
    if (userData.district) {
      updateFields.push(`district = $${paramCount}`);
      values.push(userData.district);
      paramCount++;
    }
    
    if (userData.village_name) {
      updateFields.push(`village_name = $${paramCount}`);
      values.push(userData.village_name);
      paramCount++;
    }
    
    if (userData.pincode) {
      updateFields.push(`pincode = $${paramCount}`);
      values.push(userData.pincode);
      paramCount++;
    }
    
    if (userData.role) {
      updateFields.push(`role = $${paramCount}`);
      values.push(userData.role);
      paramCount++;
    }
    
    if (userData.image_url !== undefined) {
      updateFields.push(`image_url = $${paramCount}`);
      values.push(userData.image_url);
      paramCount++;
    }
    
    // If no fields to update, return the existing user
    if (updateFields.length === 0) {
      return this.findById(userId);
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    // Add user_id to values array
    values.push(userId);
    
    const result = await this.db.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = $${paramCount} AND is_active = true RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) return null;
    
    return result.rows[0];
  }
  
  // Method to deactivate a user (soft delete)
  async deactivateUser(userId: string): Promise<boolean> {
    const result = await this.db.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE user_id = $1 RETURNING *',
      [userId]
    );
    
    return result.rows.length > 0;
  }
  
  // Method to verify user credentials for login
  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) return null;
    
    return user;
  }

  // Method to change user password
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await this.db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE user_id = $2 AND is_active = true RETURNING *',
      [passwordHash, userId]
    );
    
    return result.rows.length > 0;
  }

  // Method to get total count of users
  async getTotalCount(): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count);
  }

  // Method to get users by role
  async getUsersByRole(role: string, limit: number = 10, offset: number = 0): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE role = $1 AND is_active = true ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [role, limit, offset]
    );
    
    return result.rows;
  }

  // Method to search users by name or email
  async searchUsers(searchTerm: string, limit: number = 10, offset: number = 0): Promise<User[]> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE (name ILIKE $1 OR email ILIKE $1) AND is_active = true ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [`%${searchTerm}%`, limit, offset]
    );
    
    return result.rows;
  }

  // Method for creating user with password during registration
  async createRegistration(userData: any): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    const userId = uuidv4();

    const result = await this.db.query(
      `INSERT INTO users (
        user_id, role, name, phone_number, aadhaar_number, email, panchayat_id, government_id, 
        password_hash, state, district, village_name, pincode, image_url, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()) RETURNING *`,
      [
        userId,
        userData.role || 'supervisor',
        userData.name,
        userData.phone_number,
        userData.aadhaar_number,
        userData.email,
        userData.panchayat_id,
        userData.government_id,
        passwordHash,
        userData.state,
        userData.district,
        userData.village_name,
        userData.pincode,
        userData.image_url || null,
        true
      ]
    );
    
    return result.rows[0];
  }

  async delete(userId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE user_id = $1 AND is_active = true',
        [userId]
      );
      return result.rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  async count(): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count);
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