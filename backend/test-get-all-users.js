const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1/users';

async function testGetAllUsers() {
  try {
    console.log('🧪 Testing Get All Users (Admin Only)');
    
    // First, let's create an admin user if one doesn't exist
    console.log('\n1️⃣ Creating admin user (if needed)...');
    
    // For this test, we'll assume an admin user already exists
    // In a real scenario, you would need to authenticate as an admin
    
    // Sample admin credentials (you'll need to replace these with actual admin credentials)
    const adminCredentials = {
      email: 'admin@example.com',
      password: 'StrongPass123!'
    };
    
    console.log('📝 Sample Admin Credentials:');
    console.log(JSON.stringify(adminCredentials, null, 2));
    
    // In a real scenario, you would first login to get an admin token
    // For this example, I'll show the process assuming you have an admin token
    
    console.log('\n🔐 ADMIN LOGIN FLOW (Sample)');
    console.log('1. POST /api/v1/users/login');
    console.log('Request Body:');
    console.log(JSON.stringify({
      email: adminCredentials.email,
      password: adminCredentials.password
    }, null, 2));
    
    // Sample response would be:
    console.log('\n✅ Sample Login Response:');
    console.log(JSON.stringify({
      "success": true,
      "data": {
        "user": {
          "id": 1,
          "username": "adminuser",
          "email": "admin@example.com",
          "first_name": "Admin",
          "last_name": "User",
          "role": "ADMIN",
          "is_active": true,
          "created_at": "2023-01-01T00:00:00.000Z",
          "updated_at": "2023-01-01T00:00:00.000Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "message": "Login successful"
      }
    }, null, 2));
    
    // Extract the admin token from the login response
    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // This would be the actual token
    
    // GET ALL USERS
    console.log('\n📋 GET ALL USERS (Admin Only)');
    console.log('GET /api/v1/users');
    console.log('Headers:');
    console.log(JSON.stringify({
      "Authorization": "Bearer <admin_token>"
    }, null, 2));
    
    // Sample request with pagination parameters
    console.log('\nWith pagination parameters:');
    console.log('GET /api/v1/users?page=1&limit=10');
    
    // Sample successful response
    console.log('\n✅ Sample Response:');
    console.log(JSON.stringify({
      "success": true,
      "data": [
        {
          "id": 1,
          "username": "adminuser",
          "email": "admin@example.com",
          "first_name": "Admin",
          "last_name": "User",
          "role": "ADMIN",
          "is_active": true,
          "created_at": "2023-01-01T00:00:00.000Z",
          "updated_at": "2023-01-01T00:00:00.000Z"
        },
        {
          "id": 2,
          "username": "worker1",
          "email": "worker1@example.com",
          "first_name": "Worker",
          "last_name": "One",
          "role": "WORKER",
          "is_active": true,
          "created_at": "2023-01-02T00:00:00.000Z",
          "updated_at": "2023-01-02T00:00:00.000Z"
        },
        {
          "id": 3,
          "username": "supervisor1",
          "email": "supervisor1@example.com",
          "first_name": "Super",
          "last_name": "Visor",
          "role": "SUPERVISOR",
          "is_active": true,
          "created_at": "2023-01-03T00:00:00.000Z",
          "updated_at": "2023-01-03T00:00:00.000Z"
        }
      ],
      "meta": {
        "total": 3,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    }, null, 2));
    
    console.log('\n📋 GET USER BY ID (Admin Only)');
    console.log('GET /api/v1/users/2');
    console.log('Headers:');
    console.log(JSON.stringify({
      "Authorization": "Bearer <admin_token>"
    }, null, 2));
    
    console.log('\n✅ Sample Response:');
    console.log(JSON.stringify({
      "success": true,
      "data": {
        "id": 2,
        "username": "worker1",
        "email": "worker1@example.com",
        "first_name": "Worker",
        "last_name": "One",
        "role": "WORKER",
        "is_active": true,
        "created_at": "2023-01-02T00:00:00.000Z",
        "updated_at": "2023-01-02T00:00:00.000Z"
      }
    }, null, 2));
    
    console.log('\n🔐 AUTHORIZATION NOTES:');
    console.log('1. Only users with ADMIN role can access these endpoints');
    console.log('2. Regular users will receive a 403 Forbidden error');
    console.log('3. Valid JWT token must be provided in Authorization header');
    console.log('4. Pagination parameters are optional (default: page=1, limit=10)');
    
    console.log('\n❌ ERROR RESPONSES:');
    
    console.log('\nUnauthorized (No token):');
    console.log(JSON.stringify({
      "success": false,
      "error": {
        "message": "Access token is required"
      }
    }, null, 2));
    
    console.log('\nForbidden (Non-admin user):');
    console.log(JSON.stringify({
      "success": false,
      "error": {
        "message": "Only admins can access this resource"
      }
    }, null, 2));
    
    console.log('\nInvalid token:');
    console.log(JSON.stringify({
      "success": false,
      "error": {
        "message": "Invalid or expired token"
      }
    }, null, 2));
    
    console.log('\n🎉 ADMIN USER MANAGEMENT ENDPOINTS:');
    console.log('GET    /api/v1/users           - Get all users (Admin only)');
    console.log('GET    /api/v1/users/:id       - Get user by ID (Admin only)');
    console.log('PUT    /api/v1/users/:id       - Update user by ID (Admin only)');
    console.log('DELETE /api/v1/users/:id       - Delete user by ID (Admin only)');
    
  } catch (error) {
    console.error('❌ Error during test:', error.response?.data || error.message);
  }
}

// Run the test
testGetAllUsers();