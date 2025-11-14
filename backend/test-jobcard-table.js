const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function testJobCardTable() {
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

    // Check if job_cards table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'job_cards'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ job_cards table exists');
      
      // Get table structure
      const tableStructure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'job_cards' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📋 job_cards table structure:');
      console.table(tableStructure.rows);
      
      // Check if there are any records
      const countResult = await client.query('SELECT COUNT(*) as count FROM job_cards;');
      console.log(`\n📊 job_cards table contains ${countResult.rows[0].count} records`);
    } else {
      console.log('❌ job_cards table does not exist');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

testJobCardTable().catch(console.error);