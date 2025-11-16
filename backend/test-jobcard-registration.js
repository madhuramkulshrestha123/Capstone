const axios = require('axios');

// Test job card registration data with different Aadhaar and phone numbers
const testJobCardData = {
  aadhaarNumber: '223456789012', // Changed to a different number
  phoneNumber: '8876543210', // Changed to a different number
  captchaToken: 'dummy-captcha-token',
  password: 'TestPass123!',
  jobCardDetails: {
    familyId: 'FAM001',
    headOfHouseholdName: 'John Doe',
    fatherHusbandName: 'Jane Doe',
    category: 'General',
    dateOfRegistration: '2025-11-08',
    address: '123 Main Street, Village A',
    village: 'Village A',
    panchayat: 'Panchayat X',
    block: 'Block Y',
    district: 'District Z',
    isBPL: false,
    epicNo: 'EPIC001',
    applicants: [
      {
        name: 'John Doe',
        gender: 'Male',
        age: 30,
        bankDetails: 'Bank of India|1234567890|BOII0001234' // Updated format: bankName|accountNumber|ifscCode
      }
    ]
  }
};

async function testJobCardRegistration() {
  try {
    console.log('Testing job card registration...');
    console.log('Sending data:', JSON.stringify(testJobCardData, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/v1/job-cards/register', testJobCardData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Registration failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testJobCardRegistration().catch(console.error);