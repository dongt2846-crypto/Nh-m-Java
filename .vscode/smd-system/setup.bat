@echo off
echo 🚀 Setting up SMD (Syllabus Management and Digitalization) System
echo ==================================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "data" mkdir data
if not exist "data\mysql" mkdir data\mysql
if not exist "data\redis" mkdir data\redis
if not exist "ai-models" mkdir ai-models

echo 🔧 Building and starting services...

REM Stop any existing containers
docker-compose down

REM Build and start all services
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    echo 📋 Checking logs...
    docker-compose logs
    pause
    exit /b 1
)

echo ⏳ Waiting for services to start...
timeout /t 45 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🎉 SMD System Setup Complete!
echo ================================
echo.
echo 📱 Access Points:
echo   • Web Application: http://localhost:3000
echo   • Backend API: http://localhost:8080
echo   • AI Service: http://localhost:8000
echo.
echo 👤 Default Login:
echo   • Username: admin
echo   • Password: admin123
echo.
echo 🔧 Management Commands:
echo   • View logs: docker-compose logs -f [service_name]
echo   • Stop system: docker-compose down
echo   • Restart system: docker-compose restart
echo.
echo 📚 Next Steps:
echo   1. Wait 2-3 minutes for all services to fully initialize
echo   2. Open http://localhost:3000 in your browser
echo   3. Login with admin credentials
echo   4. Create users and assign roles
echo   5. Start creating syllabi
echo.
echo 🆘 Troubleshooting:
echo   • Check logs: docker-compose logs
echo   • Restart services: docker-compose restart
echo   • Reset database: docker-compose down -v
echo.
pause