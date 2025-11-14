const axios = require('axios');

// Test job card application data with a different Aadhaar number
const testApplicationData = {
  aadhaarNumber: '423456789012', // Changed to a different number
  phoneNumber: '6876543210', // Changed to a different number
  captchaToken: 'dummy-captcha-token',
  password: 'TestPass123!',
  jobCardDetails: {
    familyId: 'FAM003', // Changed to a different ID
    headOfHouseholdName: 'Robert Johnson',
    fatherHusbandName: 'Michael Johnson',
    category: 'SC',
    dateOfRegistration: '2025-11-08',
    address: '789 Pine Street, Village C',
    village: 'Village C',
    panchayat: 'Panchayat Z',
    block: 'Block A',
    district: 'District Y',
    isBPL: false,
    epicNo: 'EPIC003', // Changed to a different ID
    applicants: [
      {
        name: 'Robert Johnson',
        gender: 'Male',
        age: 35,
        bankDetails: 'Bank of Baroda, Account: 1122334455, IFSC: BARB0001122'
      }
    ]
  }
};

async function testJobCardApplication() {
  try {
    console.log('Testing job card application submission...');
    console.log('Sending data:', JSON.stringify(testApplicationData, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/v1/job-card-applications/submit', testApplicationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Application submitted successfully!');
    console.log('Response:', response.data);
    
    // Test tracking the application
    if (response.data.success && response.data.data.trackingId) {
      const trackingId = response.data.data.trackingId;
      console.log('\nTesting application tracking...');
      
      const trackResponse = await axios.get(`http://localhost:3001/api/v1/job-card-applications/track/${trackingId}`);
      console.log('✅ Tracking successful!');
      console.log('Tracking Response:', trackResponse.data);
    }
  } catch (error) {
    console.log('❌ Test failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testJobCardApplication().catch(console.error);