const axios = require('axios');

async function testLoginFlow() {
  try {
    console.log('Testing login flow...');
    
    const loginData = {
      email: 'test1762630663886@example.com', // Use the email from registration test
      password: 'TestPass123!'
    };
    
    // Step 1: Send OTP for login
    console.log('Step 1: Sending OTP for login...');
    const sendOtpResponse = await axios.post('http://localhost:3001/api/v1/users/login/send-otp', loginData);
    
    console.log('✅ OTP sent successfully for login');
    console.log('Response:', sendOtpResponse.data);
    
    // For development, we can get the OTP from the response
    let otp = '123456'; // Default OTP
    if (sendOtpResponse.data.data && sendOtpResponse.data.data.otp) {
      otp = sendOtpResponse.data.data.otp;
      console.log('Using OTP from response:', otp);
    }
    
    // Step 2: Verify OTP for login
    console.log('\nStep 2: Verifying OTP for login...');
    const verifyOtpResponse = await axios.post('http://localhost:3001/api/v1/users/login/verify-otp', {
      email: loginData.email,
      otp: otp
    });
    
    console.log('✅ OTP verified successfully for login');
    console.log('Response:', verifyOtpResponse.data);
    
    // Check if we got tokens
    if (verifyOtpResponse.data.data && verifyOtpResponse.data.data.token) {
      console.log('✅ Login successful! Got authentication tokens');
      console.log('Token:', verifyOtpResponse.data.data.token.substring(0, 20) + '...');
      console.log('Refresh Token:', verifyOtpResponse.data.data.refreshToken.substring(0, 20) + '...');
      console.log('User Role:', verifyOtpResponse.data.data.user.role);
    }
    
  } catch (error) {
    console.log('❌ Error in login flow:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLoginFlow().catch(console.error);