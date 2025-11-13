#!/bin/bash

# Stop script for PlanningHelper

echo "🛑 Stopping PlanningHelper services..."

# Stop development environment
if docker-compose -f docker-compose.dev.yml ps -q 2>/dev/null | grep -q .; then
    echo "Stopping development services..."
    docker-compose -f docker-compose.dev.yml down
fi

# Stop production environment
if docker-compose ps -q 2>/dev/null | grep -q .; then
    echo "Stopping production services..."
    docker-compose down
fi

echo "✅ All services stopped."
