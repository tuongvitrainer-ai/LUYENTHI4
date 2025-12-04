#!/bin/bash

set -e

echo "🖥️  VPS Setup Script for Ubuntu 22.04"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}Step 2: Installing essential tools...${NC}"
apt install -y curl wget git vim ufw fail2ban

echo -e "${YELLOW}Step 3: Installing Docker...${NC}"
# Remove old versions
apt remove -y docker docker-engine docker.io containerd runc || true

# Install dependencies
apt install -y ca-certificates gnupg lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

echo -e "${YELLOW}Step 4: Installing Docker Compose...${NC}"
# Docker Compose is now included as a plugin, but we'll add standalone for compatibility
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo -e "${YELLOW}Step 5: Installing Node.js 20 (for PM2 alternative)...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${YELLOW}Step 6: Installing PM2 globally...${NC}"
npm install -g pm2

echo -e "${YELLOW}Step 7: Configuring firewall (UFW)...${NC}"
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5432/tcp  # PostgreSQL (only if you need external access)
echo -e "${GREEN}✓ Firewall configured${NC}"

echo -e "${YELLOW}Step 8: Configuring fail2ban...${NC}"
systemctl start fail2ban
systemctl enable fail2ban
echo -e "${GREEN}✓ Fail2ban configured${NC}"

echo -e "${YELLOW}Step 9: Creating deployment user...${NC}"
if id "deploy" &>/dev/null; then
    echo "User 'deploy' already exists"
else
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    echo -e "${GREEN}✓ User 'deploy' created${NC}"
    echo -e "${YELLOW}Set password for deploy user:${NC}"
    passwd deploy
fi

echo -e "${YELLOW}Step 10: Setting up swap (2GB)...${NC}"
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    echo -e "${GREEN}✓ Swap configured${NC}"
else
    echo "Swap already exists"
fi

echo -e "${YELLOW}Step 11: Installing Nginx (optional - for reverse proxy)...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx installed${NC}"

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✓ VPS Setup completed successfully!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "Installed software versions:"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: $(docker-compose --version)"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - PM2: $(pm2 --version)"
echo "  - Nginx: $(nginx -v 2>&1)"
echo ""
echo "Next steps:"
echo "  1. Exit and login as 'deploy' user"
echo "  2. Clone your repository"
echo "  3. Configure .env.production"
echo "  4. Run deployment script"
echo ""
echo -e "${YELLOW}Important: Configure SSH key authentication and disable password login!${NC}"
echo ""
