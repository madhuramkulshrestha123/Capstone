const axios = require('axios');

async function testUniqueRegistration() {
  try {
    console.log('Testing registration with unique data...');
    
    // Sample registration data 1 (unique values)
    const sampleData1 = {
      role: 'supervisor',
      name: 'Alice Johnson',
      phone_number: '9876543220',
      aadhaar_number: '123456789020',
      email: 'alice.johnson@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440010',
      government_id: 'GOV123456789020',
      password: 'SecurePass123!',
      state: 'Karnataka',
      district: 'Bangalore',
      village_name: 'Electronic City',
      pincode: '560100'
    };
    
    console.log('1. Registering Alice Johnson...');
    const response1 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData1);
    console.log('✓ Alice Johnson registered successfully');
    console.log('User ID:', response1.data.data.user_id);
    
    // Sample registration data 2 (unique values)
    const sampleData2 = {
      role: 'admin',
      name: 'Bob Smith',
      phone_number: '9876543221',
      aadhaar_number: '123456789021',
      email: 'bob.smith@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440011',
      government_id: 'GOV123456789021',
      password: 'AdminPass456@',
      state: 'Maharashtra',
      district: 'Mumbai',
      village_name: 'Bandra',
      pincode: '400050'
    };
    
    console.log('2. Registering Bob Smith...');
    const response2 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData2);
    console.log('✓ Bob Smith registered successfully');
    console.log('User ID:', response2.data.data.user_id);
    
    // Sample registration data 3 (unique values)
    const sampleData3 = {
      role: 'supervisor',
      name: 'Carol Williams',
      phone_number: '9876543222',
      aadhaar_number: '123456789022',
      email: 'carol.williams@example.com',
      panchayat_id: '550e8400-e29b-41d4-a716-446655440012',
      government_id: 'GOV123456789022',
      password: 'WorkerPass789#',
      state: 'Tamil Nadu',
      district: 'Chennai',
      village_name: 'T Nagar',
      pincode: '600017'
    };
    
    console.log('3. Registering Carol Williams...');
    const response3 = await axios.post('http://localhost:3000/api/v1/users/register', sampleData3);
    console.log('✓ Carol Williams registered successfully');
    console.log('User ID:', response3.data.data.user_id);
    
    console.log('\n✅ All sample registrations completed successfully!');
    
    // Test login for one user
    console.log('\n4. Testing login for Alice Johnson...');
    const loginData = {
      email: 'alice.johnson@example.com',
      password: 'SecurePass123!'
    };
    
    const loginResponse = await axios.post('http://localhost:3000/api/v1/users/login', loginData);
    console.log('✓ Login successful for Alice Johnson');
    console.log('Token:', loginResponse.data.data.token.substring(0, 30) + '...');
    
  } catch (error) {
    console.error('❌ Registration test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testUniqueRegistration();