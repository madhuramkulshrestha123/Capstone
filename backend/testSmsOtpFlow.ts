import { OtpService } from './src/services/OtpService';
import { UserModel } from './src/models/UserModel';

async function testSmsOtpFlow() {
  console.log('Testing SMS OTP flow...');
  
  const otpService = new OtpService();
  const userModel = new UserModel();
  
  // Test user data
  const testEmail = 'test@example.com';
  const testPhoneNumber = '+918958166530';
  
  try {
    // Test sending OTP via both email and SMS
    console.log('Sending OTP via email and SMS...');
    const sendResult = await otpService.sendOtp(testEmail, testPhoneNumber);
    
    if (sendResult.success) {
      console.log('OTP sent successfully!');
      if (sendResult.otp) {
        console.log(`Test OTP (for development): ${sendResult.otp}`);
      }
      
      // If we have the OTP, let's also test verification
      if (sendResult.otp) {
        console.log('Testing OTP verification...');
        const verifyResult = await otpService.verifyOtp(testEmail, sendResult.otp);
        
        if (verifyResult.success) {
          console.log('OTP verification successful!');
        } else {
          console.log('OTP verification failed:', verifyResult.message);
        }
      }
    } else {
      console.log('Failed to send OTP:', sendResult.message);
    }
  } catch (error) {
    console.error('Error testing SMS OTP flow:', error);
  }
}

testSmsOtpFlow();