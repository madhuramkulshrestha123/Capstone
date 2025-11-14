require('dotenv').config();
const twilio = require('twilio');

async function testTwilioVerify() {
  try {
    console.log('Testing Twilio Verify service...');
    
    // Using the credentials from your message
    const accountSid = 'ACace1c2970d6d4b0eead0e6d54b52c339';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_actual_auth_token_here';
    const verifyServiceSid = 'VA6dcd0342967de5f03fc4df67db5b6fb3';
    
    console.log('Account SID:', accountSid);
    console.log('Verify Service SID:', verifyServiceSid);
    console.log('Auth Token available:', !!process.env.TWILIO_AUTH_TOKEN);
    
    if (authToken === 'your_actual_auth_token_here') {
      console.log('❌ Auth Token not configured. Please add your actual Auth Token to the .env file');
      console.log('Format in .env file should be:');
      console.log('TWILIO_AUTH_TOKEN=your_actual_auth_token_here');
      return;
    }
    
    // Create Twilio client
    const client = twilio(accountSid, authToken);
    
    // Test sending verification
    console.log('\nSending verification to +918958166530...');
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({
        to: '+918958166530',
        channel: 'sms'
      });
    
    console.log('✅ Verification sent successfully!');
    console.log('Verification SID:', verification.sid);
    console.log('Verification status:', verification.status);
    
  } catch (error) {
    console.log('❌ Error testing Twilio Verify:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 20003) {
      console.log('\n⚠️  Authentication failed. Please check your Twilio credentials:');
      console.log('1. Verify your Account SID is correct');
      console.log('2. Verify your Auth Token is correct');
      console.log('3. Ensure your Twilio account is active');
      console.log('4. Confirm the Verify Service SID exists in your account');
    }
  }
}

testTwilioVerify().catch(console.error);