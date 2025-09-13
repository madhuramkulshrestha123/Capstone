const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testPasswordValidation() {
  try {
    // Use the same user from the previous test
    const testEmail = 'updated-1757705376532@example.com';
    const correctPassword = 'TestPass123!';
    const wrongPassword = 'WrongPass123!';
    
    console.log('🧪 Testing Password Validation');
    console.log('📧 Email:', testEmail);
    
    // Test 1: Try login with wrong password
    console.log('\n1️⃣ Testing login with wrong password...');
    try {
      const response = await axios.post(`${BASE_URL}/login/send-otp`, {
        email: testEmail,
        password: wrongPassword
      });
      
      console.log('❌ Unexpected success with wrong password:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected wrong password');
        console.log('Error message:', error.response.data.error.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }
    
    // Test 2: Try login with correct password
    console.log('\n2️⃣ Testing login with correct password...');
    try {
      const response = await axios.post(`${BASE_URL}/login/send-otp`, {
        email: testEmail,
        password: correctPassword
      });
      
      console.log('✅ Correctly accepted correct password');
      console.log('Response:', response.data);
      
      // Extract OTP from response (available in development mode)
      const otp = response.data.data.otp;
      console.log('🔐 OTP (for testing only):', otp);
    } catch (error) {
      console.log('❌ Unexpected error with correct password:', error.response?.data || error.message);
    }
    
    // Test 3: Test registration with weak password
    console.log('\n3️⃣ Testing registration with weak password...');
    try {
      const timestamp = Date.now();
      const weakEmail = `weak-${timestamp}@example.com`;
      const weakUsername = `weakuser${timestamp}`;
      const weakPassword = '123'; // Weak password
      
      // First send OTP
      await axios.post(`${BASE_URL}/register/send-otp`, {
        email: weakEmail
      });
      
      // Then verify OTP
      const verifyResponse = await axios.post(`${BASE_URL}/register/verify-otp`, {
        email: weakEmail,
        otp: '123456' // This will be replaced by the actual OTP in a real scenario
      });
      
      // Try to complete registration with weak password
      const completeResponse = await axios.post(`${BASE_URL}/register/complete`, {
        email: weakEmail,
        username: weakUsername,
        first_name: 'Weak',
        last_name: 'Password',
        password: weakPassword, // Weak password
        role: 'WORKER'
      });
      
      console.log('❌ Unexpected success with weak password:', completeResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected weak password');
        console.log('Error message:', error.response.data.error.message);
      } else {
        console.log('❌ Unexpected error with weak password:', error.response?.data || error.message);
      }
    }
    
    console.log('\n✅ Password validation tests completed!');
    
  } catch (error) {
    console.error('❌ Error during password validation test:', error.response?.data || error.message);
  }
}

// Run the test
testPasswordValidation();