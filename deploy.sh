#!/bin/bash

set -e

echo "🚀 LUYENTHI4 Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please copy .env.production template and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
git pull origin main

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
