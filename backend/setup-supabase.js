// Script to help set up Supabase database
console.log(`
========================================
 Supabase Database Setup Helper
========================================

This script will guide you through setting up a free Supabase database for the Capstone Backend API.

Steps:
1. Create a free Supabase account
2. Create a new project
3. Get your database connection string
4. Update your .env file

`);

console.log(`
Step 1: Create a Supabase Account
--------------------------------
1. Go to https://supabase.com/
2. Click "Start your project" or "Sign up"
3. Sign up with your preferred method (GitHub, Google, or email)

Step 2: Create a New Project
----------------------------
1. In the Supabase dashboard, click "New Project"
2. Choose a name for your project (e.g., "capstone-backend")
3. Set a database password (make sure to remember it)
4. Select a region closest to you
5. Click "Create new project"

Step 3: Get Your Connection String
----------------------------------
1. Once your project is created, go to "Project Settings" (gear icon)
2. Click "Database" in the left sidebar
3. Scroll down to "Connection Info"
4. Copy the "Connection string" (it looks like):
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres

Step 4: Update Your .env File
-----------------------------
1. Open the .env file in your project
2. Replace the DATABASE_URL line with your Supabase connection string:
   DATABASE_URL="postgresql://postgres:your_actual_password@db.your_project_id.supabase.co:5432/postgres"

Step 5: Run Migrations
----------------------
1. In your terminal, run:
   npm run db:migrate

Step 6: Start Your Server
-------------------------
1. Start your development server:
   npm run dev

That's it! Your database should now be set up and ready to use.

For more detailed instructions, see SETUP_DATABASE.md
`);