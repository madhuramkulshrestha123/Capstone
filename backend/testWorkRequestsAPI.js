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
let testRequestId = '';

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

async function testCreateWorkRequest() {
  try {
    console.log('\n1. Testing POST /api/v1/work-requests - Create a new work request (Worker only)');
    const requestData = {
      project_id: testProjectId,
      status: 'pending'
    };
    
    const response = await axios.post(`${BASE_URL}/api/v1/work-requests`, requestData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully created work request');
    testRequestId = response.data.data.id;
    console.log(`Work request ID: ${testRequestId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create work request:', error.response?.data || error.message);
    // Log validation details if available
    if (error.response?.data?.error?.details) {
      console.error('Validation details:', JSON.stringify(error.response.data.error.details, null, 2));
    }
    throw error;
  }
}

async function testGetAllWorkRequests() {
  try {
    console.log('\n2. Testing GET /api/v1/work-requests - Get all work requests (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/work-requests`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved all work requests');
    console.log(`Total work requests: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get all work requests:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetWorkRequestById() {
  try {
    console.log('\n3. Testing GET /api/v1/work-requests/:id - Get work request by ID (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/work-requests/${testRequestId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved work request by ID');
    console.log(`Work request status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get work request by ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testUpdateWorkRequest() {
  try {
    console.log('\n4. Testing PUT /api/v1/work-requests/:id - Update work request by ID (Admin only)');
    const updateData = {
      status: 'approved'
    };
    
    const response = await axios.put(`${BASE_URL}/api/v1/work-requests/${testRequestId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully updated work request');
    console.log(`Updated work request status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update work request:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetMyRequests() {
  try {
    console.log('\n5. Testing GET /api/v1/work-requests/my/requests - Get work requests by authenticated worker (Worker only)');
    const response = await axios.get(`${BASE_URL}/api/v1/work-requests/my/requests`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved my work requests');
    console.log(`My work requests: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get my work requests:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetRequestsByProject() {
  try {
    console.log('\n6. Testing GET /api/v1/work-requests/project/:projectId - Get work requests by project ID (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/work-requests/project/${testProjectId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved work requests by project ID');
    console.log(`Work requests for project: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get work requests by project ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testApproveWorkRequest() {
  try {
    console.log('\n7. Testing PATCH /api/v1/work-requests/:id/approve - Approve work request (Admin only)');
    
    // First create a new request to approve
    const requestData = {
      project_id: testProjectId,
      status: 'pending'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/work-requests`, requestData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    const requestIdToApprove = createResponse.data.data.id;
    console.log(`✓ Created work request for approval with ID: ${requestIdToApprove}`);
    
    // Now approve it
    const response = await axios.patch(`${BASE_URL}/api/v1/work-requests/${requestIdToApprove}/approve`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully approved work request');
    console.log(`Approved work request status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to approve work request:', error.response?.data || error.message);
    throw error;
  }
}

async function testRejectWorkRequest() {
  try {
    console.log('\n8. Testing PATCH /api/v1/work-requests/:id/reject - Reject work request (Admin only)');
    
    // First create a new request to reject
    const requestData = {
      project_id: testProjectId,
      status: 'pending'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/work-requests`, requestData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    const requestIdToReject = createResponse.data.data.id;
    console.log(`✓ Created work request for rejection with ID: ${requestIdToReject}`);
    
    // Now reject it
    const response = await axios.patch(`${BASE_URL}/api/v1/work-requests/${requestIdToReject}/reject`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully rejected work request');
    console.log(`Rejected work request status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to reject work request:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeleteWorkRequest() {
  try {
    console.log('\n9. Testing DELETE /api/v1/work-requests/:id - Delete work request by ID (Admin only)');
    
    // First create a new request to delete
    const requestData = {
      project_id: testProjectId,
      status: 'pending'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/work-requests`, requestData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    const requestIdToDelete = createResponse.data.data.id;
    console.log(`✓ Created work request for deletion with ID: ${requestIdToDelete}`);
    
    // Now delete it
    const response = await axios.delete(`${BASE_URL}/api/v1/work-requests/${requestIdToDelete}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully deleted work request');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete work request:', error.response?.data || error.message);
    throw error;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('\n10. Testing unauthorized access - Worker trying to access admin endpoints');
    
    // Test: Worker trying to get all work requests (should fail)
    await axios.get(`${BASE_URL}/api/v1/work-requests`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    
    console.error('❌ Worker was able to access admin-only endpoint (this should not happen)');
    throw new Error('Security issue: Worker accessed admin-only endpoint');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied admin-only access to worker user');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function runWorkRequestsAPITests() {
  try {
    console.log('🧪 Starting Work Requests API Tests...\n');
    
    // Login to get tokens
    console.log('0. Logging in test users...');
    adminToken = await loginUser(adminUser.email, adminUser.password);
    supervisorToken = await loginUser(supervisorUser.email, supervisorUser.password);
    
    // Get a project ID for testing
    await getProjects();
    
    // Run all tests
    await testCreateWorkRequest();
    await testGetAllWorkRequests();
    await testGetWorkRequestById();
    await testUpdateWorkRequest();
    await testGetMyRequests();
    await testGetRequestsByProject();
    await testApproveWorkRequest();
    await testRejectWorkRequest();
    await testDeleteWorkRequest();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 All Work Requests API tests completed successfully!');
  } catch (error) {
    console.error('\n💥 Work Requests API tests failed:', error.message);
    process.exit(1);
  }
}

runWorkRequestsAPITests();