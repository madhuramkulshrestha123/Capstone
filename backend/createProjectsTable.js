const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createProjectsTable() {
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

    // Create projects table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        worker_need INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('Projects table created successfully');

    // Add foreign key constraint
    const addForeignKeyQuery = `
      ALTER TABLE projects 
      ADD CONSTRAINT fk_projects_created_by 
      FOREIGN KEY (created_by) REFERENCES users(user_id);
    `;

    try {
      await client.query(addForeignKeyQuery);
      console.log('Foreign key constraint added successfully');
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        console.log('Foreign key constraint already exists');
      } else {
        throw error;
      }
    }

    // Create indexes
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
    `;

    await client.query(createIndexesQuery);
    console.log('Indexes created successfully');

  } catch (error) {
    console.error('Error creating projects table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createProjectsTable().catch(console.error);