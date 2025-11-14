require('dotenv').config();
const twilio = require('twilio');

async function debugTwilioAuth() {
  try {
    console.log('=== Twilio Authentication Debug ===');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    
    console.log('Account SID:', accountSid);
    console.log('Auth Token length:', authToken ? authToken.length : 0);
    console.log('Verify Service SID:', verifyServiceSid);
    
    // Test 1: Basic client creation
    console.log('\n--- Test 1: Client Creation ---');
    const client = twilio(accountSid, authToken);
    console.log('✅ Twilio client created successfully');
    
    // Test 2: Account fetch
    console.log('\n--- Test 2: Account Fetch ---');
    try {
      const account = await client.api.accounts(accountSid).fetch();
      console.log('✅ Account fetch successful');
      console.log('Account Status:', account.status);
    } catch (error) {
      console.log('❌ Account fetch failed');
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
    }
    
    // Test 3: Verify service access
    console.log('\n--- Test 3: Verify Service Access ---');
    try {
      const service = await client.verify.v2.services(verifyServiceSid).fetch();
      console.log('✅ Verify service access successful');
      console.log('Service SID:', service.sid);
      console.log('Service Friendly Name:', service.friendlyName);
    } catch (error) {
      console.log('❌ Verify service access failed');
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
    }
    
    // Test 4: List verify services
    console.log('\n--- Test 4: List Verify Services ---');
    try {
      const services = await client.verify.v2.services.list({limit: 5});
      console.log(`✅ Found ${services.length} verify services`);
      services.forEach((service, index) => {
        console.log(`  ${index + 1}. ${service.sid} - ${service.friendlyName}`);
      });
    } catch (error) {
      console.log('❌ List verify services failed');
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:');
    console.log('Error:', error.message);
  }
}

debugTwilioAuth().catch(console.error);