# 🚀 Hướng Dẫn Deploy LUYENTHI4 lên VPS Ubuntu 22.04

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Phương Pháp 1: Deploy với Docker Compose (Khuyến nghị)](#phương-pháp-1-docker-compose)
3. [Phương Pháp 2: Deploy với PM2 + Nginx](#phương-pháp-2-pm2--nginx)
4. [Cấu Hình SSL với Let's Encrypt](#cấu-hình-ssl)
5. [Quản Lý và Monitoring](#quản-lý-và-monitoring)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ Yêu Cầu Hệ Thống

### Minimum Requirements
- **OS:** Ubuntu 22.04 LTS
- **RAM:** 2GB (khuyến nghị 4GB+)
- **CPU:** 2 cores
- **Disk:** 20GB
- **Network:** Public IP address

### Phần Mềm Cần Thiết
- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 16
- Nginx
- PM2 (cho phương pháp 2)

---

## 🐳 Phương Pháp 1: Docker Compose (Khuyến nghị)

### Ưu điểm:
- ✅ Dễ dàng triển khai và quản lý
- ✅ Isolated environment
- ✅ Dễ rollback khi có lỗi
- ✅ Portable giữa các môi trường
- ✅ Auto restart khi server reboot

### Bước 1: Chuẩn Bị VPS

#### 1.1. Kết nối vào VPS qua SSH
```bash
ssh root@your-vps-ip
```

#### 1.2. Chạy script setup tự động
```bash
# Upload script lên VPS hoặc tạo file mới
nano setup-vps.sh

# Paste nội dung từ file setup-vps.sh vào

# Cấp quyền thực thi
chmod +x setup-vps.sh

# Chạy script
sudo ./setup-vps.sh
```

**Script sẽ tự động:**
- Cập nhật hệ thống
- Cài đặt Docker & Docker Compose
- Cài đặt Node.js & PM2
- Cài đặt Nginx
- Cấu hình firewall (UFW)
- Cấu hình fail2ban
- Tạo user `deploy`
- Setup swap 2GB

#### 1.3. (Optional) Setup theo cách thủ công

Nếu không muốn dùng script, bạn có thể cài từng bước:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Install Docker Compose
sudo apt install docker-compose-plugin -y

# 4. Verify installation
docker --version
docker compose version
```

### Bước 2: Clone Repository

```bash
# Đăng nhập user deploy (hoặc tạo user mới)
su - deploy

# Clone repository
git clone https://github.com/tuongvitrainer-ai/LUYENTHI4.git
cd LUYENTHI4
```

### Bước 3: Cấu Hình Environment Variables

```bash
# Copy file template
cp .env.production .env

# Edit file .env
nano .env
```

**Cấu hình quan trọng trong `.env`:**

```bash
# Database
DB_USER=luyenthi4
DB_PASS=your_very_secure_password_123456  # ⚠️ ĐỔI MẬT KHẨU NÀY!
DB_NAME=luyenthi4
DB_HOST=postgres
DB_PORT=5432

# Backend
PORT=5000
NODE_ENV=production

# JWT Secret (CRITICAL!)
JWT_SECRET=super_secret_jwt_key_change_this_now_xyz123abc  # ⚠️ ĐỔI KEY NÀY!

# Frontend API URL
VITE_API_URL=http://your-domain.com/api  # Hoặc http://your-ip:5000/api
```

**⚠️ BẢO MẬT QUAN TRỌNG:**
- Đổi `DB_PASS` thành mật khẩu mạnh
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên dài (tối thiểu 32 ký tự)
- Có thể generate JWT secret bằng: `openssl rand -base64 32`

### Bước 4: Cấu Hình Client Environment

```bash
# Tạo file .env cho client
cd client
nano .env
```

Paste nội dung:
```bash
VITE_API_URL=http://your-domain.com/api
# Hoặc nếu chưa có domain:
# VITE_API_URL=http://your-vps-ip:5000/api
```

### Bước 5: Build và Deploy

```bash
# Quay về root directory
cd /home/deploy/LUYENTHI4

# Cấp quyền thực thi cho script
chmod +x deploy.sh

# Chạy deployment
./deploy.sh
```

**Script sẽ tự động:**
1. Pull code mới nhất
2. Build Docker images
3. Start tất cả containers
4. Check health của từng service

### Bước 6: Kiểm Tra Deployment

```bash
# Xem trạng thái containers
docker ps

# Xem logs
docker-compose logs -f

# Xem logs từng service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Kiểm tra services:**
```bash
# Check backend API
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:80

# Check database
docker exec -it luyenthi4-postgres psql -U luyenthi4 -d luyenthi4
```

### Bước 7: Cấu Hình Nginx Reverse Proxy (Recommended)

#### 7.1. Cài đặt Nginx (nếu chưa có)
```bash
sudo apt install nginx -y
```

#### 7.2. Tạo cấu hình cho website
```bash
sudo nano /etc/nginx/sites-available/luyenthi4
```

Paste nội dung:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Đổi thành domain của bạn

    client_max_body_size 20M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 7.3. Enable site và restart Nginx
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/luyenthi4 /etc/nginx/sites-enabled/

# Test cấu hình
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Bước 8: Setup Auto-start on Boot

```bash
# Docker containers sẽ tự động start khi reboot nhờ cấu hình `restart: unless-stopped`

# Enable Docker service
sudo systemctl enable docker

# Test reboot
sudo reboot

# Sau khi reboot, SSH vào lại và check:
docker ps
```

---

## 🔧 Phương Pháp 2: PM2 + Nginx (Traditional)

### Ưu điểm:
- ✅ Không cần Docker
- ✅ Performance tốt hơn một chút
- ✅ Kiểm soát chi tiết hơn

### Nhược điểm:
- ❌ Phức tạp hơn trong việc quản lý dependencies
- ❌ Khó portable giữa các môi trường

### Bước 1: Cài đặt PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database và user
sudo -u postgres psql
```

Trong PostgreSQL shell:
```sql
CREATE DATABASE luyenthi4;
CREATE USER luyenthi4 WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE luyenthi4 TO luyenthi4;
\q
```

### Bước 2: Clone và Setup Backend

```bash
cd /home/deploy
git clone https://github.com/tuongvitrainer-ai/LUYENTHI4.git
cd LUYENTHI4/server

# Install dependencies
npm install --production

# Tạo .env file
nano .env
```

Paste:
```bash
PORT=5000
NODE_ENV=production
DB_USER=luyenthi4
DB_HOST=localhost
DB_NAME=luyenthi4
DB_PASS=your_secure_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
```

### Bước 3: Setup Frontend

```bash
cd /home/deploy/LUYENTHI4/client

# Create .env
nano .env
```

Paste:
```bash
VITE_API_URL=http://your-domain.com/api
```

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### Bước 4: Deploy với PM2

```bash
# Quay về root directory
cd /home/deploy/LUYENTHI4

# Start backend với PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy và chạy command mà PM2 output ra
```

### Bước 5: Cấu Hình Nginx

```bash
sudo nano /etc/nginx/sites-available/luyenthi4
```

Paste:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend - serve static files
    root /home/deploy/LUYENTHI4/client/dist;
    index index.html;

    client_max_body_size 20M;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API requests
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable và restart Nginx
sudo ln -s /etc/nginx/sites-available/luyenthi4 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Cấu Hình SSL với Let's Encrypt

### Bước 1: Cài đặt Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Bước 2: Lấy SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts:
1. Nhập email
2. Đồng ý terms of service
3. Chọn redirect HTTP to HTTPS (option 2)

### Bước 3: Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot tự động tạo cron job để renew
# Kiểm tra:
sudo systemctl status certbot.timer
```

### Bước 4: Update Client Environment

```bash
# Update VITE_API_URL to use HTTPS
nano /home/deploy/LUYENTHI4/client/.env
```

Change to:
```bash
VITE_API_URL=https://your-domain.com/api
```

```bash
# Rebuild frontend
cd /home/deploy/LUYENTHI4/client
npm run build

# Restart services
# For Docker:
docker-compose restart frontend

# For PM2:
sudo systemctl restart nginx
```

---

## 📊 Quản Lý và Monitoring

### Docker Commands

```bash
# Xem logs realtime
docker-compose logs -f

# Xem logs của 1 service
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Rebuild và restart
docker-compose up -d --build

# Xem resource usage
docker stats

# Vào bên trong container
docker exec -it luyenthi4-backend sh
```

### PM2 Commands

```bash
# Xem status
pm2 status

# Xem logs
pm2 logs

# Restart
pm2 restart luyenthi4-backend

# Stop
pm2 stop luyenthi4-backend

# Delete process
pm2 delete luyenthi4-backend

# Monitor
pm2 monit

# Xem thông tin chi tiết
pm2 info luyenthi4-backend
```

### Database Management

```bash
# Backup database (Docker)
docker exec luyenthi4-postgres pg_dump -U luyenthi4 luyenthi4 > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database (Docker)
cat backup.sql | docker exec -i luyenthi4-postgres psql -U luyenthi4 -d luyenthi4

# Connect to database (Docker)
docker exec -it luyenthi4-postgres psql -U luyenthi4 -d luyenthi4

# Backup database (PM2 method)
pg_dump -U luyenthi4 luyenthi4 > backup_$(date +%Y%m%d_%H%M%S).sql

# Setup automatic backup cron job
crontab -e
```

Add this line for daily backup at 2 AM:
```bash
0 2 * * * docker exec luyenthi4-postgres pg_dump -U luyenthi4 luyenthi4 > /home/deploy/backups/db_$(date +\%Y\%m\%d).sql
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload (no downtime)
sudo nginx -s reload

# Restart
sudo systemctl restart nginx

# Xem logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Troubleshooting

### Issue 1: Containers không start

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h

# Remove unused containers/images
docker system prune -a
```

### Issue 2: Backend không connect được database

```bash
# Check PostgreSQL container
docker ps | grep postgres

# Check logs
docker-compose logs postgres

# Try connecting manually
docker exec -it luyenthi4-postgres psql -U luyenthi4

# Check environment variables
docker exec luyenthi4-backend env | grep DB_
```

### Issue 3: Frontend không load được

```bash
# Check if built successfully
ls -la client/dist/

# Check Nginx logs
docker-compose logs frontend

# Rebuild frontend
cd client
npm run build
docker-compose up -d --build frontend
```

### Issue 4: Port already in use

```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000
sudo lsof -i :5432

# Kill process
sudo kill -9 PID
```

### Issue 5: Permission denied

```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER /home/deploy/LUYENTHI4
```

### Issue 6: Out of memory

```bash
# Check memory
free -h

# Increase swap
sudo fallocate -l 4G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2

# Add to /etc/fstab
echo '/swapfile2 none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📈 Performance Optimization

### 1. Enable Nginx Caching

```nginx
# Add to nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    # ... other proxy settings
}
```

### 2. Enable Gzip Compression

Already configured in nginx.conf, but verify:
```bash
curl -H "Accept-Encoding: gzip" -I http://your-domain.com
```

### 3. Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_games_created_at ON games(created_at);

-- Analyze tables
ANALYZE users;
ANALYZE games;
```

### 4. PM2 Cluster Mode

Already configured in `ecosystem.config.js` with 2 instances:
```javascript
instances: 2,
exec_mode: 'cluster'
```

---

## 🔐 Security Checklist

- [ ] Changed default passwords (DB_PASS, JWT_SECRET)
- [ ] Configured firewall (UFW)
- [ ] Installed fail2ban
- [ ] Setup SSL certificate
- [ ] Disabled root SSH login
- [ ] Setup SSH key authentication
- [ ] Regular system updates
- [ ] Database backup schedule
- [ ] Monitor logs regularly
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable CORS properly
- [ ] Sanitize user inputs
- [ ] Rate limiting on API

---

## 📞 Các Lệnh Hữu Ích

```bash
# System info
htop                    # Monitor CPU, RAM
df -h                   # Disk usage
free -h                 # Memory usage
netstat -tulpn          # Active connections

# Docker
docker ps                           # Running containers
docker-compose ps                   # Services status
docker system df                    # Disk usage
docker-compose down && docker-compose up -d --build  # Full restart

# Logs
journalctl -u nginx -f              # Nginx systemd logs
tail -f /var/log/nginx/error.log    # Nginx error logs
pm2 logs                            # PM2 logs
docker-compose logs -f --tail=100   # Last 100 lines

# Database
docker exec -it luyenthi4-postgres psql -U luyenthi4  # Connect to DB
pg_dump > backup.sql                                   # Backup
psql < backup.sql                                      # Restore
```

---

## 🎯 Update và Deployment Mới

### Update Code (Docker method)

```bash
cd /home/deploy/LUYENTHI4
git pull origin main
./deploy.sh
```

### Update Code (PM2 method)

```bash
cd /home/deploy/LUYENTHI4
git pull origin main

# Update backend
cd server
npm install
pm2 restart luyenthi4-backend

# Update frontend
cd ../client
npm install
npm run build
sudo systemctl reload nginx
```

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## ✅ Checklist Sau Khi Deploy

- [ ] Website accessible từ browser
- [ ] API endpoints hoạt động
- [ ] Database connection OK
- [ ] SSL certificate installed
- [ ] Auto-restart on reboot configured
- [ ] Backup schedule setup
- [ ] Monitoring configured
- [ ] Firewall rules applied
- [ ] Security headers configured
- [ ] Logs accessible

---

**🎉 Chúc mừng! Website của bạn đã được deploy thành công!**

Nếu gặp vấn đề, tham khảo phần [Troubleshooting](#troubleshooting) hoặc check logs để debug.
