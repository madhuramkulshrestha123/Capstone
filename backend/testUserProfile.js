const axios = require('axios');

async function testUserProfile() {
  try {
    console.log('Testing user profile retrieval...');
    
    // First, register a new user
    const registrationData = {
      role: 'supervisor',
      name: 'Profile Test User',
      phone_number: '9876543213',
      aadhaar_number: '123456789015',
      email: 'profile@example.com',
      panchayat_id: '123e4567-e89b-12d3-a456-426614174003',
      government_id: 'GOV123456792',
      password: 'TestPass123!',
      state: 'Test State',
      district: 'Test District',
      village_name: 'Test Village',
      pincode: '123456'
    };
    
    console.log('1. Registering user...');
    const registerResponse = await axios.post('http://localhost:3000/api/v1/users/register', registrationData);
    console.log('Registration successful');
    
    // Login to get token
    const loginData = {
      email: 'profile@example.com',
      password: 'TestPass123!'
    };
    
    console.log('2. Logging in...');
    const loginResponse = await axios.post('http://localhost:3000/api/v1/users/login', loginData);
    const token = loginResponse.data.data.token;
    console.log('Login successful, token received');
    
    // Test profile retrieval
    console.log('3. Retrieving user profile...');
    const profileResponse = await axios.get('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Profile response:', profileResponse.data);
    
    // Verify all fields are present in the response
    const user = profileResponse.data.data;
    console.log('\n--- User Schema Verification ---');
    console.log('user_id:', user.user_id);
    console.log('role:', user.role);
    console.log('name:', user.name);
    console.log('phone_number:', user.phone_number);
    console.log('aadhaar_number:', user.aadhaar_number);
    console.log('email:', user.email);
    console.log('panchayat_id:', user.panchayat_id);
    console.log('government_id:', user.government_id);
    console.log('state:', user.state);
    console.log('district:', user.district);
    console.log('village_name:', user.village_name);
    console.log('pincode:', user.pincode);
    console.log('is_active:', user.is_active);
    console.log('created_at:', user.created_at);
    console.log('updated_at:', user.updated_at);
    
    console.log('✅ Profile test passed! All fields are present.');
  } catch (error) {
    console.error('❌ Profile test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testUserProfile();