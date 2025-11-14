const axios = require('axios');

async function testTwilioAuth() {
  try {
    console.log('Testing Twilio Authentication...');
    
    const accountSid = 'ACace1c2970d6d4b0eead0e6d54b52c339';
    const authToken = 'fd25b1e419e606210ac868b130db7f14';
    
    console.log('Account SID:', accountSid);
    console.log('Auth Token:', authToken ? '****' + authToken.slice(-4) : 'Not set');
    
    // Test basic authentication
    const response = await axios.get(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      auth: {
        username: accountSid,
        password: authToken
      }
    });
    
    console.log('✅ Twilio Authentication Successful!');
    console.log('Account Status:', response.data.status);
    console.log('Account Friendly Name:', response.data.friendly_name);
    
  } catch (error) {
    console.log('❌ Twilio Authentication Failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      if (error.response.data && error.response.data.message) {
        console.log('Message:', error.response.data.message);
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testTwilioAuth().catch(console.error);