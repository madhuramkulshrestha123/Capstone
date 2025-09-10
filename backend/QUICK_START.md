# Quick Start Guide

This guide will help you get the Capstone Backend API up and running quickly.

## Prerequisites

1. Node.js (v16 or higher)
2. npm (comes with Node.js)
3. A PostgreSQL database (local or cloud)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Your Database

You have several options:

#### Option A: Use a Free Cloud Database (Recommended)

1. Sign up for [Supabase](https://supabase.com/) (free tier available)
2. Create a new project
3. Get your database connection string from the dashboard
4. Update your `.env` file with the connection string:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
   ```

#### Option B: Install PostgreSQL Locally

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation, set a password (remember it)
3. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:your_password_here@localhost:5432/capstone_db"
   ```

### 3. Update Environment Variables

Edit your `.env` file with your actual database connection string and other configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# PostgreSQL Configuration (update with your actual connection string)
DATABASE_URL="postgresql://username:password@host:port/database_name"

# JWT Configuration (change these to secure values)
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_secure_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

If you get connection errors, double-check your DATABASE_URL in the `.env` file.

### 5. Check Database Connection (Optional)

```bash
npm run db:check
```

### 6. Start the Development Server

```bash
npm run dev
```

### 7. Test the API

Once the server is running, you can test the registration endpoint:

```bash
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "StrongPass123!",
    "first_name": "John",
    "last_name": "Doe",
    "role": "WORKER"
  }'
```

Or use the test files we created:

```bash
curl -X POST http://localhost:3001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d @test-data/admin-registration.json
```

## Common Issues and Solutions

### Database Connection Failed

1. **Check your DATABASE_URL**: Make sure it's correctly formatted and has the right credentials
2. **Verify database is running**: If using local PostgreSQL, ensure the service is started
3. **Check firewall settings**: Make sure your firewall isn't blocking the connection

### Prisma Schema Issues

If you get Prisma schema errors:

```bash
npm run db:generate
```

### Port Already in Use

If port 3001 is already in use, change the PORT in your `.env` file:

```env
PORT=3002
```

## Testing All Functionality

After setting up the database and starting the server, you can test all functionality using the test files in the `test-data/` directory:

1. Register users with different roles:
   - `test-data/admin-registration.json`
   - `test-data/supervisor-registration.json`
   - `test-data/job-card-registration.json`

2. Login and get JWT tokens:
   - `test-data/admin-login.json`
   - `test-data/supervisor-login.json`
   - `test-data/user-login.json`

3. Create projects, work requests, attendance records, and payments using the other test files.

## Production Deployment

For production deployment:

1. Use environment variables for sensitive data
2. Use Prisma Accelerate for better performance (update DATABASE_URL back to the Accelerate URL for runtime)
3. Run migrations during deployment with direct database connection
4. Set NODE_ENV to "production"

## Need Help?

If you're still having issues:

1. Check the detailed [Database Setup Guide](SETUP_DATABASE.md)
2. Review the [Testing Guide](TESTING_GUIDE.md)
3. Look at the [API Routes Reference](API_ROUTES.md)
4. Open an issue in the repository