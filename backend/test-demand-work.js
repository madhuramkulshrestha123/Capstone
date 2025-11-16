const axios = require('axios');

async function testDemandWork() {
  try {
    const response = await axios.post('http://localhost:3001/api/v1/users/demand-work', {
      jobCardId: 'test-card-id'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testDemandWork();