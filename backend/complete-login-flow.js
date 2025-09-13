const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testCompleteLoginFlow() {
  try {
    // Use the same email from the registration test
    const testEmail = 'test-1757703598947@example.com';
    
    console.log('🧪 Testing Complete Login Flow');
    console.log('📧 Email:', testEmail);
    
    // Step 1: Send OTP for login
    console.log('\n1️⃣ Sending OTP for login...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/login/send-otp`, {
      email: testEmail
    });
    
    console.log('✅ Send Login OTP Response:', sendOtpResponse.data);
    
    if (!sendOtpResponse.data.success) {
      console.log('❌ Failed to send login OTP');
      return;
    }
    
    // Extract OTP from response (available in development mode)
    const otp = sendOtpResponse.data.data.otp;
    console.log('🔐 OTP (for testing only):', otp);
    
    // Step 2: Verify OTP and login
    console.log('\n2️⃣ Verifying OTP and logging in...');
    const verifyOtpResponse = await axios.post(`${BASE_URL}/login/verify-otp`, {
      email: testEmail,
      otp: otp
    });
    
    console.log('✅ Login Response:', verifyOtpResponse.data);
    
    if (!verifyOtpResponse.data.success) {
      console.log('❌ Failed to verify OTP or login');
      return;
    }
    
    // Extract tokens
    const { user, token, refreshToken } = verifyOtpResponse.data.data;
    console.log('\n🎉 Login successful!');
    console.log('👤 User ID:', user.id);
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🔑 Access Token length:', token.length);
    console.log('🔄 Refresh Token length:', refreshToken.length);
    
    // Optional: Test using the token to access a protected endpoint
    console.log('\n3️⃣ Testing access token with profile endpoint...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Profile Response:', profileResponse.data);
      console.log('📋 User profile accessed successfully with token!');
    } catch (profileError) {
      console.log('❌ Failed to access profile with token:', profileError.response?.data || profileError.message);
    }
    
    console.log('\n✅ Login flow completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during login flow test:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      console.log('\n⏰ Rate limit exceeded. Please wait before sending another OTP.');
    } else if (error.response?.status === 400) {
      console.log('\n❌ Bad request. Please check the request format.');
    } else if (error.response?.status === 404) {
      console.log('\n❌ User not found. Please check the email address.');
    }
  }
}

// Run the test
testCompleteLoginFlow();