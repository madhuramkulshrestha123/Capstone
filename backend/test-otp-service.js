const { OtpService } = require('./dist/services/OtpService');

async function testOtpService() {
  try {
    console.log('Testing OTP service...');
    
    const otpService = new OtpService();
    
    // Test sending OTP to email only
    console.log('Sending OTP to email only...');
    const result1 = await otpService.sendOtp('test@example.com');
    
    console.log('Result:', result1);
    
    // Test sending OTP to email and phone
    console.log('\nSending OTP to email and phone...');
    const result2 = await otpService.sendOtp('test2@example.com', '+918958166530');
    
    console.log('Result:', result2);
    
  } catch (error) {
    console.log('Error testing OTP service:');
    console.log(error);
  }
}

testOtpService().catch(console.error);