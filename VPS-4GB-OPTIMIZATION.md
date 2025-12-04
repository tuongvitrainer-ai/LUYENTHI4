# 🖥️ Tối Ưu Hóa Cho VPS 4GB RAM

## 📊 Cấu Hình VPS

- **CPU:** 2 Core Intel Xeon Gold
- **RAM:** 4GB
- **Storage:** 35GB SSD NVMe U.2
- **Network:** 100Mbps, băng thông không giới hạn
- **IPv4:** 1 địa chỉ

**Kết luận:** Cấu hình này **HOÀN TOÀN ĐỦ** để chạy full stack LUYENTHI4 với Docker!

---

## 🎯 Resource Allocation (Đã Tối Ưu)

### Phân Bổ RAM:

| Service | RAM Limit | RAM Reserved | CPU Limit | Note |
|---------|-----------|--------------|-----------|------|
| **PostgreSQL** | 1GB | 256MB | 1.0 cores | Database primary |
| **Backend** | 1GB | 256MB | 0.75 cores | Node.js with max-old-space-size=768MB |
| **Frontend** | 256MB | 32MB | 0.25 cores | Nginx static files |
| **Docker + OS** | ~1GB | - | - | System overhead |
| **Available** | ~750MB | - | - | Buffer for burst |

**Total RAM Usage:** ~2.5-3GB trong normal operation
**Peak Usage:** ~3.5GB khi có traffic cao
**Safety Buffer:** ~500MB-1GB

### Phân Bổ CPU:

```
PostgreSQL: 1.0 cores (có thể burst lên 2 cores nếu cần)
Backend:    0.75 cores (Node.js single-threaded mostly)
Frontend:   0.25 cores (Nginx rất nhẹ)
Total:      2.0 cores
```

---

## 🚀 Performance Expectations

### Concurrent Users:
- **Light traffic (browsing):** 500-800 users
- **Medium traffic (mixed):** 300-500 users
- **Heavy traffic (database ops):** 150-300 users

### Response Time:
- **Frontend:** <50ms (static files)
- **Backend API:** 50-200ms (depending on query)
- **Database queries:** 10-100ms (with proper indexes)

### Database:
- **Max connections:** 100 concurrent
- **Storage:** Có thể lưu ~10-20GB data trước khi cần scale
- **Queries/second:** ~500-1000 queries/s với simple queries

---

## ⚙️ Các Tối Ưu Đã Áp Dụng

### 1. Docker Resource Limits

Đã set trong `docker-compose.yml`:

```yaml
# PostgreSQL - Ưu tiên cao nhất
limits:
  cpus: '1.0'
  memory: 1G

# Backend - Ưu tiên trung bình
limits:
  cpus: '0.75'
  memory: 1G
environment:
  NODE_OPTIONS: --max-old-space-size=768  # Limit Node.js heap

# Frontend - Ưu tiên thấp (chỉ serve static)
limits:
  cpus: '0.25'
  memory: 256M
```

**Lợi ích:**
- Prevent OOM (Out of Memory) crashes
- Fair CPU distribution
- Containers không "ăn" hết resources

### 2. PostgreSQL Tuning

```yaml
POSTGRES_SHARED_BUFFERS: 512MB      # 25% của allocated RAM
POSTGRES_EFFECTIVE_CACHE_SIZE: 1GB  # Ước tính OS cache + PG cache
POSTGRES_MAX_CONNECTIONS: 100       # Đủ cho concurrent users
```

**Lợi ích:**
- Query performance tốt hơn
- Cache hit rate cao hơn
- Ít disk I/O hơn

### 3. Node.js Memory Limit

```yaml
NODE_OPTIONS: --max-old-space-size=768
```

**Lợi ích:**
- Prevent Node.js memory leak
- Garbage collection sớm hơn
- Stable memory usage

### 4. Alpine Linux Base Images

```dockerfile
FROM node:20-alpine    # ~50MB thay vì ~900MB (full)
FROM postgres:16-alpine # ~250MB thay vì ~400MB (full)
FROM nginx:alpine      # ~40MB thay vì ~150MB (full)
```

**Lợi ích:**
- Tiết kiệm ~1.5GB disk space
- Build nhanh hơn
- Pull image nhanh hơn
- Attack surface nhỏ hơn

---

## 🔧 Các Tối Ưu Bổ Sung (Nên Làm)

### 1. Enable Swap 2GB

```bash
# Đã có trong setup-vps.sh
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Lợi ích:**
- Tránh OOM killer
- PostgreSQL swap cold data
- Handle traffic spikes tốt hơn

**⚠️ Warning:** Swap trên SSD có thể giảm tuổi thọ SSD, nhưng với traffic bình thường thì không sao.

### 2. Tune Swappiness

```bash
# Prefer RAM over swap (chỉ swap khi thực sự cần)
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
```

### 3. Enable Docker Logging Limits

Thêm vào `docker-compose.yml`:

```yaml
services:
  postgres:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Lợi ích:**
- Logs không ăn hết disk
- Keep latest 30MB logs per service

### 4. Database Connection Pooling

Trong backend code (`server/config/db.js`):

```javascript
const pool = new Pool({
  max: 20,          // Max 20 connections per backend instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Lợi ích:**
- Prevent database connection exhaustion
- Reuse connections
- Better performance

### 5. Nginx Caching

Thêm vào `nginx.conf`:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503;
}
```

