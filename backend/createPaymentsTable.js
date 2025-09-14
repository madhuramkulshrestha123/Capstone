const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createPaymentsTable() {
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

    // Create payments table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        worker_id UUID NOT NULL,
        project_id UUID NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        approved_by UUID,
        approved_at TIMESTAMP,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('Payments table created successfully');

    // Add foreign key constraints
    const addForeignKeyConstraints = `
      ALTER TABLE payments 
      ADD CONSTRAINT fk_payments_worker_id 
      FOREIGN KEY (worker_id) REFERENCES users(user_id);
      
      ALTER TABLE payments 
      ADD CONSTRAINT fk_payments_project_id 
      FOREIGN KEY (project_id) REFERENCES projects(id);
      
      ALTER TABLE payments 
      ADD CONSTRAINT fk_payments_approved_by 
      FOREIGN KEY (approved_by) REFERENCES users(user_id);
    `;

    try {
      await client.query(addForeignKeyConstraints);
      console.log('Foreign key constraints added successfully');
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        console.log('Foreign key constraints already exist');
      } else {
        throw error;
      }
    }

    // Create indexes
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON payments(worker_id);
      CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_payments_approved_by ON payments(approved_by);
    `;

    await client.query(createIndexesQuery);
    console.log('Indexes created successfully');

  } catch (error) {
    console.error('Error creating payments table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createPaymentsTable().catch(console.error);