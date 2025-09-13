const axios = require('axios');

async function testVerifyOtp() {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/users/register/verify-otp', {
      email: 'kullmadhu0@gmail.com',
      otp: '246272'
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testVerifyOtp();