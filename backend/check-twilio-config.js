require('dotenv').config();

console.log('=== Twilio Configuration Check ===');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID || 'Not set');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Set (length: ' + process.env.TWILIO_AUTH_TOKEN.length + ')' : 'Not set');
console.log('TWILIO_VERIFY_SERVICE_SID:', process.env.TWILIO_VERIFY_SERVICE_SID || 'Not set');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || 'Not set');

console.log('\n=== Configuration Status ===');
const isConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID);
console.log('Twilio properly configured:', isConfigured ? '✅ Yes' : '❌ No');

if (!isConfigured) {
  console.log('\n⚠️  To enable Twilio SMS functionality:');
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log('  - Add TWILIO_ACCOUNT_SID to .env file');
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.log('  - Add TWILIO_AUTH_TOKEN to .env file');
  }
  if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
    console.log('  - Add TWILIO_VERIFY_SERVICE_SID to .env file');
  }
  console.log('  - Restart the server after updating the configuration');
}

console.log('\n=== Current Behavior ===');
console.log('✅ Email OTP will work regardless of Twilio configuration');
console.log('📱 SMS OTP will be skipped if Twilio is not configured');
console.log('🔐 Authentication flow will continue even if SMS fails');