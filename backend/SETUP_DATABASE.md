# Database Setup Guide

This guide will help you set up the database for the Capstone Backend API.

## Current Issue

The application is currently configured to use Prisma Accelerate, but you need to run database migrations which require a direct database connection. The error you're seeing:

```
The table `public.users` does not exist in the current database.
```

This means the database tables haven't been created yet.

## Solution Options

### Option 1: Use Supabase (Recommended for Development)

1. Go to [supabase.com](https://supabase.com/) and create a free account
2. Create a new project
3. Once created, go to Project Settings > Database > Connection Info
4. Get your connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
   ```
5. Update your `.env` file with this connection string:
   ```
   DATABASE_URL="postgresql://postgres:your_actual_password@db.your_project_id.supabase.co:5432/postgres"
   ```

### Option 2: Use Railway (Alternative)

1. Go to [railway.app](https://railway.app/) and create a free account
2. Create a new project
3. Add a PostgreSQL database
4. Get the connection string from the database variables
5. Update your `.env` file with this connection string

### Option 3: Install PostgreSQL Locally

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Install with default settings
3. During installation, set a password (remember it)
4. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:your_password_here@localhost:5432/capstone_db"
   ```

### Option 4: Use Docker (If you install Docker)

1. Install Docker Desktop
2. Run this command in your terminal:
   ```bash
   docker run --name capstone-postgres -e POSTGRES_DB=capstone_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=your_password_here -p 5432:5432 -d postgres:13
   ```
3. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:your_password_here@localhost:5432/capstone_db"
   ```

## After Setting Up Your Database

Once you've updated your DATABASE_URL in the `.env` file:

1. Run the database migrations:
   ```bash
   npx prisma migrate dev
   ```

2. Start your server:
   ```bash
   npm run dev
   ```

3. Test the registration endpoint again:
   ```json
   POST /api/v1/users/register
   {
     "username": "johndoe",
     "email": "john.doe@example.com",
     "password": "StrongPass123!",
     "first_name": "John",
     "last_name": "Doe",
     "role": "WORKER"
   }
   ```

## For Production

For production deployment, you can continue using Prisma Accelerate for better performance and security. Just make sure to:

1. Set up your direct database connection for running migrations during deployment
2. Use the Prisma Accelerate connection string for runtime operations

## Troubleshooting

If you're still having issues:

1. Make sure your database server is running
2. Verify your connection string is correct
3. Check that your database user has proper permissions
4. Ensure your firewall isn't blocking the connection