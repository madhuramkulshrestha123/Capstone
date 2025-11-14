const axios = require('axios');

async function testRegistrationFlow() {
  try {
    console.log('Testing registration flow...');
    
    // Generate unique test data
    const timestamp = Date.now();
    const testData = {
      email: `test${timestamp}@example.com`,
      name: 'Test User',
      phone_number: `123456789${timestamp.toString().slice(-1)}`, // Ensure 10 digits
      aadhaar_number: `12345678901${timestamp.toString().slice(-1)}`, // Ensure 12 digits
      panchayat_id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
      government_id: `EMP${timestamp}`,
      password: 'TestPass123!',
      state: 'Test State',
      district: 'Test District',
      village_name: 'Test Village',
      pincode: '123456'
    };
    
    console.log('Using test data:', testData);
    
    // Step 1: Send OTP
    console.log('Step 1: Sending OTP...');
    const sendOtpResponse = await axios.post('http://localhost:3001/api/v1/users/register/send-otp', {
      email: testData.email
    });
    
    console.log('✅ OTP sent successfully');
    console.log('Response:', sendOtpResponse.data);
    
    // For development, we can get the OTP from the response
    let otp = '123456'; // Default OTP
    if (sendOtpResponse.data.data && sendOtpResponse.data.data.otp) {
      otp = sendOtpResponse.data.data.otp;
      console.log('Using OTP from response:', otp);
    }
    
    // Step 2: Verify OTP
    console.log('\nStep 2: Verifying OTP...');
    const verifyOtpResponse = await axios.post('http://localhost:3001/api/v1/users/register/verify-otp', {
      email: testData.email,
      otp: otp
    });
    
    console.log('✅ OTP verified successfully');
    console.log('Response:', verifyOtpResponse.data);
    
    // Step 3: Complete registration
    console.log('\nStep 3: Completing registration...');
    const completeRegResponse = await axios.post('http://localhost:3001/api/v1/users/register/complete', testData);
    
    console.log('✅ Registration completed successfully');
    console.log('Response:', completeRegResponse.data);
    
  } catch (error) {
    console.log('❌ Error in registration flow:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegistrationFlow().catch(console.error);