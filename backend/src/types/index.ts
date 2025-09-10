export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: 'WORKER' | 'SUPERVISOR' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: 'WORKER' | 'SUPERVISOR' | 'ADMIN';
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: 'WORKER' | 'SUPERVISOR' | 'ADMIN';
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: 'WORKER' | 'SUPERVISOR' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

// Job Card Types
export interface JobCardApplicant {
  name: string;
  gender: string;
  age: number;
  bankDetails: string;
}

export interface JobCardDetails {
  jobCardNumber: string;
  familyId: string;
  headOfHouseholdName: string;
  fatherHusbandName: string;
  category: string;
  dateOfRegistration: Date;
  address: string;
  village: string;
  panchayat: string;
  block: string;
  district: string;
  isBPL: boolean;
  epicNo: string;
  applicants: JobCardApplicant[];
}

export interface JobCardRegistrationRequest {
  aadhaarNumber: string;
  phoneNumber: string;
  captchaToken: string;
  jobCardDetails: JobCardDetails;
  password: string;
}

export interface JobCardRegistrationResponse {
  userId: number;
  jobCardId: string;
  message: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  worker_need: number;
  start_date: Date;
  end_date: Date;
  status: 'pending' | 'active' | 'completed';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  location?: string;
  worker_need: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  status?: 'pending' | 'active' | 'completed';
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  location?: string;
  worker_need?: number;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  status?: 'pending' | 'active' | 'completed';
}

// Work Demand Request Types
export interface WorkDemandRequest {
  id: string;
  worker_id: number;
  project_id: string;
  request_time: Date;
  status: 'pending' | 'approved' | 'rejected';
  allocated_at?: Date;
}

export interface CreateWorkDemandRequest {
  worker_id: number;
  project_id: string;
  status?: 'pending' | 'approved' | 'rejected';
  allocated_at?: string; // ISO date string
}

export interface UpdateWorkDemandRequest {
  worker_id?: number;
  project_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  allocated_at?: string; // ISO date string
}

// Attendance Types
export interface Attendance {
  id: string;
  worker_id: number;
  project_id: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  marked_by: number;
  created_at: Date;
}

export interface CreateAttendanceRequest {
  worker_id: number;
  project_id: string;
  date: string; // ISO date string
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
}

export interface UpdateAttendanceRequest {
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
}

// Payment Types
export interface Payment {
  id: string;
  worker_id: number;
  project_id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approved_by?: number;
  approved_at?: Date;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentRequest {
  worker_id: number;
  project_id: string;
  amount: number;
}

export interface UpdatePaymentRequest {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  approved_by?: number;
}

// Product Types (keeping for backward compatibility, but should be replaced with Project)
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock_quantity?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}