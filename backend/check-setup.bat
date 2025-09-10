@echo off
echo Capstone Backend API - Setup Checker
echo ====================================

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    exit /b 1
)

echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    exit /b 1
)

echo Checking PostgreSQL connection...
echo This check requires manual verification:
echo 1. Ensure PostgreSQL is running
echo 2. Check that DATABASE_URL in .env is correct
echo 3. Run "npx prisma migrate dev" to test connection

echo Checking required environment variables...
if not defined DATABASE_URL (
    echo WARNING: DATABASE_URL environment variable not set
) else (
    echo DATABASE_URL is set
)

if not defined JWT_SECRET (
    echo WARNING: JWT_SECRET environment variable not set
) else (
    echo JWT_SECRET is set
)

echo Setup check completed.
echo Please ensure you have created a .env file with required variables.
pause