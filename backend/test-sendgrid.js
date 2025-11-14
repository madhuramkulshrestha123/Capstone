require('dotenv').config();
const sgMail = require('@sendgrid/mail');

async function testSendGrid() {
  try {
    console.log('Testing SendGrid email service...');
    
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Test email - using a placeholder email for now
    // You'll need to verify this email in your SendGrid account
    const msg = {
      to: 'test@example.com', // Change to your email for actual testing
      from: 'madhukull2701@gmail.com', // Using the verified sender from the original code
      subject: 'SendGrid Test - Capstone Application',
      text: 'This is a test email from SendGrid to verify the email service is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
            <h1 style="color: #333;">Capstone Application</h1>
          </div>
          <div style="padding: 30px 0;">
            <h2 style="color: #333;">SendGrid Test</h2>
            <p>This is a test email from SendGrid to verify the email service is working correctly.</p>
            <p>If you received this email, SendGrid is configured correctly!</p>
          </div>
          <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              This is an automated test message from Capstone Application.
            </p>
          </div>
        </div>
      `,
    };

    // Send test email
    await sgMail.send(msg);
    
    console.log('✅ SendGrid test email sent successfully!');
    console.log('Check your email inbox for the test message.');
    
  } catch (error) {
    console.log('❌ SendGrid test failed:');
    console.log('Error:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response body:', error.response.body);
    }
  }
}

// Run the test
testSendGrid().catch(console.error);