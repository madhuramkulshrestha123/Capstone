const axios = require('axios');

async function testLoginRegistration() {
  try {
    console.log('Testing registration and login flow...');
    
    // Test registration
    const registrationData = {
      role: 'supervisor',
      name: 'Test User',
      phone_number: '9876543210',
      aadhaar_number: '123456789012',
      email: 'test@example.com',
      panchayat_id: '123e4567-e89b-12d3-a456-426614174000',
      government_id: 'GOV123456789',
      password: 'TestPass123!',
      state: 'Test State',
      district: 'Test District',
      village_name: 'Test Village',
      pincode: '123456'
    };
    
    console.log('1. Sending registration data...');
    const registerResponse = await axios.post('http://localhost:3000/api/v1/users/register', registrationData);
    console.log('Registration response:', registerResponse.data);
    
    // Test login
    const loginData = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };
    
    console.log('2. Sending login data...');
    const loginResponse = await axios.post('http://localhost:3000/api/v1/users/login', loginData);
    console.log('Login response:', loginResponse.data);
    
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testLoginRegistration();