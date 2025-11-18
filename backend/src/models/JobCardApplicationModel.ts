import Database from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Define the JobCardApplication type
export interface JobCardApplication {
  application_id: string;
  tracking_id: string;
  aadhaar_number: string;
  phone_number: string;
  date_of_birth: Date;
  age: number;
  family_id: string;
  head_of_household_name: string;
  father_or_husband_name: string;
  category: string;
  epic_number: string | null;
  belongs_to_bpl: boolean;
  state: string;
  district: string;
  village: string | null;
  panchayat: string;
  block: string;
  pincode: string | null;
  full_address: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  applicants: any[];
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  job_card_id: string | null;
  created_at: Date;
  updated_at: Date;
}

// Define the type for creating a new application
// Note: tracking_id is generated internally by the model, so it's omitted from the creation type
export type CreateJobCardApplication = Omit<JobCardApplication, 'application_id' | 'tracking_id' | 'created_at' | 'updated_at'> & {
  captchaToken: string;
};

export class JobCardApplicationModel {
  private db: any;

  constructor() {
    this.db = Database.getInstance().client;
  }

  async createApplication(applicationData: CreateJobCardApplication): Promise<JobCardApplication> {
    // Generate a unique tracking ID
    const trackingId = `JC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Set timestamps
    const now = new Date();
    
    const result = await this.db.query(
      `INSERT INTO job_card_applications (
        tracking_id, aadhaar_number, phone_number, date_of_birth, age, family_id, head_of_household_name,
        father_or_husband_name, category, epic_number, belongs_to_bpl, state, district, village,
        panchayat, block, pincode, full_address, bank_name, account_number, ifsc_code, applicants, 
        image_url, status, job_card_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *`,
      [
        trackingId,
        applicationData.aadhaar_number,
        applicationData.phone_number,
        applicationData.date_of_birth,
        applicationData.age,
        applicationData.family_id,
        applicationData.head_of_household_name,
        applicationData.father_or_husband_name,
        applicationData.category,
        applicationData.epic_number || null,
        applicationData.belongs_to_bpl,
        applicationData.state,
        applicationData.district,
        applicationData.village || null,
        applicationData.panchayat,
        applicationData.block,
        applicationData.pincode || null,
        applicationData.full_address,
        applicationData.bank_name,
        applicationData.account_number,
        applicationData.ifsc_code,
        JSON.stringify(applicationData.applicants),
        applicationData.image_url,
        applicationData.status,
        applicationData.job_card_id,
        now,
        now
      ]
    );

    return result.rows[0];
  }

  async findByTrackingId(trackingId: string): Promise<JobCardApplication | null> {
    const result = await this.db.query(
      'SELECT * FROM job_card_applications WHERE tracking_id = $1',
      [trackingId]
    );
    
    return result.rows[0] || null;
  }

  async findByAadhaarNumber(aadhaarNumber: string): Promise<JobCardApplication | null> {
    const result = await this.db.query(
      'SELECT * FROM job_card_applications WHERE aadhaar_number = $1 ORDER BY created_at DESC LIMIT 1',
      [aadhaarNumber]
    );
    
    return result.rows[0] || null;
  }

  async updateStatus(trackingId: string, status: 'pending' | 'approved' | 'rejected', jobCardId?: string): Promise<JobCardApplication | null> {
    const result = await this.db.query(
      'UPDATE job_card_applications SET status = $1, job_card_id = $2, updated_at = NOW() WHERE tracking_id = $3 RETURNING *',
      [status, jobCardId || null, trackingId]
    );
    
    return result.rows[0] || null;
  }

  async getAllApplications(limit: number = 10, offset: number = 0): Promise<JobCardApplication[]> {
    const result = await this.db.query(
      'SELECT * FROM job_card_applications ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }

  async getApplicationsByStatus(status: string, limit: number = 10, offset: number = 0): Promise<JobCardApplication[]> {
    const result = await this.db.query(
      'SELECT * FROM job_card_applications WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    
    return result.rows;
  }
}