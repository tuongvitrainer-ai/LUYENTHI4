# 🚀 Quick Start - Deploy trong 5 phút

## ⚡ Các Lệnh Cần Chạy Trên VPS

### Bước 1: Setup VPS (chạy 1 lần duy nhất)
```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Download và chạy setup script
wget https://raw.githubusercontent.com/tuongvitrainer-ai/LUYENTHI4/main/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

### Bước 2: Clone Repository
```bash
# Đăng nhập user deploy
su - deploy

# Clone repo
git clone https://github.com/tuongvitrainer-ai/LUYENTHI4.git
cd LUYENTHI4
```

### Bước 3: Tạo File .env (QUAN TRỌNG!)
```bash
# Copy template
cp .env.example .env

# Edit file
nano .env
```

**Thay đổi các giá trị sau trong file .env:**

```bash
# 1. Database Password (bắt buộc đổi!)
DB_PASS=your_strong_password_here_123456

# 2. JWT Secret (bắt buộc đổi!)
JWT_SECRET=your_random_jwt_secret_32_chars_minimum

# 3. API URL (thay YOUR_VPS_IP hoặc YOUR_DOMAIN)
VITE_API_URL=http://YOUR_VPS_IP:5000/api
# Hoặc nếu có domain:
# VITE_API_URL=http://your-domain.com/api
```

**💡 Tip: Generate JWT Secret:**
```bash
openssl rand -base64 32
```

Sau khi edit xong, nhấn `Ctrl+X`, sau đó `Y`, sau đó `Enter` để lưu.

### Bước 4: Tạo File .env Cho Client
```bash
cd client
nano .env
```

Paste nội dung:
```bash
VITE_API_URL=http://YOUR_VPS_IP:5000/api
```

Thay `YOUR_VPS_IP` bằng IP VPS của bạn, rồi save (Ctrl+X, Y, Enter).

Quay về root directory:
```bash
cd ..
```

### Bước 5: Deploy!
```bash
# Cấp quyền cho script
chmod +x deploy.sh

# Deploy
./deploy.sh
```

### Bước 6: Kiểm Tra
```bash
# Xem containers
docker ps

# Xem logs
docker-compose logs -f

# Test API (mở tab mới)
curl http://localhost:5000/api/health

# Test Frontend
curl http://localhost:80
```

**Truy cập website:**
- Frontend: `http://YOUR_VPS_IP`
- Backend API: `http://YOUR_VPS_IP:5000/api`

---

## 🔧 Các Lệnh Hữu Ích

### Xem Logs
```bash
docker-compose logs -f              # Tất cả services
docker-compose logs -f backend      # Chỉ backend
docker-compose logs -f frontend     # Chỉ frontend
docker-compose logs -f postgres     # Chỉ database
```

### Restart Services
```bash
docker-compose restart backend      # Restart backend
docker-compose restart              # Restart tất cả
```

### Stop/Start
```bash
docker-compose down                 # Stop tất cả
docker-compose up -d                # Start tất cả
```

### Update Code
```bash
cd /home/deploy/LUYENTHI4
git pull origin main
./deploy.sh
```

### Backup Database
```bash
docker exec luyenthi4-postgres pg_dump -U luyenthi4 luyenthi4 > backup_$(date +%Y%m%d).sql
```

---

## 🔒 Setup SSL (Optional - Cho Domain)

Nếu bạn có domain, setup SSL miễn phí với Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Cấu hình Nginx cho domain
sudo nano /etc/nginx/sites-available/luyenthi4
```

Paste config (thay `your-domain.com`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable và lấy SSL:
```bash
sudo ln -s /etc/nginx/sites-available/luyenthi4 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## ❌ Troubleshooting

### Lỗi: Port 80 already in use
```bash
sudo lsof -i :80
sudo kill -9 PID_NUMBER
docker-compose down && docker-compose up -d
```

### Lỗi: Cannot connect to database
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Check environment variables
docker exec luyenthi4-backend env | grep DB_
```

### Lỗi: Frontend không load
```bash
# Rebuild frontend
cd client
npm run build
cd ..
docker-compose up -d --build frontend
```

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs [service_name]

# Restart tất cả
docker-compose down
docker-compose up -d

# Check disk space
df -h

# Check memory
free -h
```

---

## 📚 Tài Liệu Chi Tiết

- **DEPLOYMENT.md** - Hướng dẫn deploy đầy đủ (1400+ dòng)
- **VPS-4GB-OPTIMIZATION.md** - Tối ưu cho VPS 4GB RAM
- **docker-compose.yml** - Cấu hình Docker đã được tối ưu

---

## 🆘 Cần Giúp Đỡ?

1. Đọc phần Troubleshooting trong **DEPLOYMENT.md**
2. Check logs: `docker-compose logs -f`
3. Verify environment variables trong `.env`
4. Check firewall: `sudo ufw status`
5. Check containers: `docker ps -a`

---

**🎉 Chúc mừng! Website của bạn đã được deploy!**
