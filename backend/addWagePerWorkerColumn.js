const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function addWagePerWorkerColumn() {
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

    // Add wage_per_worker column to projects table
    const addColumnQuery = `
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS wage_per_worker INTEGER DEFAULT 374;
    `;

    await client.query(addColumnQuery);
    console.log('wage_per_worker column added successfully to projects table');

    // Update existing projects to have the default wage
    const updateExistingProjectsQuery = `
      UPDATE projects 
      SET wage_per_worker = 374 
      WHERE wage_per_worker IS NULL;
    `;

    await client.query(updateExistingProjectsQuery);
    console.log('Existing projects updated with default wage');

    // Create index on wage_per_worker column
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_projects_wage_per_worker ON projects(wage_per_worker);
    `;

    await client.query(createIndexQuery);
    console.log('Index created on wage_per_worker column');

  } catch (error) {
    console.error('Error adding wage_per_worker column:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

addWagePerWorkerColumn().catch(console.error);