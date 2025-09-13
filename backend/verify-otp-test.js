const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testOtpVerification() {
  try {
    const testEmail = 'kullmadhu0@gmail.com';
    // Use the OTP from the previous test (685328) or run the email delivery test again to get a new one
    
    console.log('Testing OTP verification for:', testEmail);
    console.log('Please make sure you have the correct OTP from the email sent to this address.');
    
    // For testing purposes, you can use the OTP that was logged:
    const otp = '685328'; // Replace with the actual OTP you received
    
    console.log('\n2. Verifying OTP...');
    const verifyOtpResponse = await axios.post(`${BASE_URL}/register/verify-otp`, {
      email: testEmail,
      otp: otp
    });
    
    console.log('Verify OTP Response:', verifyOtpResponse.data);
    
    if (verifyOtpResponse.data.success) {
      console.log('\n✅ OTP verified successfully!');
      console.log('You can now proceed to complete registration.');
      
      console.log('\n📝 Next step - Complete registration:');
      console.log(`   POST ${BASE_URL}/register/complete`);
      console.log(`   Body: { "email": "${testEmail}", "username": "testuser", "first_name": "Test", "last_name": "User", "role": "WORKER" }`);
    }
    
  } catch (error) {
    console.error('Error during OTP verification test:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n❌ Invalid OTP or expired OTP');
      console.log('Please request a new OTP and try again.');
    } else if (error.response?.status === 404) {
      console.log('\n❌ Email not found');
      console.log('Please send OTP first before verifying.');
    }
  }
}

// Run the test
testOtpVerification();