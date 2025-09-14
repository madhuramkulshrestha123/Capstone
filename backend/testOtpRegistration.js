const axios = require('axios');

async function testOtpRegistration() {
  try {
    console.log('Testing OTP-based registration flow...');
    
    const email = 'otpuser@example.com';
    
    // Step 1: Send OTP for registration
    console.log('1. Sending OTP for registration...');
    const sendOtpResponse = await axios.post('http://localhost:3000/api/v1/users/register/send-otp', { email });
    console.log('Send OTP response:', sendOtpResponse.data);
    
    // Get OTP from response (in development mode, it's included in the response)
    const otp = sendOtpResponse.data.data.otp;
    console.log('OTP received:', otp);
    
    // Step 2: Verify OTP
    console.log('2. Verifying OTP...');
    const verifyOtpResponse = await axios.post('http://localhost:3000/api/v1/users/register/verify-otp', { email, otp });
    console.log('Verify OTP response:', verifyOtpResponse.data);
    
    // Step 3: Complete registration
    console.log('3. Completing registration...');
    const registrationData = {
      email: email,
      role: 'supervisor',
      name: 'OTP Test User',
      phone_number: '9876543212',
      aadhaar_number: '123456789014',
      panchayat_id: '123e4567-e89b-12d3-a456-426614174002',
      government_id: 'GOV123456791',
      password: 'TestPass123!',
      state: 'Test State',
      district: 'Test District',
      village_name: 'Test Village',
      pincode: '123456'
    };
    
    const completeRegistrationResponse = await axios.post('http://localhost:3000/api/v1/users/register/complete', registrationData);
    console.log('Complete registration response:', completeRegistrationResponse.data);
    
    // Step 4: Test login with OTP flow
    console.log('4. Testing OTP-based login...');
    const loginData = {
      email: email,
      password: 'TestPass123!'
    };
    
    const sendLoginOtpResponse = await axios.post('http://localhost:3000/api/v1/users/login/send-otp', loginData);
    console.log('Send login OTP response:', sendLoginOtpResponse.data);
    
    // Get OTP from response (in development mode, it's included in the response)
    const loginOtp = sendLoginOtpResponse.data.data.otp;
    console.log('Login OTP received:', loginOtp);
    
    // Verify login OTP
    const verifyLoginOtpResponse = await axios.post('http://localhost:3000/api/v1/users/login/verify-otp', { email, otp: loginOtp });
    console.log('Verify login OTP response:', verifyLoginOtpResponse.data);
    
    console.log('✅ All OTP tests passed!');
  } catch (error) {
    console.error('❌ OTP test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testOtpRegistration();