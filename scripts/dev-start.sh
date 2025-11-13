#!/bin/bash

# Development startup script for PlanningHelper

echo "🚀 Starting PlanningHelper Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Start database services
echo "🐘 Starting PostgreSQL and Redis..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Setup complete!"
echo ""
echo "To start the development servers:"
echo "  Backend:  cd backend && npm run start:dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or open two terminal windows and run each command."
echo ""
echo "📍 URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo "  API Docs: http://localhost:3000/api/docs"
