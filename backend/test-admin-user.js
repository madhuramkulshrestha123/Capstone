const { Client } = require('pg');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

async function testAdminUser() {
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

    // Check if there are any admin users
    const adminUsers = await client.query(`
      SELECT * FROM users WHERE role = 'admin' AND is_active = true LIMIT 1;
    `);
    
    if (adminUsers.rows.length > 0) {
      console.log('✅ Found admin user:');
      console.log(adminUsers.rows[0]);
      
      // Generate a JWT token for this user
      const user = adminUsers.rows[0];
      const tokenPayload = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_here';
      const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '24h' });
      
      console.log('\n📋 Generated JWT token:');
      console.log(token);
      
      console.log('\n📋 You can use this token in your API requests with the header:');
      console.log(`Authorization: Bearer ${token}`);
    } else {
      console.log('❌ No admin users found');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

testAdminUser().catch(console.error);