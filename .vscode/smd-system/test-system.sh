#!/bin/bash
echo "🧪 SMD System Testing Script"
echo "============================"
echo ""

echo "📋 Step 1: Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker first."
    exit 1
fi
echo "✅ Docker is available"
echo ""

echo "📋 Step 2: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js first."
    exit 1
fi
echo "✅ Node.js is available"
echo ""

echo "📋 Step 3: Checking Python..."
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python not found! Please install Python first."
    exit 1
fi
echo "✅ Python is available"
echo ""

echo "📋 Step 4: Testing Frontend Build..."
cd frontend/smd-web
if ! npm run build; then
    echo "❌ Frontend build failed!"
    cd ../..
    exit 1
fi
echo "✅ Frontend builds successfully"
cd ../..
echo ""

echo "📋 Step 5: Testing Docker Compose Configuration..."
if ! docker-compose config > /dev/null; then
    echo "❌ Docker Compose configuration is invalid!"
    exit 1
fi
echo "✅ Docker Compose configuration is valid"
echo ""

echo "📋 Step 6: Creating required directories..."
mkdir -p ai-models logs
echo "✅ Required directories created"
echo ""

echo "🎉 All tests passed! System is ready to run."
echo ""
echo "🚀 To start the system, run:"
echo "   ./setup.sh"
echo ""
echo "🔍 To check system health after startup, run:"
echo "   ./check-system.sh"
echo ""