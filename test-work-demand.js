// Simple test script to create a work demand request
const axios = require('axios');

// Use the admin token we generated
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZWQ3ZDE1MDAtMjY4MC00MTJiLWFhMzUtZGEzNzg4ZTU0MzRjIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYzMjI0OTU2LCJleHAiOjE3NjMzMTEzNTZ9.YjFn3UyKQMP0VUVabI_B8BtMdiR7wHt7xOvTuMnAnXM';

async function testWorkDemand() {
  try {
    // Use the job card ID we found in the database
    const jobCardId = '3675328c-c000-4cbb-8e1e-69edac816658';
    
    console.log('Creating work demand request for job card ID:', jobCardId);
    
    const response = await axios.post('http://localhost:3001/api/v1/users/demand-work', {
      jobCardId: jobCardId
    });
    
    console.log('Work demand response:', response.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testWorkDemand();