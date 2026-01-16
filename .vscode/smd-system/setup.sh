#!/bin/bash

echo "🚀 Setting up SMD (Syllabus Management and Digitalization) System"
echo "=================================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/mysql
mkdir -p data/redis
mkdir -p ai-models

# Set permissions
chmod 755 logs data ai-models

echo "🔧 Building and starting services..."

# Stop any existing containers
docker-compose down

# Build and start all services
if docker-compose up -d --build; then
    echo "✅ Services are starting up"
else
    echo "❌ Failed to start services"
    echo "📋 Checking logs..."
    docker-compose logs
    exit 1
fi

echo "⏳ Waiting for services to start..."
sleep 45

# Check if services are running
echo "🔍 Checking service status..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running"
else
    echo "❌ Some services failed to start"
    echo "📋 Service status:"
    docker-compose ps
    echo "📋 Logs:"
    docker-compose logs --tail=50
fi

echo ""
echo "🎉 SMD System Setup Complete!"
echo "================================"
echo ""
echo "📱 Access Points:"
echo "  • Web Application: http://localhost:3000"
echo "  • Backend API: http://localhost:8080"
echo "  • AI Service: http://localhost:8000"
echo ""
echo "👤 Default Login:"
echo "  • Username: admin"
echo "  • Password: admin123"
echo ""
echo "🔧 Management Commands:"
echo "  • View logs: docker-compose logs -f [service_name]"
echo "  • Stop system: docker-compose down"
echo "  • Restart system: docker-compose restart"
echo "  • Update system: docker-compose pull && docker-compose up -d"
echo ""
echo "📚 Next Steps:"
echo "  1. Wait 2-3 minutes for all services to fully initialize"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Login with admin credentials"
echo "  4. Create users and assign roles"
echo "  5. Start creating syllabi"
echo ""
echo "🆘 Troubleshooting:"
echo "  • Check logs: docker-compose logs"
echo "  • Restart services: docker-compose restart"
echo "  • Reset database: docker-compose down -v && docker-compose up -d"
echo ""