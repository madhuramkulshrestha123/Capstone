const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to database');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as now');
    console.log('✅ Database query successful:', result.rows[0].now);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

testConnection().catch(console.error);