#!/bin/bash

set -e

echo "🚀 LUYENTHI4 Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from template:"
    echo "  cp .env.example .env"
    echo "  nano .env  # Edit the values"
    echo ""
    echo "Required values to change:"
    echo "  - DB_PASS (database password)"
    echo "  - JWT_SECRET (generate with: openssl rand -base64 32)"
    echo "  - VITE_API_URL (your VPS IP or domain)"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo -e "${YELLOW}Step 1: Checking client .env file...${NC}"
if [ ! -f client/.env ]; then
    echo -e "${YELLOW}Warning: client/.env not found${NC}"
    echo "Creating default client/.env..."
    if [ -n "$VITE_API_URL" ]; then
        echo "VITE_API_URL=$VITE_API_URL" > client/.env
        echo -e "${GREEN}✓ Created client/.env with VITE_API_URL from .env${NC}"
    else
        echo -e "${YELLOW}⚠ VITE_API_URL not set in .env, using default${NC}"
        echo "VITE_API_URL=http://localhost:5000/api" > client/.env
    fi
fi

echo -e "${YELLOW}Step 2: Building and starting Docker containers...${NC}"
docker-compose down
docker-compose up -d --build

echo -e "${YELLOW}Step 3: Waiting for services to be healthy...${NC}"
sleep 10

# Check if containers are running
if [ "$(docker ps -q -f name=luyenthi4-postgres)" ]; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    exit 1
fi

if [ "$(docker ps -q -f name=luyenthi4-backend)" ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
    exit 1
fi

if [ "$(docker ps -q -f name=luyenthi4-frontend)" ]; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost:80"
echo "  - Backend API: http://localhost:5000"
echo "  - PostgreSQL: localhost:5432"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose logs -f [service-name]"
echo "  - Restart: docker-compose restart [service-name]"
echo "  - Stop all: docker-compose down"
echo ""
