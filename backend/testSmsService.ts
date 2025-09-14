import { SMSService } from './src/services/SMSService';

async function testSmsService() {
  const smsService = new SMSService();
  
  // Replace with your actual phone number for testing
  const testPhoneNumber = '+918958166530'; // Your Twilio number
  const testOtp = '123456';
  
  console.log('Testing SMS service...');
  
  try {
    const result = await smsService.sendOtpSms(testPhoneNumber, testOtp);
    if (result) {
      console.log('SMS sent successfully!');
    } else {
      console.log('Failed to send SMS');
    }
  } catch (error) {
    console.error('Error testing SMS service:', error);
  }
}

testSmsService();