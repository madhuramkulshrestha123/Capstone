// Test script for chatbot functionality

async function testChatbot() {
  console.log('Testing Chatbot Functionality...\n');
  
  // Test 1: Job Card Data Retrieval
  console.log('1. Testing Job Card Data Retrieval:');
  try {
    const jobCardResponse = await fetch('http://localhost:3001/api/v1/chatbot/job-card/JC-1234567890-123');
    const jobCardData = await jobCardResponse.json();
    console.log('   Job Card Data:', jobCardData.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('   Job Card Data: ERROR -', error.message);
  }
  
  // Test 2: Project Data Retrieval
  console.log('\n2. Testing Project Data Retrieval:');
  try {
    const projectResponse = await fetch('http://localhost:3001/api/v1/chatbot/project/123e4567-e89b-12d3-a456-426614174000');
    const projectData = await projectResponse.json();
    console.log('   Project Data:', projectData.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('   Project Data: ERROR -', error.message);
  }
  
  // Test 3: Payment Data Retrieval
  console.log('\n3. Testing Payment Data Retrieval:');
  try {
    const paymentResponse = await fetch('http://localhost:3001/api/v1/chatbot/payment/123e4567-e89b-12d3-a456-426614174000');
    const paymentData = await paymentResponse.json();
    console.log('   Payment Data:', paymentData.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('   Payment Data: ERROR -', error.message);
  }
  
  // Test 4: Natural Language Processing
  console.log('\n4. Testing Natural Language Processing:');
  try {
    const queryResponse = await fetch('http://localhost:3001/api/v1/chatbot/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'What is the status of my job card?',
        context: {}
      }),
    });
    const queryData = await queryResponse.json();
    console.log('   NLP Query:', queryData.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('   NLP Query: ERROR -', error.message);
  }
  
  console.log('\nChatbot testing completed.');
}

// Run the test
testChatbot();