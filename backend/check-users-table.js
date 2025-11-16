const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsersTable() {
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

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ users table exists');
      
      // Get table structure
      const tableStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 users table structure:');
      console.table(tableStructure.rows);
      
      // Check if there are any records
      const countResult = await client.query('SELECT COUNT(*) as count FROM users;');
      console.log(`\n📊 users table contains ${countResult.rows[0].count} records`);
    } else {
      console.log('❌ users table does not exist');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

checkUsersTable().catch(console.error);