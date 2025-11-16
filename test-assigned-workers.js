const axios = require('axios');

async function testAssignedWorkers() {
  try {
    console.log('Testing assigned workers endpoint...');
    
    // Use a valid project ID from your database
    const projectId = '11111111-1111-1111-1111-111111111111'; // Replace with actual project ID
    
    const response = await axios.get(`http://localhost:3001/api/v1/projects/${projectId}/assigned-workers`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE' // Replace with actual admin token
      }
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

testAssignedWorkers();