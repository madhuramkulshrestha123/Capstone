const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function updateJobCardApplicationsTable() {
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

    // Add pincode column if it doesn't exist
    const addPincodeColumnQuery = `
      ALTER TABLE job_card_applications 
      ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
    `;

    await client.query(addPincodeColumnQuery);
    console.log('Successfully added pincode column to job_card_applications table');

  } catch (error) {
    console.error('Error updating job_card_applications table:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

updateJobCardApplicationsTable().catch(console.error);