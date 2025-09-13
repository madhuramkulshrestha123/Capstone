// Simple test script to verify OTP flow
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

// We'll store the OTP here for testing
let currentOtp = '';

// Override console.log to capture OTP
const originalLog = console.log;
console.log = function(...args) {
  // Check if this is an OTP log message
  const message = args.join(' ');
  if (message.includes('[DEV] OTP for')) {
    // Extract OTP from message
    const match = message.match(/OTP for .*: (\d+)/);
    if (match) {
      currentOtp = match[1];
      console.log('Captured OTP:', currentOtp);
    }
  }
  originalLog.apply(console, args);
};

async function testRegistrationFlow() {
  const testEmail = `test-${Date.now()}@example.com`;
  console.log('Testing registration flow with email:', testEmail);
  
  try {
    // Step 1: Send OTP for registration
    console.log('\n1. Sending OTP for registration...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/register/send-otp`, {
      email: testEmail
    });
    console.log('Send OTP Response:', sendOtpResponse.data);
    
    // Wait a moment for OTP to be logged
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Using OTP:', currentOtp);
    
    // Step 2: Verify OTP
    console.log('\n2. Verifying OTP...');
    const verifyOtpResponse = await axios.post(`${BASE_URL}/register/verify-otp`, {
      email: testEmail,
      otp: currentOtp
    });
    console.log('Verify OTP Response:', verifyOtpResponse.data);
    
    // Step 3: Complete registration
    console.log('\n3. Completing registration...');
    const completeRegResponse = await axios.post(`${BASE_URL}/register/complete`, {
      email: testEmail,
      username: `testuser${Date.now()}`,
      first_name: 'Test',
      last_name: 'User',
      role: 'WORKER'
    });
    console.log('Complete Registration Response:', completeRegResponse.data);
    
    console.log('\nRegistration flow completed successfully!');
    
  } catch (error) {
    console.error('Error in registration flow:', error.response ? error.response.data : error.message);
  }
}

async function testLoginFlow() {
  // For login test, we'll need to use an existing user
  // Let's first create a test user through the legacy registration endpoint
  const testEmail = `login-${Date.now()}@example.com`;
  const testUsername = `loginuser${Date.now()}`;
  
  try {
    // First, register a user using the legacy endpoint
    console.log('\n\nCreating test user for login...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      username: testUsername,
      email: testEmail,
      password: 'TestPass123!',
      first_name: 'Login',
      last_name: 'Test'
    });
    console.log('User created:', registerResponse.data);
    
    // Now test the OTP login flow
    console.log('\nTesting login flow with email:', testEmail);
    
    // Step 1: Send OTP for login
    console.log('\n1. Sending OTP for login...');
    const sendOtpResponse = await axios.post(`${BASE_URL}/login/send-otp`, {
      email: testEmail
    });
    console.log('Send Login OTP Response:', sendOtpResponse.data);
    
    // Wait a moment for OTP to be logged
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Using OTP:', currentOtp);
    
    // Step 2: Verify OTP and login
    console.log('\n2. Verifying OTP and logging in...');
    const verifyOtpResponse = await axios.post(`${BASE_URL}/login/verify-otp`, {
      email: testEmail,
      otp: currentOtp
    });
    console.log('Login Response:', verifyOtpResponse.data);
    
    console.log('\nLogin flow completed successfully!');
    
  } catch (error) {
    console.error('Error in login flow:', error.response ? error.response.data : error.message);
  }
}

// Run the tests
async function runTests() {
  await testRegistrationFlow();
  await testLoginFlow();
}

runTests();