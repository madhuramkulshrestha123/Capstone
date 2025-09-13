const axios = require('axios');

async function testOtpEndpoint() {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/users/register/send-otp', {
      email: 'kullmadhu0@gmail.com'
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testOtpEndpoint();