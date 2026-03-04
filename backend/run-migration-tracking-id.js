require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_tracking_id_to_job_card_applications.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Running migration: add_tracking_id_to_job_card_applications');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('Added tracking_id column to job_card_applications table');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n✅ Done! You can now submit job card applications.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
