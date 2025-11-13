#!/bin/bash

# Production startup script for PlanningHelper

echo "🚀 Starting PlanningHelper Production Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one from .env.example"
    exit 1
fi

# Build and start all services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "✅ PlanningHelper is running!"
echo ""
echo "📍 Access the application at: http://localhost"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
