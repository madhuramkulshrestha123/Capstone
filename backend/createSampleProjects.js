const axios = require('axios');

// Base URL for the API
const BASE_URL = 'http://localhost:3000';

// Test admin user credentials (using existing test user)
const adminUser = {
  email: 'admin@test.com',
  password: 'AdminPass123!'
};

let adminToken = '';

// Sample projects data
const sampleProjects = [
  {
    name: 'Road Construction Project',
    description: 'Construction of rural roads to improve connectivity',
    location: 'Village A, District X',
    worker_need: 50,
    start_date: '2025-10-01',
    end_date: '2026-03-31',
    status: 'pending'
  },
  {
    name: 'Water Pipeline Installation',
    description: 'Installing water pipelines to provide clean drinking water',
    location: 'Village B, District Y',
    worker_need: 30,
    start_date: '2025-11-15',
    end_date: '2026-02-28',
    status: 'pending'
  },
  {
    name: 'School Building Renovation',
    description: 'Renovation of existing school infrastructure',
    location: 'Village C, District Z',
    worker_need: 20,
    start_date: '2025-09-01',
    end_date: '2025-12-31',
    status: 'active'
  },
  {
    name: 'Health Center Construction',
    description: 'Building a new primary health center',
    location: 'Village D, District W',
    worker_need: 40,
    start_date: '2025-08-01',
    end_date: '2026-01-31',
    status: 'active'
  },
  {
    name: 'Solar Panel Installation',
    description: 'Installing solar panels for electricity generation',
    location: 'Village E, District V',
    worker_need: 15,
    start_date: '2025-07-01',
    end_date: '2025-09-30',
    status: 'completed'
  }
];

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

async function createProject(projectData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/projects`, projectData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✓ Created project: ${projectData.name}`);
    return response.data.data.id;
  } catch (error) {
    console.error(`❌ Failed to create project ${projectData.name}:`, error.response?.data || error.message);
    throw error;
  }
}

async function getProjects() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✓ Retrieved ${response.data.meta.total} projects`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get projects:', error.response?.data || error.message);
    throw error;
  }
}

async function createSampleProjects() {
  try {
    console.log('🌱 Creating sample projects...\n');
    
    // Login to get admin token
    adminToken = await loginUser(adminUser.email, adminUser.password);
    
    // Create sample projects
    const projectIds = [];
    for (const project of sampleProjects) {
      const projectId = await createProject(project);
      projectIds.push(projectId);
    }
    
    console.log('\n📋 Retrieving all projects to verify creation...');
    const allProjects = await getProjects();
    
    console.log('\n✅ Sample data creation completed successfully!');
    console.log(`📝 Created ${projectIds.length} sample projects:`);
    sampleProjects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.name} (${project.status})`);
    });
    
    return projectIds;
  } catch (error) {
    console.error('\n💥 Sample data creation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
createSampleProjects();