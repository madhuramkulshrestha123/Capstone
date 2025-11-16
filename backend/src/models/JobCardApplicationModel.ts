import Database from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Define the JobCardApplication type
export interface JobCardApplication {
  application_id: string;
  tracking_id: string;
  aadhaar_number: string;
  phone_number: string;
  family_id: string;
  head_of_household_name: string;
  father_or_husband_name: string;
  category: string;
  date_of_registration: Date;
  full_address: string;
  village: string | null;
  panchayat: string;
  block: string;
  district: string;
  pincode: string | null;
  is_bpl: boolean;
  epic_number: string | null;
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
        tracking_id, aadhaar_number, phone_number, family_id, head_of_household_name,
        father_or_husband_name, category, date_of_registration, full_address, village,
        panchayat, block, district, pincode, is_bpl, epic_number, applicants, image_url, status, job_card_id,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *`,
      [
        trackingId,
        applicationData.aadhaar_number,
        applicationData.phone_number,
        applicationData.family_id,
        applicationData.head_of_household_name,
        applicationData.father_or_husband_name,
        applicationData.category,
        applicationData.date_of_registration,
        applicationData.full_address,
        applicationData.village || null,
        applicationData.panchayat,
        applicationData.block,
        applicationData.district,
        applicationData.pincode || null,
        applicationData.is_bpl,
        applicationData.epic_number || null,
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