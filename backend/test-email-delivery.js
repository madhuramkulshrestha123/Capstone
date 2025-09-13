const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testEmailDelivery() {
  try {
    const testEmail = 'kullmadhu0@gmail.com';
    console.log('Testing email delivery to:', testEmail);
    
    // Step 1: Send OTP for registration
    console.log('\n1. Sending OTP for registration...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/register/send-otp`, {
      email: testEmail
    });
    
    console.log('Send OTP Response:', sendOtpResponse.data);
    
    if (sendOtpResponse.data.success) {
      console.log('\n✅ Email sent successfully according to the system');
      console.log('📧 Please check your email inbox and spam/junk folder for the OTP');
      console.log('⏰ The OTP will expire in 15 minutes');
      
      // Extract OTP from response (available in development mode)
      const otp = sendOtpResponse.data.data.otp;
      console.log('\n🔐 OTP (for testing only):', otp);
      
      console.log('\n📝 Next steps:');
      console.log('1. Check your email at', testEmail);
      console.log('2. Look in both inbox and spam/junk folders');
      console.log('3. If received, use the OTP to verify:');
      console.log(`   POST ${BASE_URL}/register/verify-otp`);
      console.log(`   Body: { "email": "${testEmail}", "otp": "${otp}" }`);
    } else {
      console.log('\n❌ Failed to send OTP');
      console.log('Error:', sendOtpResponse.data.error);
    }
    
  } catch (error) {
    console.error('Error during email delivery test:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      console.log('\n⏰ Rate limit exceeded. Please wait before sending another OTP.');
    } else if (error.response?.status === 400) {
      console.log('\n❌ Bad request. Please check the email format.');
    } else if (error.response?.status === 409) {
      console.log('\n👤 User already exists. Try with a different email.');
    }
  }
}

testEmailDelivery();