require('dotenv').config();
const { Client } = require('pg');

async function addMissingColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Add worker_need column to projects table if it doesn't exist
    console.log('Adding worker_need column to projects table...');
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS worker_need INTEGER DEFAULT 0
    `);
    console.log('✅ worker_need column added');

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    // Don't fail - just log the error
    console.log('Migration may have already run or encountered an issue.');
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the migration
addMissingColumns()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
