const { EmailService } = require('./dist/services/EmailService');

async function testOtpEmail() {
  try {
    console.log('Testing OTP email service...');
    
    // Create an instance of the Email service
    const emailService = new EmailService();
    
    // Test email and OTP
    const testEmail = 'test@example.com'; // Change to your email for actual testing
    const testOtp = '123456';
    
    console.log(`Sending OTP ${testOtp} to ${testEmail}`);
    
    // Send OTP email
    const result = await emailService.sendOtpEmail(testEmail, testOtp);
    
    if (result) {
      console.log('✅ OTP email sent successfully!');
      console.log('Check your email inbox for the OTP message.');
    } else {
      console.log('❌ Failed to send OTP email');
    }
  } catch (error) {
    console.log('❌ Error testing OTP email service:');
    console.log('Error:', error.message);
    if (error.stack) {
      console.log('Stack trace:', error.stack);
    }
  }
}

// Run the test
testOtpEmail().catch(console.error);