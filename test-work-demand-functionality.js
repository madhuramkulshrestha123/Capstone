const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function testWorkDemandFunctionality() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check if work_demand_requests table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'work_demand_requests'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Work demand requests table exists');
      
      // Check table structure
      const tableStructure = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'work_demand_requests' 
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Table Structure:');
      tableStructure.rows.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type}`);
      });
      
      // Check if there are any records
      const recordCount = await client.query('SELECT COUNT(*) as count FROM work_demand_requests');
      console.log(`\n📊 Record Count: ${recordCount.rows[0].count}`);
      
      if (recordCount.rows[0].count > 0) {
        // Show sample records
        const sampleRecords = await client.query('SELECT * FROM work_demand_requests LIMIT 3');
        console.log('\n📝 Sample Records:');
        sampleRecords.rows.forEach((record, index) => {
          console.log(`  Record ${index + 1}:`, JSON.stringify(record, null, 2));
        });
      } else {
        console.log('\n📭 No records found in work_demand_requests table');
      }
    } else {
      console.log('❌ Work demand requests table does not exist');
    }
    
    // Check related tables
    console.log('\n🔍 Checking related tables...');
    
    const usersTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (usersTable.rows[0].exists) {
      console.log('✅ Users table exists');
    } else {
      console.log('❌ Users table does not exist');
    }
    
    const projectsTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'projects'
      );
    `);
    
    if (projectsTable.rows[0].exists) {
      console.log('✅ Projects table exists');
    } else {
      console.log('❌ Projects table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('\n🔒 Database connection closed');
  }
}

testWorkDemandFunctionality().catch(console.error);