// Simple test script to verify SendGrid integration
const sgMail = require('@sendgrid/mail');

// Set the API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGrid() {
  try {
    const msg = {
      to: 'kullmadhu0@gmail.com', // Your test email
      from: 'madhukull2701@gmail.com', // Your verified sender
      subject: 'OTP Verification Test',
      text: 'This is a test email from SendGrid. Your OTP code is: 123456',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Hello,</p>
          <p>This is a test email from SendGrid.</p>
          <p>Your OTP code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
            123456
          </div>
          <p>This code will expire in 15 minutes.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    console.log('Sending test email...');
    await sgMail.send(msg);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.body);
      console.error('Headers:', error.response.headers);
    }
  }
}

testSendGrid();