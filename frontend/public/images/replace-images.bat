@echo off
title Smart Rozgar Portal - Image Replacement Tool

echo ====================================================
echo    Smart Rozgar Portal - Image Replacement Tool
echo ====================================================
echo.
echo This tool helps you replace the placeholder images
echo with your own custom images.
echo.

:MENU
echo What would you like to do?
echo 1. Open images folder
echo 2. View replacement instructions
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto OPEN_FOLDER
if "%choice%"=="2" goto VIEW_INSTRUCTIONS
if "%choice%"=="3" goto EXIT

echo Invalid choice. Please try again.
echo.
goto MENU

:OPEN_FOLDER
echo Opening images folder...
explorer "%~dp0"
echo.
pause
goto MENU

:VIEW_INSTRUCTIONS
echo Opening instructions in your browser...
start "" "%~dp0instructions.html"
echo.
pause
goto MENU

:EXIT
echo Thank you for using the Image Replacement Tool!
echo.
pause
exit