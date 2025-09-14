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
let testAttendanceId = '';

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

async function testMarkAttendance() {
  try {
    console.log('\n1. Testing POST /api/v1/attendances - Mark attendance (Supervisor/Admin only)');
    
    // Get the supervisor's user ID from the token
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    // Use two days ago to avoid conflicts
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const attendanceData = {
      worker_id: supervisorId, // Using supervisor as worker for testing
      project_id: testProjectId,
      date: twoDaysAgo.toISOString().split('T')[0], // Two days ago
      status: 'PRESENT'
    };
    
    const response = await axios.post(`${BASE_URL}/api/v1/attendances`, attendanceData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully marked attendance');
    testAttendanceId = response.data.data.id;
    console.log(`Attendance ID: ${testAttendanceId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to mark attendance:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAllAttendances() {
  try {
    console.log('\n2. Testing GET /api/v1/attendances - Get all attendance records (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/attendances`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved all attendance records');
    console.log(`Total attendance records: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get all attendance records:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAttendanceById() {
  try {
    console.log('\n3. Testing GET /api/v1/attendances/:id - Get attendance record by ID (Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/attendances/${testAttendanceId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved attendance record by ID');
    console.log(`Attendance status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get attendance record by ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testUpdateAttendance() {
  try {
    console.log('\n4. Testing PUT /api/v1/attendances/:id - Update attendance record (Supervisor/Admin only)');
    const updateData = {
      status: 'ABSENT'
    };
    
    const response = await axios.put(`${BASE_URL}/api/v1/attendances/${testAttendanceId}`, updateData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully updated attendance record');
    console.log(`Updated attendance status: ${response.data.data.status}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update attendance record:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetMyAttendances() {
  try {
    console.log('\n5. Testing GET /api/v1/attendances/my/attendances - Get attendance records for authenticated worker (Worker only)');
    const response = await axios.get(`${BASE_URL}/api/v1/attendances/my/attendances`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved my attendance records');
    console.log(`My attendance records: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get my attendance records:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAttendancesByProject() {
  try {
    console.log('\n6. Testing GET /api/v1/attendances/project/:projectId - Get attendance records by project ID (Supervisor/Admin only)');
    const response = await axios.get(`${BASE_URL}/api/v1/attendances/project/${testProjectId}`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved attendance records by project ID');
    console.log(`Attendance records for project: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get attendance records by project ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAttendancesByDateRange() {
  try {
    console.log('\n7. Testing GET /api/v1/attendances/project/:projectId/date-range - Get attendance records by project and date range (Supervisor/Admin only)');
    
    // Calculate date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const response = await axios.get(`${BASE_URL}/api/v1/attendances/project/${testProjectId}/date-range`, {
      headers: { Authorization: `Bearer ${supervisorToken}` },
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });
    console.log('✓ Successfully retrieved attendance records by date range');
    console.log(`Attendance records in date range: ${response.data.data?.length || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get attendance records by date range:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeleteAttendance() {
  try {
    console.log('\n8. Testing DELETE /api/v1/attendances/:id - Delete attendance record (Admin only)');
    
    // First create a new attendance record to delete
    const decodedToken = JSON.parse(Buffer.from(supervisorToken.split('.')[1], 'base64').toString());
    const supervisorId = decodedToken.user_id;
    
    // Use three days ago to avoid conflicts
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const attendanceData = {
      worker_id: supervisorId,
      project_id: testProjectId,
      date: threeDaysAgo.toISOString().split('T')[0],
      status: 'LEAVE'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/attendances`, attendanceData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    const attendanceIdToDelete = createResponse.data.data.id;
    console.log(`✓ Created attendance record for deletion with ID: ${attendanceIdToDelete}`);
    
    // Now delete it
    const response = await axios.delete(`${BASE_URL}/api/v1/attendances/${attendanceIdToDelete}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully deleted attendance record');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete attendance record:', error.response?.data || error.message);
    throw error;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('\n9. Testing unauthorized access - Worker trying to access admin endpoints');
    
    // Test: Worker trying to get all attendance records (should fail)
    await axios.get(`${BASE_URL}/api/v1/attendances`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    
    console.error('❌ Supervisor was able to access admin-only endpoint (this should not happen)');
    throw new Error('Security issue: Supervisor accessed admin-only endpoint');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied admin-only access to supervisor user');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function runAttendanceAPITests() {
  try {
    console.log('🧪 Starting Attendance API Tests...\n');
    
    // Login to get tokens
    console.log('0. Logging in test users...');
    adminToken = await loginUser(adminUser.email, adminUser.password);
    supervisorToken = await loginUser(supervisorUser.email, supervisorUser.password);
    
    // Get a project ID for testing
    await getProjects();
    
    // Run all tests
    await testMarkAttendance();
    await testGetAllAttendances();
    await testGetAttendanceById();
    await testUpdateAttendance();
    await testGetMyAttendances();
    await testGetAttendancesByProject();
    await testGetAttendancesByDateRange();
    await testDeleteAttendance();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 All Attendance API tests completed successfully!');
  } catch (error) {
    console.error('\n💥 Attendance API tests failed:', error.message);
    process.exit(1);
  }
}

runAttendanceAPITests();