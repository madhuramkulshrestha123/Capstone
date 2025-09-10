# Complete Testing Package

This document provides a comprehensive overview of all testing resources created for the Capstone Backend API.

## Overview

This package includes everything needed to test all functionalities of the Capstone Backend API, including:
- Detailed testing guide
- Example JSON data files for all endpoints
- Automated test scripts
- Setup verification tools
- Database seeding utilities

## File Structure

```
├── TESTING_GUIDE.md                 # Comprehensive testing instructions
├── TEST_SUMMARY.md                  # Summary of all test files
├── API_ROUTES.md                    # Complete API routes reference
├── COMPLETE_TESTING_PACKAGE.md      # This file
├── run-tests.bat                    # Windows test setup script
├── run-tests.sh                     # Linux/Mac test setup script
├── check-setup.bat                  # Windows setup verification
├── check-setup.sh                   # Linux/Mac setup verification
├── test-workflow.bat                # Windows complete workflow test
├── test-workflow.sh                 # Linux/Mac complete workflow test
├── seed-database.js                 # Sample data seeding script
├── test-data/                       # Directory with all test JSON files
│   ├── README.md                    # Description of test data files
│   ├── job-card-registration.json   # Job card registration data
│   ├── user-login.json              # User login credentials
│   ├── admin-registration.json      # Admin registration data
│   ├── admin-login.json             # Admin login credentials
│   ├── supervisor-registration.json # Supervisor registration data
│   ├── supervisor-login.json        # Supervisor login credentials
│   ├── create-project.json          # Project creation data
│   ├── create-work-request.json     # Work request creation data
│   ├── approve-work-request.json    # Work request approval data
│   ├── mark-attendance.json         # Attendance marking data
│   └── create-payment.json          # Payment creation data
```

## Quick Start

1. **Verify Setup**:
   - Windows: Run `check-setup.bat`
   - Linux/Mac: Run `check-setup.sh`

2. **Run Tests**:
   - Windows: Run `run-tests.bat`
   - Linux/Mac: Run `run-tests.sh`

3. **Test Complete Workflow**:
   - Windows: Run `test-workflow.bat`
   - Linux/Mac: Run `test-workflow.sh`

## Detailed Testing Guide

Refer to [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive instructions on:
- Environment setup
- Database configuration
- Running the server
- Testing each endpoint
- Using curl commands
- Importing data into Postman

## API Routes Reference

See [API_ROUTES.md](API_ROUTES.md) for a complete table of all API endpoints with:
- HTTP methods
- Route paths
- Descriptions
- Authentication requirements
- Role permissions

## Sample Data Seeding

To populate the database with sample data:
```bash
npm run db:seed:sample
```

This will create:
- Admin user (username: admin, password: AdminPass123!)
- Supervisor user (username: supervisor, password: SupervisorPass123!)
- Worker user (username: worker, password: WorkerPass123!)
- Sample project

## Role-Based Testing

The API implements three distinct roles:
1. **Worker**: Test with worker credentials
2. **Supervisor**: Test with supervisor credentials
3. **Admin**: Test with admin credentials

Each role has different permissions as detailed in the [Role-Based Access Control Documentation](docs/role-based-access-control.md).

## Troubleshooting

Common issues and solutions:

1. **Database Connection Failed**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database user has proper permissions

2. **Authentication Errors**:
   - Ensure JWT_SECRET is set in .env
   - Check that tokens are not expired
   - Verify user credentials

3. **Permission Errors**:
   - Confirm user role matches endpoint requirements
   - Check that user account is active

4. **Validation Errors**:
   - Verify all required fields are provided
   - Check data formats match validation rules

## Support

For issues with the testing package, please:
1. Check the documentation in this directory
2. Review the main README.md file
3. Consult the role-based access control documentation
4. Open an issue in the repository if problems persist