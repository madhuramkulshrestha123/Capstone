const axios = require('axios');

// Test the demand work feature
async function testDemandWorkFeature() {
  try {
    console.log('Testing demand work feature...');
    
    // Test with a job card ID that should already be assigned
    const response = await axios.post('http://localhost:3001/api/v1/users/demand-work', {
      jobCardId: '3675328c-c000-4cbb-8e1e-69edac816658'
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testDemandWorkFeature();