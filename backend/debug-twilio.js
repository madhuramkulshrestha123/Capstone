require('dotenv').config();
const twilio = require('twilio');

async function debugTwilio() {
  try {
    console.log('Debugging Twilio Configuration...');
    
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    
    console.log('Account SID exists:', !!accountSid);
    console.log('Auth Token exists:', !!authToken);
    console.log('Verify Service SID exists:', !!verifyServiceSid);
    
    if (accountSid && authToken) {
      console.log('Account SID length:', accountSid.length);
      console.log('Auth Token length:', authToken.length);
      
      // Test basic Twilio client creation
      const client = twilio(accountSid, authToken);
      
      // Try to list services to test authentication
      console.log('Testing Twilio authentication...');
      const services = await client.verify.v2.services.list({limit: 1});
      console.log('✅ Twilio authentication successful!');
      console.log('Available services:', services.length);
      
      if (services.length > 0) {
        console.log('First service SID:', services[0].sid);
      }
      
      if (verifyServiceSid) {
        console.log('Testing specific service access...');
        try {
          const service = await client.verify.v2.services(verifyServiceSid).fetch();
          console.log('✅ Service access successful!');
          console.log('Service SID:', service.sid);
          console.log('Service friendly name:', service.friendlyName);
        } catch (serviceError) {
          console.log('❌ Service access failed:');
          console.log('Error:', serviceError.message);
          console.log('Code:', serviceError.code);
        }
      }
    } else {
      console.log('❌ Missing Twilio credentials in environment variables');
    }
  } catch (error) {
    console.log('❌ Error debugging Twilio:');
    console.log('Error:', error.message);
    if (error.code) {
      console.log('Error Code:', error.code);
    }
    if (error.status) {
      console.log('Status:', error.status);
    }
  }
}

// Run the debug
debugTwilio().catch(console.error);