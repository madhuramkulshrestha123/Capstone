const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Capstone',
  password: 'Madhuram@123',
  port: 5432,
});

async function testAuth() {
  try {
    await client.connect();
    
    // Create a test user
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('testpassword123', saltRounds);
    const userId = uuidv4();
    
    const insertQuery = `
      INSERT INTO users (
        user_id, role, name, phone_number, aadhaar_number, email, panchayat_id, government_id, 
        password_hash, state, district, village_name, pincode, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()) 
      RETURNING *`;
      
    const values = [
      userId,
      'supervisor',
      'Test User',
      '9876543210',
      '123456789012',
      'test@example.com',
      uuidv4(),
      'GOV123456789',
      passwordHash,
      'Test State',
      'Test District',
      'Test Village',
      '123456',
      true
    ];
    
    const result = await client.query(insertQuery, values);
    console.log('Test user created:', result.rows[0]);
    
    // Test login
    const loginQuery = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const loginResult = await client.query(loginQuery, ['test@example.com']);
    
    if (loginResult.rows.length > 0) {
      const user = loginResult.rows[0];
      const isPasswordValid = await bcrypt.compare('testpassword123', user.password_hash);
      console.log('Login test result:', isPasswordValid ? 'SUCCESS' : 'FAILED');
      console.log('User data:', {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.log('Login test result: FAILED - User not found');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

testAuth();