const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function runMigration(migrationFile) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`Running migration: ${migrationFile}`);
    
    // Execute the migration
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the specific migration
runMigration('add_tracking_id_to_job_card_applications.sql')
  .then(() => {
    console.log('All migrations completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running migrations:', error);
    process.exit(1);
  });
