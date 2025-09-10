#!/bin/bash

# Capstone Backend API - Complete Test Workflow
# This script demonstrates the complete workflow from registration to project approval

echo "Capstone Backend API - Complete Test Workflow"
echo "============================================"

# Start server in background
echo "Starting server..."
npm run dev > server.log 2>&1 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 5

# Test 1: Job Card Registration
echo "1. Registering job card..."
curl -X POST http://localhost:3001/api/v1/job-cards/register \
  -H "Content-Type: application/json" \
  -d @test-data/job-card-registration.json

echo ""

# Test 2: User Login
echo "2. Logging in as user..."
curl -X POST http://localhost:3001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d @test-data/user-login.json

echo ""

# Test 3: Admin Registration
echo "3. Registering admin user..."
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d @test-data/admin-registration.json

echo ""

# Test 4: Admin Login
echo "4. Logging in as admin..."
curl -X POST http://localhost:3001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d @test-data/admin-login.json

echo ""

# Test 5: Create Project (requires admin token from previous step)
echo "5. Creating project..."
# Note: You'll need to replace ADMIN_JWT_TOKEN with actual token from login response
curl -X POST http://localhost:3001/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d @test-data/create-project.json

echo ""

# Test 6: Create Work Request (requires worker token)
echo "6. Creating work request..."
# Note: You'll need to replace WORKER_JWT_TOKEN with actual token from login response
curl -X POST http://localhost:3001/api/v1/work-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer WORKER_JWT_TOKEN" \
  -d @test-data/create-work-request.json

echo ""

# Test 7: Approve Work Request (requires admin token)
echo "7. Approving work request..."
# Note: You'll need to replace ADMIN_JWT_TOKEN with actual token and REQUEST_ID with actual request ID
curl -X PATCH http://localhost:3001/api/v1/work-requests/REQUEST_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d @test-data/approve-work-request.json

echo ""

# Stop server
echo "Stopping server..."
kill $SERVER_PID

echo "Test workflow completed. Check server.log for server output."