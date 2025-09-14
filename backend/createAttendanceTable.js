const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function createAttendanceTable() {
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

    // Create attendance table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        worker_id UUID NOT NULL,
        project_id UUID NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(10) NOT NULL,
        marked_by UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('Attendance table created successfully');

    // Add foreign key constraints
    const addForeignKeyConstraints = `
      ALTER TABLE attendance 
      ADD CONSTRAINT fk_attendance_worker_id 
      FOREIGN KEY (worker_id) REFERENCES users(user_id);
      
      ALTER TABLE attendance 
      ADD CONSTRAINT fk_attendance_project_id 
      FOREIGN KEY (project_id) REFERENCES projects(id);
      
      ALTER TABLE attendance 
      ADD CONSTRAINT fk_attendance_marked_by 
      FOREIGN KEY (marked_by) REFERENCES users(user_id);
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
      CREATE INDEX IF NOT EXISTS idx_attendance_worker_id ON attendance(worker_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_project_id ON attendance(project_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
      CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
    `;

    await client.query(createIndexesQuery);
    console.log('Indexes created successfully');

  } catch (error) {
    console.error('Error creating attendance table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createAttendanceTable().catch(console.error);