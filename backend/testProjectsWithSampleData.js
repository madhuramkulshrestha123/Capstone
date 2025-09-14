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

async function testGetAllProjects() {
  try {
    console.log('\n1. Testing GET /api/v1/projects - Get all projects');
    const response = await axios.get(`${BASE_URL}/api/v1/projects`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved all projects');
    console.log(`Total projects: ${response.data.meta?.total || 0}`);
    
    // Save a project ID for later tests
    if (response.data.data && response.data.data.length > 0) {
      testProjectId = response.data.data[0].id;
      console.log(`Using project ID for tests: ${testProjectId}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get all projects:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetProjectById() {
  try {
    console.log('\n2. Testing GET /api/v1/projects/:id - Get project by ID');
    const response = await axios.get(`${BASE_URL}/api/v1/projects/${testProjectId}`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved project by ID');
    console.log(`Project name: ${response.data.data.name}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get project by ID:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateProject() {
  try {
    console.log('\n3. Testing POST /api/v1/projects - Create a new project (Admin only)');
    const newProject = {
      name: 'Bridge Construction Project',
      description: 'Construction of a new bridge to improve transportation',
      location: 'River Location, District T',
      worker_need: 75,
      start_date: '2026-01-01',
      end_date: '2026-08-31',
      status: 'pending'
    };
    
    const response = await axios.post(`${BASE_URL}/api/v1/projects`, newProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully created project');
    console.log(`Project ID: ${response.data.data.id}`);
    console.log(`Project name: ${response.data.data.name}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create project:', error.response?.data || error.message);
    throw error;
  }
}

async function testUpdateProject() {
  try {
    console.log('\n4. Testing PUT /api/v1/projects/:id - Update project by ID (Admin only)');
    const updateData = {
      name: 'Updated Road Construction Project',
      description: 'Construction of rural roads with additional bridges',
      worker_need: 60
    };
    
    const response = await axios.put(`${BASE_URL}/api/v1/projects/${testProjectId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully updated project');
    console.log(`Updated project name: ${response.data.data.name}`);
    console.log(`Updated worker need: ${response.data.data.worker_need}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update project:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetMyProjects() {
  try {
    console.log('\n5. Testing GET /api/v1/projects/my/projects - Get projects created by authenticated user');
    const response = await axios.get(`${BASE_URL}/api/v1/projects/my/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully retrieved my projects');
    console.log(`Projects created by admin: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get my projects:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetProjectsByStatus() {
  try {
    console.log('\n6. Testing GET /api/v1/projects/status/:status - Get projects by status');
    
    // Test pending projects
    const pendingResponse = await axios.get(`${BASE_URL}/api/v1/projects/status/pending`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved pending projects');
    console.log(`Pending projects: ${pendingResponse.data.meta?.total || 0}`);
    
    // Test active projects
    const activeResponse = await axios.get(`${BASE_URL}/api/v1/projects/status/active`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved active projects');
    console.log(`Active projects: ${activeResponse.data.meta?.total || 0}`);
    
    // Test completed projects
    const completedResponse = await axios.get(`${BASE_URL}/api/v1/projects/status/completed`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved completed projects');
    console.log(`Completed projects: ${completedResponse.data.meta?.total || 0}`);
    
    return { pending: pendingResponse.data, active: activeResponse.data, completed: completedResponse.data };
  } catch (error) {
    console.error('❌ Failed to get projects by status:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeleteProject() {
  try {
    console.log('\n7. Testing DELETE /api/v1/projects/:id - Delete project by ID (Admin only)');
    
    // First create a project to delete
    const newProject = {
      name: 'Temporary Project for Deletion',
      description: 'This project will be deleted',
      location: 'Test Location',
      worker_need: 5,
      start_date: '2026-01-01',
      end_date: '2026-02-01',
      status: 'pending'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/v1/projects`, newProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const projectIdToDelete = createResponse.data.data.id;
    console.log(`✓ Created project for deletion with ID: ${projectIdToDelete}`);
    
    // Now delete it
    const response = await axios.delete(`${BASE_URL}/api/v1/projects/${projectIdToDelete}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully deleted project');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete project:', error.response?.data || error.message);
    throw error;
  }
}

async function testUnauthorizedAccess() {
  try {
    console.log('\n8. Testing unauthorized access - Non-admin trying to create project');
    const newProject = {
      name: 'Unauthorized Project',
      description: 'This should fail',
      location: 'Nowhere',
      worker_need: 1,
      start_date: '2026-01-01',
      end_date: '2026-01-02',
      status: 'pending'
    };
    
    await axios.post(`${BASE_URL}/api/v1/projects`, newProject, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    
    console.error('❌ Non-admin was able to create project (this should not happen)');
    throw new Error('Security issue: Non-admin created project');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied project creation to non-admin user');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function runProjectAPITests() {
  try {
    console.log('🧪 Starting Project API Tests with Sample Data...\n');
    
    // Login to get tokens
    console.log('0. Logging in test users...');
    adminToken = await loginUser(adminUser.email, adminUser.password);
    supervisorToken = await loginUser(supervisorUser.email, supervisorUser.password);
    
    // Run all tests
    await testGetAllProjects();
    await testGetProjectById();
    await testCreateProject();
    await testUpdateProject();
    await testGetMyProjects();
    await testGetProjectsByStatus();
    await testDeleteProject();
    await testUnauthorizedAccess();
    
    console.log('\n🎉 All Project API tests with sample data completed successfully!');
  } catch (error) {
    console.error('\n💥 Project API tests failed:', error.message);
    process.exit(1);
  }
}

runProjectAPITests();