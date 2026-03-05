import Database from '../config/database';
import { JobCardDetails } from '../types';

// Function to generate a job card ID with 4 uppercase letters followed by 8 digits
function generateJobCardId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  // Generate 4 random uppercase letters
  for (let i = 0; i < 4; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 8 random digits
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  return result;
}

// Define the JobCard type based on the database schema
interface JobCard {
  job_card_id: string; // Now using custom format instead of UUID
  aadhaar_number: string;
  phone_number: string;
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
  image_url: string | null; // Update to allow null values
  created_at: Date;
  updated_at: Date;
}

// Define the Applicant type based on the database schema
interface Applicant {
  applicant_id: string; // UUID
  job_card_id: string; // Now using custom format
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
    // Set timestamps
    const now = new Date();
    
    // Check if job card already exists for this aadhaar
    const existingByAadhaar = await this.findByAadhaarNumber(jobCardData.aadhaar_number);
    
    if (existingByAadhaar) {
      // Update existing job card
      const result = await this.db.query(
        `UPDATE job_cards SET
          phone_number = $2,
          family_id = $3,
          head_of_household_name = $4,
          father_or_husband_name = $5,
          category = $6,
          epic_number = $7,
          belongs_to_bpl = $8,
          district = $9,
          village = $10,
          panchayat = $11,
          block = $12,
          full_address = $13,
          bank_name = $14,
          account_number = $15,
          ifsc_code = $16,
          image_url = $17,
          updated_at = NOW()
        WHERE aadhaar_number = $1 RETURNING *`,
        [
          jobCardData.aadhaar_number,
          jobCardData.phone_number,
          jobCardData.family_id,
          jobCardData.head_of_household_name,
          jobCardData.father_or_husband_name,
          jobCardData.category,
          jobCardData.epic_number,
          jobCardData.belongs_to_bpl,
          jobCardData.district,
          jobCardData.village,
          jobCardData.panchayat,
          jobCardData.block,
          jobCardData.full_address,
          jobCardData.bank_name,
          jobCardData.account_number,
          jobCardData.ifsc_code,
          jobCardData.image_url
        ]
      );
      return result.rows[0];
    } else {
      // Create new job card with timestamp-based unique ID
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const jobCardId = `JC${timestamp}${randomPart}`;
      
      try {
        const result = await this.db.query(
          `INSERT INTO job_cards (
            job_card_id, aadhaar_number, phone_number, date_of_birth, age,
            family_id, head_of_household_name, father_or_husband_name, category,
            epic_number, belongs_to_bpl, state, district, village, panchayat,
            block, pincode, full_address, bank_name, account_number, ifsc_code, image_url,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`,
          [
            jobCardId,
            jobCardData.aadhaar_number,
            jobCardData.phone_number,
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
            jobCardData.image_url,
            now,
            now
          ]
        );
        return result.rows[0];
      } catch (error: any) {
        // If duplicate key error, try once more with a new ID
        if (error.code === '23505') {
          const retryJobCardId = `JC${Date.now()}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
          const retryResult = await this.db.query(
            `INSERT INTO job_cards (
              job_card_id, aadhaar_number, phone_number, date_of_birth, age,
              family_id, head_of_household_name, father_or_husband_name, category,
              epic_number, belongs_to_bpl, state, district, village, panchayat,
              block, pincode, full_address, bank_name, account_number, ifsc_code, image_url,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`,
            [
              retryJobCardId,
              jobCardData.aadhaar_number,
              jobCardData.phone_number,
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
              jobCardData.image_url,
              now,
              now
            ]
          );
          return retryResult.rows[0];
        }
        throw error;
      }
    }
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