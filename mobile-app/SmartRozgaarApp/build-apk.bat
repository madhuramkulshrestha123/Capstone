@echo off
REM =====================================================
REM SMART ROZGAAR APP - APK BUILD SCRIPT
REM =====================================================
REM This script builds the Android APK for Smart Rozgaar Portal
REM =====================================================

echo.
echo ============================================
echo  SMART ROZGAAR PORTAL - APK BUILD TOOL
echo ============================================
echo.

REM Check if we're in the correct directory
if not exist "app\build.gradle" (
    echo [ERROR] Please run this script from the SmartRozgaarApp folder
    echo Example: cd C:\Users\owner\Desktop\Capstone\mobile-app\SmartRozgaarApp
   pause
    exit /b 1
)

echo [INFO] Found Android project configuration
echo.

REM Display menu
echo Select build type:
echo.
echo 1. Build Debug APK (for testing)
echo 2. Build Release APK (for distribution)
echo 3. Clean and Build Debug APK
echo 4. Open Android Studio
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto build_debug
if "%choice%"=="2" goto build_release
if "%choice%"=="3" goto clean_build
if "%choice%"=="4" goto open_studio
if "%choice%"=="5" goto exit_script

echo [ERROR] Invalid choice. Please enter 1-5.
pause
exit /b 1

:build_debug
echo.
echo ============================================
echo  Building Debug APK...
echo ============================================
echo.

call gradlew assembleDebug

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check the error messages above.
   pause
    exit /b 1
)

echo.
echo ============================================
echo  BUILD SUCCESSFUL!
echo ============================================
echo.
echo Debug APK location:
echo %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo You can now install this APK on your device for testing.
echo.
pause
exit/b 0

:build_release
echo.
echo ============================================
echo  Building Release APK...
echo ============================================
echo.
echo IMPORTANT: Before building release APK, ensure:
echo 1. You have created a keystore file
echo 2. You have configured signing in app/build.gradle
echo 3. You have set the correct keystore path and passwords
echo.

set /p confirm="Do you want to continue? (y/n): "

if /i not "%confirm%"=="y" (
    echo Build cancelled.
   pause
    exit /b 0
)

call gradlew assembleRelease

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check the error messages above.
    echo.
    echo Common issues:
    echo - Keystore file not found
    echo - Incorrect keystore password
    echo - Signing config not set up in build.gradle
    echo.
   pause
    exit/b 1
)

echo.
echo ============================================
echo  RELEASE BUILD SUCCESSFUL!
echo ============================================
echo.
echo Release APK location:
echo %cd%\app\build\outputs\apk\release\app-release.apk
echo.
echo This APK is signed and ready for distribution!
echo.
pause
exit /b 0

:clean_build
echo.
echo ============================================
echo  Cleaning and Building Debug APK...
echo ============================================
echo.

call gradlew clean assembleDebug

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed! Check the error messages above.
   pause
    exit /b 1
)

echo.
echo ============================================
echo  CLEAN BUILD SUCCESSFUL!
echo ============================================
echo.
echo Debug APK location:
echo %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
exit /b 0

:open_studio
echo.
echo Opening Android Studio...
echo.

REM Try to find Android Studio installation
set STUDIO_PATH=C:\Program Files\Android\Android Studio

if exist "%STUDIO_PATH%\bin\studio64.exe" (
   start "" "%STUDIO_PATH%\bin\studio64.exe" "%cd%"
    echo Android Studio opened successfully.
) else(
    echo Could not find Android Studio at default location.
    echo Please open it manually and load this project.
)

echo.
pause
exit/b 0

:exit_script
echo.
echo Thank you for using Smart Rozgaar Build Tool!
echo.
exit/b 0
