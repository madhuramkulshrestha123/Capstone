import axios from 'axios';

async function testSampleRegistration() {
  try {
    console.log('Testing sample registration data...');
    
    // Sample registration data 1
    const sampleData1 = {
      role: 'supervisor',
      name: 'John Doe',
      phone_number: '9876543210',
      aadhaar_number: '123456789012',
      email: 'john.doe@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440000',
      government_id: 'GOV123456789012',
      password: 'SecurePass123!',
      state: 'Karnataka',
      district: 'Bangalore',
      village_name: 'Electronic City',
      pincode: '560100'
    };
    
    console.log('1. Registering John Doe...');
    const response1 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData1);
    console.log('✓ John Doe registered successfully');
    console.log('User ID:', response1.data.data.user_id);
    
    // Sample registration data 2
    const sampleData2 = {
      role: 'admin',
      name: 'Jane Smith',
      phone_number: '9876543211',
      aadhaar_number: '123456789013',
      email: 'jane.smith@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440001',
      government_id: 'GOV123456789013',
      password: 'AdminPass456@',
      state: 'Maharashtra',
      district: 'Mumbai',
      village_name: 'Bandra',
      pincode: '400050'
    };
    
    console.log('2. Registering Jane Smith...');
    const response2 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData2);
    console.log('✓ Jane Smith registered successfully');
    console.log('User ID:', response2.data.data.user_id);
    
    // Sample registration data 3
    const sampleData3 = {
      role: 'supervisor',
      name: 'Robert Johnson',
      phone_number: '9876543212',
      aadhaar_number: '123456789014',
      email: 'robert.johnson@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440002',
      government_id: 'GOV123456789014',
      password: 'WorkerPass789#',
      state: 'Tamil Nadu',
      district: 'Chennai',
      village_name: 'T Nagar',
      pincode: '600017'
    };
    
    console.log('3. Registering Robert Johnson...');
    const response3 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData3);
    console.log('✓ Robert Johnson registered successfully');
    console.log('User ID:', response3.data.data.user_id);
    
    console.log('\n✅ All sample registrations completed successfully!');
    
    // Test login for one user
    console.log('\n4. Testing login for John Doe...');
    const loginData = {
      email: 'john.doe@example.com',
      password: 'SecurePass123!'
    };
    
    const loginResponse = await axios.post('http://localhost:3000/api/v1/users/login', loginData);
    console.log('✓ Login successful for John Doe');
    console.log('Token:', loginResponse.data.data.token.substring(0, 30) + '...');
    
  } catch (error) {
    console.error('❌ Registration test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', (error as Error).message);
    }
  }
}

testSampleRegistration();