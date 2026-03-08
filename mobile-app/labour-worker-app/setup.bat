@echo off
REM Quick Setup Script for Labour Worker App
REM Run this to configure the app for local development

echo ========================================
echo Labour Worker App - Quick Setup
echo ========================================
echo.

REM Get IP address
echo Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found

REM Trim whitespace
for %%a in (%IP%) do set CLEAN_IP=%%a

echo.
echo Found IP Address: %CLEAN_IP%
echo.

REM Ask user if they want to update the API URL
set /p CONFIRM="Do you want to update API_BASE_URL to http://%CLEAN_IP%:3000/api? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    echo.
    echo Creating .env file...
    (
        echo # Backend API URL
        echo API_BASE_URL=http://%CLEAN_IP%:3000/api
        echo.
        echo # For production use:
        echo # API_BASE_URL=https://your-backend.onrender.com/api
    ) > .env
    
    echo .env file created successfully!
    echo.
    echo Next steps:
    echo 1. Make sure backend is running on port 3000
    echo 2. Run: npm start
    echo 3. Scan QR code with Expo Go app
    echo.
) else (
    echo.
    echo Skipping .env creation.
    echo You can manually create .env file with your API_BASE_URL
    echo.
)

echo ========================================
echo Setup Complete!
echo ========================================
pause
