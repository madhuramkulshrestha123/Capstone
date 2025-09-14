import Database from '../config/database';
import { JobCardDetails } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define the JobCard type based on the database schema
interface JobCard {
  job_card_id: string; // UUID
  aadhaar_number: string;
  phone_number: string;
  password_hash: string;
  date_of_birth: Date;
  age: number;
  family_id: string;
  head_of_household_name: string;
  father_or_husband_name: string;
  category: string;
  epic_number: string;
  belongs_to_bpl: boolean;
  state: string;
  district: string;
  village: string;
  panchayat: string;
  block: string;
  pincode: string;
  full_address: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  created_at: Date;
  updated_at: Date;
}

// Define the Applicant type based on the database schema
interface Applicant {
  applicant_id: string; // UUID
  job_card_id: string; // UUID, foreign key
  full_name: string;
  date_of_birth: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  created_at: Date;
  updated_at: Date;
}

export class JobCardModel {
  private db: any;

  constructor() {
    this.db = Database.getInstance().client;
  }

  async createJobCard(jobCardData: Omit<JobCard, 'job_card_id' | 'created_at' | 'updated_at'>): Promise<JobCard> {
    // Generate a UUID for job_card_id
    const jobCardId = uuidv4();
    
    // Set timestamps
    const now = new Date();
    
    const jobCard = await this.db.query(
      `INSERT INTO job_cards (
        job_card_id, aadhaar_number, phone_number, password_hash, date_of_birth, age,
        family_id, head_of_household_name, father_or_husband_name, category,
        epic_number, belongs_to_bpl, state, district, village, panchayat,
        block, pincode, full_address, bank_name, account_number, ifsc_code,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`,
      [
        jobCardId,
        jobCardData.aadhaar_number,
        jobCardData.phone_number,
        jobCardData.password_hash,
        jobCardData.date_of_birth,
        jobCardData.age,
        jobCardData.family_id,
        jobCardData.head_of_household_name,
        jobCardData.father_or_husband_name,
        jobCardData.category,
        jobCardData.epic_number,
        jobCardData.belongs_to_bpl,
        jobCardData.state,
        jobCardData.district,
        jobCardData.village,
        jobCardData.panchayat,
        jobCardData.block,
        jobCardData.pincode,
        jobCardData.full_address,
        jobCardData.bank_name,
        jobCardData.account_number,
        jobCardData.ifsc_code,
        now, // created_at
        now  // updated_at
      ]
    );

    return jobCard.rows[0];
  }

  async findByAadhaarNumber(aadhaarNumber: string): Promise<JobCard | null> {
    const result = await this.db.query(
      'SELECT * FROM job_cards WHERE aadhaar_number = $1',
      [aadhaarNumber]
    );
    
    return result.rows[0] || null;
  }

  async findById(jobCardId: string): Promise<JobCard | null> {
    const result = await this.db.query(
      'SELECT * FROM job_cards WHERE job_card_id = $1',
      [jobCardId]
    );
    
    return result.rows[0] || null;
  }

  async addApplicant(applicantData: Omit<Applicant, 'applicant_id' | 'created_at' | 'updated_at'>): Promise<Applicant> {
    const applicant = await this.db.query(
      `INSERT INTO applicants (
        job_card_id, full_name, date_of_birth, age, gender
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        applicantData.job_card_id,
        applicantData.full_name,
        applicantData.date_of_birth,
        applicantData.age,
        applicantData.gender
      ]
    );

    return applicant.rows[0];
  }

  async getApplicantsByJobCardId(jobCardId: string): Promise<Applicant[]> {
    const result = await this.db.query(
      'SELECT * FROM applicants WHERE job_card_id = $1',
      [jobCardId]
    );
    
    return result.rows;
  }
}