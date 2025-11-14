const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function addJobCardImageField() {
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

    // Add image_url column to job_cards table
    const addColumnQuery = `
      ALTER TABLE job_cards 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL;
    `;

    await client.query(addColumnQuery);
    console.log('Successfully added image_url column to job_cards table');

  } catch (error) {
    console.error('Error adding image_url column:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

addJobCardImageField().catch(console.error);