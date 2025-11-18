-- Database initialization script for Neon PostgreSQL
-- This script creates the necessary tables for your application

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('supervisor', 'admin', 'worker')),
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    panchayat_id VARCHAR(50),
    government_id VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    state VARCHAR(50),
    district VARCHAR(50),
    village_name VARCHAR(100),
    pincode VARCHAR(10),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job_cards table
CREATE TABLE IF NOT EXISTS job_cards (
    job_card_id VARCHAR(12) PRIMARY KEY, -- 4 letters + 8 digits format
    aadhaar_number VARCHAR(12) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    password_hash TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    family_id VARCHAR(50),
    head_of_household_name VARCHAR(100) NOT NULL,
    father_or_husband_name VARCHAR(100),
    category VARCHAR(50),
    epic_number VARCHAR(50),
    belongs_to_bpl BOOLEAN DEFAULT false,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    village VARCHAR(100) NOT NULL,
    panchayat VARCHAR(100) NOT NULL,
    block VARCHAR(100),
    pincode VARCHAR(10),
    full_address TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applicants table (family members)
CREATE TABLE IF NOT EXISTS applicants (
    applicant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_card_id VARCHAR(12) REFERENCES job_cards(job_card_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_date DATE,
    end_date DATE,
    total_workers INTEGER DEFAULT 0,
    wage_per_worker DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create work_demand_requests table
CREATE TABLE IF NOT EXISTS work_demand_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_card_id VARCHAR(12) REFERENCES job_cards(job_card_id),
    worker_id UUID REFERENCES users(user_id),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'allocated')),
    allocated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project_workers table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS project_workers (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, worker_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES users(user_id),
    project_id UUID REFERENCES projects(id),
    date DATE NOT NULL,
    hours_worked DECIMAL(4, 2) DEFAULT 0,
    is_present BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(worker_id, project_id, date)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES users(user_id),
    project_id UUID REFERENCES projects(id),
    attendance_id UUID REFERENCES attendances(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create job_card_applications table
CREATE TABLE IF NOT EXISTS job_card_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL, -- Add the missing tracking_id column
    aadhaar_number VARCHAR(12) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL,
    family_id VARCHAR(50),
    head_of_household_name VARCHAR(100) NOT NULL,
    father_or_husband_name VARCHAR(100),
    category VARCHAR(50),
    epic_number VARCHAR(50),
    belongs_to_bpl BOOLEAN DEFAULT false,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    village VARCHAR(100) NOT NULL,
    panchayat VARCHAR(100) NOT NULL,
    block VARCHAR(100),
    pincode VARCHAR(10),
    full_address TEXT,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_by UUID REFERENCES users(user_id),
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_aadhaar ON users(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_job_cards_aadhaar ON job_cards(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_job_cards_phone ON job_cards(phone_number);
CREATE INDEX IF NOT EXISTS idx_applicants_job_card ON applicants(job_card_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_job_card ON work_demand_requests(job_card_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_worker ON work_demand_requests(worker_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_project ON work_demand_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_work_requests_status ON work_demand_requests(status);
CREATE INDEX IF NOT EXISTS idx_attendances_worker ON attendances(worker_id);
CREATE INDEX IF NOT EXISTS idx_attendances_project ON attendances(project_id);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances(date);
CREATE INDEX IF NOT EXISTS idx_payments_worker ON payments(worker_id);
CREATE INDEX IF NOT EXISTS idx_payments_project ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_job_card_applications_aadhaar ON job_card_applications(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_job_card_applications_status ON job_card_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_card_applications_tracking_id ON job_card_applications(tracking_id); -- Add index for tracking_id

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_cards_updated_at BEFORE UPDATE ON job_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_demand_requests_updated_at BEFORE UPDATE ON work_demand_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_card_applications_updated_at BEFORE UPDATE ON job_card_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();