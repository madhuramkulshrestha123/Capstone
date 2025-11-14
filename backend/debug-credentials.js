require('dotenv').config();

console.log('=== Twilio Credentials Debug ===');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_VERIFY_SERVICE_SID:', process.env.TWILIO_VERIFY_SERVICE_SID);

console.log('\n=== Credential Analysis ===');
if (process.env.TWILIO_ACCOUNT_SID) {
  console.log('Account SID length:', process.env.TWILIO_ACCOUNT_SID.length);
  console.log('Account SID starts with AC:', process.env.TWILIO_ACCOUNT_SID.startsWith('AC'));
  console.log('Account SID trimmed:', process.env.TWILIO_ACCOUNT_SID.trim());
  console.log('Account SID has extra spaces:', process.env.TWILIO_ACCOUNT_SID !== process.env.TWILIO_ACCOUNT_SID.trim());
}

if (process.env.TWILIO_AUTH_TOKEN) {
  console.log('Auth Token length:', process.env.TWILIO_AUTH_TOKEN.length);
  console.log('Auth Token trimmed:', process.env.TWILIO_AUTH_TOKEN.trim());
  console.log('Auth Token has extra spaces:', process.env.TWILIO_AUTH_TOKEN !== process.env.TWILIO_AUTH_TOKEN.trim());
}

if (process.env.TWILIO_VERIFY_SERVICE_SID) {
  console.log('Verify Service SID length:', process.env.TWILIO_VERIFY_SERVICE_SID.length);
  console.log('Verify Service SID starts with VA:', process.env.TWILIO_VERIFY_SERVICE_SID.startsWith('VA'));
  console.log('Verify Service SID trimmed:', process.env.TWILIO_VERIFY_SERVICE_SID.trim());
  console.log('Verify Service SID has extra spaces:', process.env.TWILIO_VERIFY_SERVICE_SID !== process.env.TWILIO_VERIFY_SERVICE_SID.trim());
}

console.log('\n=== Environment File Check ===');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env file exists');
  const lines = envContent.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('TWILIO_')) {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });
} else {
  console.log('.env file does not exist');
}