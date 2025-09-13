const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testCompleteRegistrationFlow() {
  try {
    // Use a unique email for testing
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    const testUsername = `testuser${timestamp}`;
    
    console.log('🧪 Testing Complete Registration Flow');
    console.log('📧 Email:', testEmail);
    console.log('👤 Username:', testUsername);
    
    // Step 1: Send OTP for registration
    console.log('\n1️⃣ Sending OTP for registration...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/register/send-otp`, {
      email: testEmail
    });
    
    console.log('✅ Send OTP Response:', sendOtpResponse.data);
    
    if (!sendOtpResponse.data.success) {
      console.log('❌ Failed to send OTP');
      return;
    }
    
    // Extract OTP from response (available in development mode)
    const otp = sendOtpResponse.data.data.otp;
    console.log('🔐 OTP (for testing only):', otp);
    
    // Step 2: Verify OTP
    console.log('\n2️⃣ Verifying OTP...');
    const verifyOtpResponse = await axios.post(`${BASE_URL}/register/verify-otp`, {
      email: testEmail,
      otp: otp
    });
    
    console.log('✅ Verify OTP Response:', verifyOtpResponse.data);
    
    if (!verifyOtpResponse.data.success) {
      console.log('❌ Failed to verify OTP');
      return;
    }
    
    // Step 3: Complete registration
    console.log('\n3️⃣ Completing registration...');
    const completeRegResponse = await axios.post(`${BASE_URL}/register/complete`, {
      email: testEmail,
      username: testUsername,
      first_name: 'Test',
      last_name: 'User',
      role: 'WORKER'
    });
    
    console.log('✅ Complete Registration Response:', completeRegResponse.data);
    
    if (!completeRegResponse.data.success) {
      console.log('❌ Failed to complete registration');
      return;
    }
    
    // Extract tokens for future use
    const userData = completeRegResponse.data.data.user;
    console.log('\n🎉 Registration completed successfully!');
    console.log('👤 User ID:', userData.id);
    console.log('📧 Email:', userData.email);
    console.log('👤 Username:', userData.username);
    
    console.log('\n📋 Registration flow completed successfully!');
    console.log('You can now use the login flow with this user.');
    
  } catch (error) {
    console.error('❌ Error during registration flow test:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      console.log('\n⏰ Rate limit exceeded. Please wait before sending another OTP.');
    } else if (error.response?.status === 400) {
      console.log('\n❌ Bad request. Please check the request format.');
    } else if (error.response?.status === 409) {
      console.log('\n👤 User already exists. Try with a different email.');
    }
  }
}

// Run the test
testCompleteRegistrationFlow();