**Lợi ích:**
- Giảm load lên backend
- Response time nhanh hơn
- Cache API responses

---

## 📈 Monitoring Commands

### 1. Check Resource Usage

```bash
# Overall system
htop

# Docker stats
docker stats

# Specific container
docker stats luyenthi4-postgres

# Memory usage by process
ps aux --sort=-%mem | head -10

# Disk usage
df -h

# Network usage
iftop
```

### 2. PostgreSQL Performance

```bash
# Connect to DB
docker exec -it luyenthi4-postgres psql -U luyenthi4

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check slow queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

# Cache hit ratio (should be >95%)
SELECT
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

### 3. Backend Performance

```bash
# Response time testing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health

# Create curl-format.txt:
cat > curl-format.txt << 'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF

# Check Node.js memory
docker exec luyenthi4-backend node -e "console.log(process.memoryUsage())"
```

---

## ⚠️ Warning Signs (Cần Scale Up)

### Khi nào cần upgrade VPS?

**RAM:**
- Swap usage >1GB consistently
- OOM killer xuất hiện trong logs
- Containers restart frequently
- Response time >500ms thường xuyên

**CPU:**
- Load average >4.0 (2x số cores)
- CPU usage >80% trong thời gian dài
- Response time tăng mặc dù RAM còn

**Disk:**
- Free space <10% (3.5GB)
- Disk I/O wait >10%
- Database queries chậm mặc dù query đã optimize

**Network:**
- Bandwidth >80Mbps sustained
- Connection timeouts
- Users complain slow loading

---

## 🎯 Scale-Up Options

Nếu traffic tăng, có thể:

### Option 1: Vertical Scaling (Easier)
```
RAM:      4GB → 8GB      (+100% performance)
CPU:      2 cores → 4 cores
Storage:  35GB → 50GB
```

**Cost:** ~$10-15/month thêm
**Downtime:** ~5 phút (resize VPS)

### Option 2: Horizontal Scaling (Advanced)
```
1 VPS → 2-3 VPS với load balancer:
  - VPS 1: Frontend + Load Balancer
  - VPS 2: Backend (replicas)
  - VPS 3: PostgreSQL (primary + replica)
```

**Cost:** ~$30-50/month
**Downtime:** 0 (với proper setup)

### Option 3: Managed Services (Easiest)
```
- PostgreSQL → AWS RDS / DigitalOcean Managed DB
- Backend → AWS ECS / Google Cloud Run
- Frontend → Vercel / Netlify / CloudFlare Pages
```

**Cost:** ~$50-100/month
**Benefit:** Auto-scaling, backups, monitoring

---

## 📊 Benchmarks (Expected)

### Light Load (10-50 concurrent users):
```
CPU Usage:     10-20%
RAM Usage:     1.5-2GB
Response Time: 50-100ms
Database Conn: 5-15
```

### Medium Load (100-200 concurrent users):
```
CPU Usage:     40-60%
RAM Usage:     2.5-3GB
Response Time: 100-200ms
Database Conn: 20-40
```

### Heavy Load (300-500 concurrent users):
```
CPU Usage:     70-90%
RAM Usage:     3-3.5GB
Response Time: 200-400ms
Database Conn: 50-80
```

### ⚠️ Overload (>500 concurrent users):
```
CPU Usage:     >90%
RAM Usage:     >3.5GB (start swapping)
Response Time: >500ms
Status:        Need to scale up!
```

---

## ✅ Checklist Trước Khi Deploy

- [ ] Đã chạy `setup-vps.sh` và enable swap 2GB
- [ ] Docker resource limits đã được set trong `docker-compose.yml`
- [ ] PostgreSQL tuning parameters đã được configure
- [ ] Node.js memory limit đã được set
- [ ] Logging limits đã được configure
- [ ] Database indexes đã được tạo cho các queries thường dùng
- [ ] Monitoring scripts đã được setup
- [ ] Backup cron job đã được configure
- [ ] Firewall rules đã được apply
- [ ] SSL certificate đã được install

---

## 🔗 Quick Commands Reference

```bash
# Deploy/Update
cd /home/deploy/LUYENTHI4 && git pull && ./deploy.sh

# Check status
docker ps
docker stats --no-stream

# Restart services
docker-compose restart backend

# View logs
docker-compose logs -f --tail=100

# Backup database
docker exec luyenthi4-postgres pg_dump -U luyenthi4 luyenthi4 > backup_$(date +%Y%m%d).sql

# Check resource usage
free -h
df -h
htop

# Emergency - restart everything
docker-compose down && docker-compose up -d
```

---

## 🎉 Kết Luận

VPS **2 Core / 4GB RAM / 35GB SSD** của bạn là:

✅ **Đủ** cho 200-500 concurrent users
✅ **Đủ** cho database <20GB
✅ **Đủ** cho normal production load
✅ **Tốt** với các tối ưu đã apply

**Khuyến nghị:**
- Bắt đầu với cấu hình này
- Monitor usage trong 1-2 tuần
- Scale up nếu thấy warning signs
- Consider managed services nếu traffic >1000 users

**Expected lifespan trước khi cần scale:**
- **Small startup:** 6-12 tháng
- **Medium traffic:** 3-6 tháng
- **High growth:** 1-3 tháng

Good luck với deployment! 🚀
