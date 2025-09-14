const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Test users
const adminUser = {
  email: 'admin@test.com',
  password: 'AdminPass123!'
};

const supervisorUser = {
  email: 'supervisor@test.com',
  password: 'SupervisorPass123!'
};

let adminToken = '';
let supervisorToken = '';
let testProjectId = '';
let testPaymentId = '';

async function loginUser(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/users/login`, { email, password });
    console.log(`✓ Login successful for ${email}`);
    return response.data.data.token;
  } catch (error) {
    console.error(`❌ Login failed for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

async function getProjects() {
  try {
    console.log('\nGetting a project ID for testing...');
    const response = await axios.get(`${BASE_URL}/api/v1/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (response.data.data && response.data.data.length > 0) {
      testProjectId = response.data.data[0].id;
      console.log(`✓ Using project ID: ${testProjectId}`);
    } else {
      throw new Error('No projects found in the database');
    }
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get projects:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreatePayment() {
  try {
    console.log('\n1. Testing POST /api/v1/payments - Create a new payment (Admin only)');
    
    // Get the supervisor's user ID from the token
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId, // Using supervisor as worker for testing
      project_id: testProjectId,
      amount: 1000.00
    };
    
    const response = await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully created payment');
    testPaymentId = response.data.data.id;
    console.log(`Payment ID: ${testPaymentId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create payment:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAllPayments() {
  try {
    console.log('\n2. Testing GET /api/v1/payments - Get all payments (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/payments`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved all payments');
    console.log(`Total payments: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get all payments:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetPaymentById() {
  try {
    console.log('\n3. Testing GET /api/v1/payments/:id - Get payment by ID (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/payments/${testPaymentId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved payment by ID');
    console.log(`Payment amount: ${response.data.data.amount}`);
    console.log(`Payment status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get payment by ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testUpdatePayment() {
  try {
    console.log('\n4. Testing PUT /api/v1/payments/:id - Update payment by ID (Admin only)');
    const updateData = {
      amount: 1500.00
    };
    
    const response = await axios.put(`${BASE_URL}/api/v1/payments/${testPaymentId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully updated payment');
    console.log(`Updated payment amount: ${response.data.data.amount}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update payment:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetMyPayments() {
  try {
    console.log('\n5. Testing GET /api/v1/payments/my/payments - Get payments for authenticated worker (Worker only)');
    const response = await axios.get(`${BASE_URL}/api/v1/payments/my/payments`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved my payments');
    console.log(`My payments: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get my payments:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetPaymentsByProject() {
  try {
    console.log('\n6. Testing GET /api/v1/payments/project/:projectId - Get payments by project ID (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/payments/project/${testProjectId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved payments by project ID');
    console.log(`Payments for project: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get payments by project ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testApprovePayment() {
  try {
    console.log('\n7. Testing PATCH /api/v1/payments/:id/approve - Approve payment (Admin only)');
    
    // First create a new payment to approve
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      amount: 2000.00
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const paymentIdToApprove = createResponse.data.data.id;
    console.log(`✓ Created payment for approval with ID: ${paymentIdToApprove}`);
    
    // Now approve it
    const response = await axios.patch(`${BASE_URL}/api/v1/payments/${paymentIdToApprove}/approve`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully approved payment');
    console.log(`Approved payment status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to approve payment:', error.response?.data || error.message);
    throw error;
  }
}

async function testRejectPayment() {
  try {
    console.log('\n8. Testing PATCH /api/v1/payments/:id/reject - Reject payment (Admin only)');
    
    // First create a new payment to reject
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      amount: 2500.00
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const paymentIdToReject = createResponse.data.data.id;
    console.log(`✓ Created payment for rejection with ID: ${paymentIdToReject}`);
    
    // Now reject it
    const response = await axios.patch(`${BASE_URL}/api/v1/payments/${paymentIdToReject}/reject`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully rejected payment');
    console.log(`Rejected payment status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to reject payment:', error.response?.data || error.message);
    throw error;
  }
}

async function testMarkAsPaid() {
  try {
    console.log('\n9. Testing PATCH /api/v1/payments/:id/paid - Mark payment as paid (Admin only)');
    
    // First create a new payment to mark as paid
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      amount: 3000.00
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const paymentIdToMarkPaid = createResponse.data.data.id;
    console.log(`✓ Created payment to mark as paid with ID: ${paymentIdToMarkPaid}`);
    
    // First approve the payment (required before marking as paid)
    await axios.patch(`${BASE_URL}/api/v1/payments/${paymentIdToMarkPaid}/approve`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    // Now mark it as paid
    const response = await axios.patch(`${BASE_URL}/api/v1/payments/${paymentIdToMarkPaid}/paid`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully marked payment as paid');
    console.log(`Paid payment status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to mark payment as paid:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeletePayment() {
  try {
    console.log('\n10. Testing DELETE /api/v1/payments/:id - Delete payment by ID (Admin only)');
    
    // First create a new payment to delete
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      amount: 3500.00
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const paymentIdToDelete = createResponse.data.data.id;
    console.log(`✓ Created payment for deletion with ID: ${paymentIdToDelete}`);
    
    // Now delete it
    const response = await axios.delete(`${BASE_URL}/api/v1/payments/${paymentIdToDelete}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully deleted payment');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete payment:', error.response?.data || error.message);
    throw error;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('\n11. Testing unauthorized access - Worker trying to access admin endpoints');
    
    // Test: Worker trying to create a payment (should fail)
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    const paymentData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      amount: 1000.00
    };
    
    await axios.post(`${BASE_URL}/api/v1/payments`, paymentData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    
    console.error('❌ Supervisor was able to create payment (this should not happen)');
    throw new Error('Security issue: Supervisor created payment');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied payment creation to supervisor user');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function runPaymentAPITests() {
  try {
    console.log('🧪 Starting Payment API Tests...\n');
    
    // Login to get tokens
    console.log('0. Logging in test users...');
    adminToken = await loginUser(adminUser.email, adminUser.password);
    supervisorToken = await loginUser(supervisorUser.email, supervisorUser.password);
    
    // Get a project ID for testing
    await getProjects();
    
    // Run all tests
    await testCreatePayment();
    await testGetAllPayments();
    await testGetPaymentById();
    await testUpdatePayment();
    await testGetMyPayments();
    await testGetPaymentsByProject();
    await testApprovePayment();
    await testRejectPayment();
    await testMarkAsPaid();
    await testDeletePayment();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 All Payment API tests completed successfully!');
  } catch (error) {
    console.error('\n💥 Payment API tests failed:', error.message);
    process.exit(1);
  }
}

runPaymentAPITests();