const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createJobCardApplicationsTable() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create job_card_applications table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS job_card_applications (
        application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tracking_id VARCHAR(50) UNIQUE NOT NULL,
        aadhaar_number VARCHAR(12) NOT NULL,
        phone_number VARCHAR(10) NOT NULL,
        family_id VARCHAR(50) NOT NULL,
        head_of_household_name VARCHAR(255) NOT NULL,
        father_or_husband_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date_of_registration DATE NOT NULL,
        full_address TEXT NOT NULL,
        village VARCHAR(100),
        panchayat VARCHAR(100) NOT NULL,
        block VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        pincode VARCHAR(10),
        is_bpl BOOLEAN NOT NULL DEFAULT false,
        epic_number VARCHAR(50),
        applicants JSONB NOT NULL,
        image_url VARCHAR(500),
        status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
        job_card_id TEXT, -- Changed to TEXT to match job_cards table
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

    await client.query(createTableQuery);
    console.log('Successfully created job_card_applications table');

    // Create index on tracking_id for faster lookups
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_job_card_applications_tracking_id 
      ON job_card_applications(tracking_id);
    `;

    await client.query(createIndexQuery);
    console.log('Successfully created index on tracking_id');

  } catch (error) {
    console.error('Error creating job_card_applications table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createJobCardApplicationsTable().catch(console.error);