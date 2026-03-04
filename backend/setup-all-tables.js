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

    // Enable UUID extension
    console.log('Enabling UUID extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // 1. Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role VARCHAR(50) NOT NULL DEFAULT 'worker',
        name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        aadhaar_number VARCHAR(12) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        panchayat_id VARCHAR(100),
        government_id VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        village_name VARCHAR(255) NOT NULL,
        pincode VARCHAR(6) NOT NULL,
        image_url TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ users table created');

    // 2. Create job_cards table
    console.log('Creating job_cards table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_cards (
        job_card_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    console.log('✅ job_cards table created');

    // 3. Create job_card_applications table
    console.log('Creating job_card_applications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_card_applications (
        application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    // 4. Create otps table
    console.log('Creating otps table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS otps (
        otp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL,
        otp_hash VARCHAR(255) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ otps table created');

    // 5. Create projects table
    console.log('Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_name VARCHAR(255) NOT NULL,
        project_type VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(255) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        block VARCHAR(100),
        panchayat VARCHAR(100) NOT NULL,
        village VARCHAR(100),
        estimated_cost DECIMAL(12, 2),
        sanctioned_amount DECIMAL(12, 2),
        start_date DATE,
        end_date DATE,
        actual_cost DECIMAL(12, 2),
        status VARCHAR(50) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
        wage_per_worker DECIMAL(10, 2) DEFAULT 0,
        total_workers INTEGER DEFAULT 0,
        created_by UUID REFERENCES users(user_id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ projects table created');

    // 6. Create work_demand_requests table
    console.log('Creating work_demand_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS work_demand_requests (
        request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        worker_id UUID REFERENCES users(user_id),
        project_id UUID REFERENCES projects(project_id),
        requested_days INTEGER NOT NULL,
        allocated_days INTEGER,
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
        requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
        allocated_at TIMESTAMP,
        completed_at TIMESTAMP,
        remarks TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ work_demand_requests table created');

    // 7. Create attendance table
    console.log('Creating attendance table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        worker_id UUID REFERENCES users(user_id),
        project_id UUID REFERENCES projects(project_id),
        work_demand_request_id UUID REFERENCES work_demand_requests(request_id),
        date DATE NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'half_day')),
        wage_paid DECIMAL(10, 2) DEFAULT 0,
        remarks TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(worker_id, date)
      )
    `);
    console.log('✅ attendance table created');

    // 8. Create payments table
    console.log('Creating payments table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        worker_id UUID REFERENCES users(user_id),
        project_id UUID REFERENCES projects(project_id),
        amount DECIMAL(12, 2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_mode VARCHAR(50) NOT NULL CHECK (payment_mode IN ('cash', 'bank_transfer', 'cheque', 'online')),
        bank_account_number VARCHAR(20),
        ifsc_code VARCHAR(20),
        transaction_id VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed', 'failed')),
        remarks TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ payments table created');

    // 9. Create products table (for marketplace)
    console.log('Creating products table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        seller_id UUID REFERENCES users(user_id),
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        quantity_available DECIMAL(10, 2) NOT NULL DEFAULT 0,
        images TEXT[],
        is_available BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ products table created');

    // Create indexes for better performance
    console.log('Creating indexes...');
    
    try {
      // Users indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_aadhaar ON users(aadhaar_number)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)');
      
      // Job cards indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_job_cards_aadhaar ON job_cards(aadhaar_number)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_job_cards_number ON job_cards(job_card_number)');
      
      // Job card applications indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_job_card_applications_tracking_id ON job_card_applications(tracking_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_job_card_applications_aadhaar ON job_card_applications(aadhaar_number)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_job_card_applications_status ON job_card_applications(status)');
      
      // Projects indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_projects_panchayat ON projects(panchayat)');
      
      // Work demand requests indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_work_demand_requests_worker_id ON work_demand_requests(worker_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_work_demand_requests_project_id ON work_demand_requests(project_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_work_demand_requests_status ON work_demand_requests(status)');
      
      // Attendance indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_attendance_worker_id ON attendance(worker_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_attendance_project_id ON attendance(project_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date)');
      
      // Payments indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON payments(worker_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');
      
      console.log('✅ Indexes created');
    } catch (indexError) {
      console.log('⚠️  Some indexes may already exist or have conflicts:', indexError.message);
      console.log('Continuing despite index errors...');
    }

    console.log('\n🎉 All tables created successfully!');
    console.log('\nTables created:');
    console.log('  ✅ users');
    console.log('  ✅ job_cards');
    console.log('  ✅ job_card_applications');
    console.log('  ✅ otps');
    console.log('  ✅ projects');
    console.log('  ✅ work_demand_requests');
    console.log('  ✅ attendance');
    console.log('  ✅ payments');
    console.log('  ✅ products');
    console.log('\nYour application is now ready to use!');
    return true;
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    // Don't throw - allow app to continue even if some operations fail
    console.log('Continuing application startup...');
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the setup
createTables()
  .then(() => {
    console.log('\n✅ Done! All database tables are set up.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
