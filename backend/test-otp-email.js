const dotenv = require('dotenv');
dotenv.config();

const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  // Test sending an email
  const msg = {
    to: 'madhukull2701@gmail.com', // Your verified email
    from: 'madhukull2701@gmail.com', // Your verified sender
    subject: 'OTP Verification Test',
    text: 'This is a test email to verify SendGrid configuration.',
    html: '<strong>This is a test email to verify SendGrid configuration.</strong>',
  };

  sgMail
    .send(msg)
    .then(() => console.log('Test email sent successfully'))
    .catch((error) => {
      console.error('Error sending test email:', error);
      if (error.response) {
        console.error('Error body:', error.response.body);
      }
    });
} else {
  console.log('SENDGRID_API_KEY is not set in environment variables');
}