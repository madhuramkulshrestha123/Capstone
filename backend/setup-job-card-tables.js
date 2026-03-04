require('dotenv').config();
const { Client } = require('pg');

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Create job_card_applications table
    console.log('Creating job_card_applications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_card_applications (
        application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tracking_id VARCHAR(255) UNIQUE NOT NULL,
        aadhaar_number VARCHAR(12) NOT NULL,
        phone_number VARCHAR(10) NOT NULL,
        family_id VARCHAR(50) NOT NULL,
        head_of_household_name VARCHAR(255) NOT NULL,
        father_or_husband_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date_of_registration TIMESTAMP NOT NULL,
        full_address TEXT NOT NULL,
        village VARCHAR(255),
        panchayat VARCHAR(255) NOT NULL,
        block VARCHAR(255) NOT NULL,
        district VARCHAR(255) NOT NULL,
        pincode VARCHAR(6),
        is_bpl BOOLEAN NOT NULL DEFAULT false,
        epic_number VARCHAR(50),
        applicants JSONB NOT NULL,
        image_url TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        rejection_reason TEXT,
        job_card_id UUID,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ job_card_applications table created');

    // Create index on tracking_id
    console.log('Creating index on tracking_id...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_card_applications_tracking_id 
      ON job_card_applications(tracking_id)
    `);
    console.log('✅ Index created');

    // Create index on aadhaar_number for faster lookups
    console.log('Creating index on aadhaar_number...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_card_applications_aadhaar 
      ON job_card_applications(aadhaar_number)
    `);
    console.log('✅ Index on aadhaar_number created');

    // Create users table if it doesn't exist
    console.log('Checking users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        aadhaar_number VARCHAR(12),
        role VARCHAR(50) NOT NULL DEFAULT 'worker' CHECK (role IN ('worker', 'admin', 'official')),
        is_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ users table exists/created');

    // Create job_cards table if it doesn't exist
    console.log('Checking job_cards table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_cards (
        job_card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_card_number VARCHAR(50) UNIQUE NOT NULL,
        aadhaar_number VARCHAR(12) NOT NULL,
        phone_number VARCHAR(10) NOT NULL,
        family_id VARCHAR(50) NOT NULL,
        head_of_household_name VARCHAR(255) NOT NULL,
        father_or_husband_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        full_address TEXT NOT NULL,
        village VARCHAR(255),
        panchayat VARCHAR(255) NOT NULL,
        block VARCHAR(255) NOT NULL,
        district VARCHAR(255) NOT NULL,
        pincode VARCHAR(6),
        is_bpl BOOLEAN NOT NULL DEFAULT false,
        epic_number VARCHAR(50),
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ job_cards table exists/created');

    console.log('\n🎉 All tables created successfully!');
    console.log('You can now submit job card applications.');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the setup
createTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
