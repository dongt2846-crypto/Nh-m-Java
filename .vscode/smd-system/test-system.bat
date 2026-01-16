@echo off
echo 🧪 SMD System Testing Script
echo ============================
echo.

echo 📋 Step 1: Checking Docker...
docker --version
if %errorlevel% neq 0 (
    echo ❌ Docker not found! Please install Docker first.
    pause
    exit /b 1
)
echo ✅ Docker is available
echo.

echo 📋 Step 2: Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is available
echo.

echo 📋 Step 3: Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python first.
    pause
    exit /b 1
)
echo ✅ Python is available
echo.

echo 📋 Step 4: Testing Frontend Build...
cd frontend\smd-web
npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    cd ..\..
    pause
    exit /b 1
)
echo ✅ Frontend builds successfully
cd ..\..
echo.

echo 📋 Step 5: Testing Docker Compose Configuration...
docker-compose config > nul
if %errorlevel% neq 0 (
    echo ❌ Docker Compose configuration is invalid!
    pause
    exit /b 1
)
echo ✅ Docker Compose configuration is valid
echo.

echo 📋 Step 6: Creating required directories...
if not exist "ai-models" mkdir ai-models
if not exist "logs" mkdir logs
echo ✅ Required directories created
echo.

echo 🎉 All tests passed! System is ready to run.
echo.
echo 🚀 To start the system, run:
echo    setup.bat
echo.
echo 🔍 To check system health after startup, run:
echo    check-system.bat
echo.
pause