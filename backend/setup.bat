@echo off

echo 🚀 Setting up Capstone Backend...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma Client
echo ⚡ Generating Prisma Client...
call npm run db:generate

REM Check Database Connection
echo 🗄️  Please ensure your DATABASE_URL in .env is correctly configured...

echo 📝 Please update your .env file with the correct DATABASE_URL (Prisma Accelerate recommended).
echo 🔧 Then run 'npm run db:migrate' to deploy the database schema.
echo 🎉 Setup complete! Run 'npm run dev' to start the development server.

pause