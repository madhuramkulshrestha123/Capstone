const axios = require('axios');

// Test the login flow
async function testLogin() {
  try {
    const testEmail = 'madhukull2701@gmail.com'; // Your verified email
    console.log('Testing login flow with email:', testEmail);
    
    // Step 1: Send OTP for login
    console.log('\n1. Sending OTP for login...');
    const sendOtpResponse = await axios.post('http://localhost:3001/api/v1/users/login/send-otp', {
      email: testEmail
    });
    
    console.log('Send Login OTP Response:', sendOtpResponse.data);
    
    // Note: In a real scenario, you would receive the OTP via email
    // For testing purposes in development mode, you might see the OTP in logs
    // You would need to check the server logs to get the actual OTP sent
    
    console.log('\nCheck your email (madhukull2701@gmail.com) for the OTP.');
    console.log('Then you would need to call the verify-otp endpoint with the received OTP.');
    
  } catch (error) {
    console.error('Error during login test:', error.response?.data || error.message);
  }
}

testLogin();