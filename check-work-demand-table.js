const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function checkTable() {
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
    
    // Check if table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'work_demand_requests'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('Work demand requests table does not exist');
      return;
    }
    
    console.log('Work demand requests table exists');
    
    // Get table structure
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'work_demand_requests' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nWork Demand Requests Table Structure:');
    console.log('-------------------------------------');
    res.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
    
    // Check some sample data
    try {
      const sampleData = await client.query('SELECT * FROM work_demand_requests LIMIT 3');
      console.log('\nSample Data:');
      console.log('------------');
      console.log(sampleData.rows);
    } catch (error) {
      console.log('\nNo sample data available or error fetching data:', error.message);
    }
    
  } catch (error) {
    console.error('Error checking work demand requests table:', error.message);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed');
  }
}

checkTable().catch(console.error);