require('dotenv').config();
const twilio = require('twilio');

async function testTwilioOTP() {
  try {
    console.log('Testing Twilio OTP service...');
    
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACace1c2970d6d4b0eead0e6d54b52c339';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'fd25b1e419e606210ac868b130db7f14';
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || 'VA6dcd0342967de5f03fc4df67db5b6fb3';
    
    console.log('Account SID:', accountSid);
    console.log('Verify Service SID:', verifyServiceSid);
    
    // Create Twilio client
    const client = twilio(accountSid, authToken);
    
    // Test phone number (using the verified number)
    const testPhoneNumber = '+918958166530';
    
    console.log(`Sending OTP to: ${testPhoneNumber}`);
    
    // Send OTP via Twilio Verify
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({
        to: testPhoneNumber,
        channel: 'sms'
      });
    
    console.log('✅ OTP sent successfully via Twilio Verify!');
    console.log('Verification SID:', verification.sid);
    console.log('Status:', verification.status);
    console.log('Check your phone for the OTP.');
    
  } catch (error) {
    console.log('❌ Error testing Twilio OTP service:');
    console.log('Error:', error.message);
    if (error.code) {
      console.log('Error Code:', error.code);
    }
    if (error.moreInfo) {
      console.log('More Info:', error.moreInfo);
    }
    if (error.status) {
      console.log('Status:', error.status);
    }
  }
}

// Run the test
testTwilioOTP().catch(console.error);