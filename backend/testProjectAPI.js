const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Test users - we'll need to register and login to get tokens
let adminUser = {
  role: 'admin',
  name: 'Admin User',
  phone_number: '9999999999',
  aadhaar_number: '999999999999',
  email: 'admin@test.com',
  panchayat_id: '99999999-9999-9999-9999-999999999999',
  government_id: 'GOV999999999999',
  password: 'AdminPass123!',
  state: 'Test State',
  district: 'Test District',
  village_name: 'Test Village',
  pincode: '999999'
};

let supervisorUser = {
  role: 'supervisor',
  name: 'Supervisor User',
  phone_number: '8888888888',
  aadhaar_number: '888888888888',
  email: 'supervisor@test.com',
  panchayat_id: '88888888-8888-8888-8888-888888888888',
  government_id: 'GOV888888888888',
  password: 'SupervisorPass123!',
  state: 'Test State',
  district: 'Test District',
  village_name: 'Test Village',
  pincode: '888888'
};

let adminToken = '';
let supervisorToken = '';

// Sample project data
const sampleProject = {
  name: 'Test Project',
  description: 'This is a test project',
  location: 'Test Location',
  worker_need: 10,
  start_date: '2025-10-01',
  end_date: '2025-12-31',
  status: 'pending'
};

let createdProjectId = '';

async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/users/register`, userData);
    console.log(`✓ User ${userData.name} registered successfully`);
    return response.data.data.user_id;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`ℹ User ${userData.name} already exists, proceeding with login`);
      return null;
    } else {
      console.error(`❌ Failed to register ${userData.name}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

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
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get all projects:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateProject() {
  try {
    console.log('\n2. Testing POST /api/v1/projects - Create a new project (Admin only)');
    const response = await axios.post(`${BASE_URL}/api/v1/projects`, sampleProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully created project');
    createdProjectId = response.data.data.id;
    console.log(`Project ID: ${createdProjectId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create project:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateProjectNonAdmin() {
  try {
    console.log('\n3. Testing POST /api/v1/projects - Create project as non-admin (should fail)');
    await axios.post(`${BASE_URL}/api/v1/projects`, sampleProject, {
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

async function testGetProjectById() {
  try {
    console.log('\n4. Testing GET /api/v1/projects/:id - Get project by ID');
    const response = await axios.get(`${BASE_URL}/api/v1/projects/${createdProjectId}`, {
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

async function testUpdateProject() {
  try {
    console.log('\n5. Testing PUT /api/v1/projects/:id - Update project by ID (Admin only)');
    const updateData = {
      name: 'Updated Test Project',
      description: 'This is an updated test project',
      worker_need: 15
    };
    const response = await axios.put(`${BASE_URL}/api/v1/projects/${createdProjectId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully updated project');
    console.log(`Updated project name: ${response.data.data.name}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update project:', error.response?.data || error.message);
    throw error;
  }
}

async function testUpdateProjectNonAdmin() {
  try {
    console.log('\n6. Testing PUT /api/v1/projects/:id - Update project as non-admin (should fail)');
    const updateData = {
      name: 'Hacked Project Name'
    };
    await axios.put(`${BASE_URL}/api/v1/projects/${createdProjectId}`, updateData, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.error('❌ Non-admin was able to update project (this should not happen)');
    throw new Error('Security issue: Non-admin updated project');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied project update to non-admin user');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function testGetMyProjects() {
  try {
    console.log('\n7. Testing GET /api/v1/projects/my/projects - Get projects created by authenticated user');
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
    console.log('\n8. Testing GET /api/v1/projects/status/:status - Get projects by status');
    const response = await axios.get(`${BASE_URL}/api/v1/projects/status/pending`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.log('✓ Successfully retrieved projects by status');
    console.log(`Pending projects: ${response.data.meta?.total || 0}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get projects by status:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeleteProject() {
  try {
    console.log('\n9. Testing DELETE /api/v1/projects/:id - Delete project by ID (Admin only)');
    const response = await axios.delete(`${BASE_URL}/api/v1/projects/${createdProjectId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Successfully deleted project');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete project:', error.response?.data || error.message);
    throw error;
  }
}

async function testDeleteProjectNonAdmin() {
  // We need to create another project first to test this
  let tempProjectId = '';
  try {
    console.log('\n10. Testing DELETE /api/v1/projects/:id - Delete project as non-admin (should fail)');
    // First create a project as admin
    const createResponse = await axios.post(`${BASE_URL}/api/v1/projects`, sampleProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    tempProjectId = createResponse.data.data.id;
    
    // Now try to delete as non-admin
    await axios.delete(`${BASE_URL}/api/v1/projects/${tempProjectId}`, {
      headers: { Authorization: `Bearer ${supervisorToken}` }
    });
    console.error('❌ Non-admin was able to delete project (this should not happen)');
    throw new Error('Security issue: Non-admin deleted project');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✓ Correctly denied project deletion to non-admin user');
      // Clean up the project as admin
      if (tempProjectId) {
        await axios.delete(`${BASE_URL}/api/v1/projects/${tempProjectId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✓ Cleaned up test project');
      }
    } else if (error.response?.status === 404) {
      console.log('✓ Project was already deleted');
    } else {
      console.error('❌ Unexpected error:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function runProjectAPITests() {
  try {
    console.log('🧪 Starting Project API Tests...\n');
    
    // Register test users
    console.log('0. Setting up test users...');
    await registerUser(adminUser);
    await registerUser(supervisorUser);
    
    // Login to get tokens
    adminToken = await loginUser(adminUser.email, adminUser.password);
    supervisorToken = await loginUser(supervisorUser.email, supervisorUser.password);
    
    // Run all tests
    await testGetAllProjects();
    await testCreateProject();
    await testCreateProjectNonAdmin();
    await testGetProjectById();
    await testUpdateProject();
    await testUpdateProjectNonAdmin();
    await testGetMyProjects();
    await testGetProjectsByStatus();
    await testDeleteProject();
    await testDeleteProjectNonAdmin();
    
    console.log('\n🎉 All Project API tests completed successfully!');
  } catch (error) {
    console.error('\n💥 Project API tests failed:', error.message);
    process.exit(1);
  }
}

runProjectAPITests();