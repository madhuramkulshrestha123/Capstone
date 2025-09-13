const axios = require('axios');

// Test the registration flow
async function testRegistration() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    console.log('Testing registration flow with email:', testEmail);
    
    // Step 1: Send OTP for registration
    console.log('\n1. Sending OTP for registration...');
    const sendOtpResponse = await axios.post('http://localhost:3001/api/v1/users/register/send-otp', {
      email: testEmail
    });
    
    console.log('Send OTP Response:', sendOtpResponse.data);
    
    // Extract OTP from response (available in development mode)
    const otp = sendOtpResponse.data.data.otp;
    console.log('Using OTP:', otp);
    
    // Step 2: Verify OTP
    console.log('\n2. Verifying OTP...');
    const verifyOtpResponse = await axios.post('http://localhost:3001/api/v1/users/register/verify-otp', {
      email: testEmail,
      otp: otp
    });
    
    console.log('Verify OTP Response:', verifyOtpResponse.data);
    
    // Step 3: Complete registration
    console.log('\n3. Completing registration...');
    const completeRegResponse = await axios.post('http://localhost:3001/api/v1/users/register/complete', {
      email: testEmail,
      username: `testuser${Date.now()}`,
      first_name: 'Test',
      last_name: 'User',
      role: 'WORKER'
    });
    
    console.log('Complete Registration Response:', completeRegResponse.data);
    
    console.log('\nRegistration flow completed successfully!');
    
  } catch (error) {
    console.error('Error during registration test:', error.response?.data || error.message);
  }
}

testRegistration();