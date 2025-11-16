const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createWorkDemandRequestsTable() {
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

    // Create work_demand_requests table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS work_demand_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        worker_id UUID NOT NULL,
        project_id UUID,  -- Changed from UUID NOT NULL to UUID (nullable)
        request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        allocated_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('Work demand requests table created successfully');

    // Explicitly alter project_id column to allow NULL values
    try {
      await client.query('ALTER TABLE work_demand_requests ALTER COLUMN project_id DROP NOT NULL');
      console.log('project_id column updated to allow NULL values');
    } catch (error) {
      if (error.message.includes('conflicting')) {
        console.log('project_id column already allows NULL values');
      } else {
        throw error;
      }
    }

    // Add foreign key constraints
    const addForeignKeyConstraints = `
      ALTER TABLE work_demand_requests 
      ADD CONSTRAINT fk_work_requests_worker_id 
      FOREIGN KEY (worker_id) REFERENCES users(user_id);
      
      ALTER TABLE work_demand_requests 
      ADD CONSTRAINT fk_work_requests_project_id 
      FOREIGN KEY (project_id) REFERENCES projects(id);
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
      CREATE INDEX IF NOT EXISTS idx_work_requests_worker_id ON work_demand_requests(worker_id);
      CREATE INDEX IF NOT EXISTS idx_work_requests_project_id ON work_demand_requests(project_id);
      CREATE INDEX IF NOT EXISTS idx_work_requests_status ON work_demand_requests(status);
    `;

    await client.query(createIndexesQuery);
    console.log('Indexes created successfully');

  } catch (error) {
    console.error('Error creating work demand requests table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createWorkDemandRequestsTable().catch(console.error);