# 📚 Hướng dẫn Setup Database cho Movers Quest

## Bước 1: Cài đặt PostgreSQL

### Windows:
```bash
# Download và cài đặt từ: https://www.postgresql.org/download/windows/
# Hoặc dùng Chocolatey:
choco install postgresql
```

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Bước 2: Kết nối vào PostgreSQL

```bash
# Kết nối bằng user postgres (default)
psql -U postgres

# Hoặc nếu đã tạo user khác
psql -U your_username -d postgres
```

## Bước 3: Tạo Database mới

Trong PostgreSQL shell, chạy:

```sql
-- Tạo database
CREATE DATABASE "question-cambridge-english"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Kiểm tra database đã tạo
\l

-- Kết nối vào database mới
\c question-cambridge-english
```

## Bước 4: Chạy SQL Script để tạo bảng

### Cách 1: Trong PostgreSQL shell
```sql
-- Đảm bảo đang kết nối vào database question-cambridge-english
\c question-cambridge-english

-- Chạy file SQL
\i /home/user/LUYENTHI4/server/sql/create_cambridge_questions.sql
```

### Cách 2: Dùng psql command line
```bash
psql -U postgres -d question-cambridge-english -f /home/user/LUYENTHI4/server/sql/create_cambridge_questions.sql
```

### Cách 3: Dùng pgAdmin (GUI)
1. Mở pgAdmin
2. Kết nối vào server
3. Right-click vào Databases → Create → Database
4. Nhập tên: `question-cambridge-english`
5. Click Save
6. Right-click vào database mới → Query Tool
7. Copy paste nội dung file `create_cambridge_questions.sql`
8. Click Execute (F5)

## Bước 5: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `server/`:

```bash
cd /home/user/LUYENTHI4/server
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_actual_password
DB_NAME=question-cambridge-english

# JWT
JWT_SECRET=your_secret_key_123456789
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173
```

## Bước 6: Kiểm tra kết nối

### Test trong PostgreSQL:
```sql
-- Kết nối vào database
\c question-cambridge-english

-- Kiểm tra bảng đã tạo
\dt

-- Xem dữ liệu mẫu
SELECT id, question_text, correct_answer, topic FROM cambridge_questions LIMIT 5;

-- Đếm tổng số câu hỏi
SELECT COUNT(*) FROM cambridge_questions WHERE is_active = TRUE;
```

### Test từ Node.js server:
```bash
cd /home/user/LUYENTHI4/server
npm install  # Cài dependencies nếu chưa có
node -e "const db = require('./config/db'); db.query('SELECT NOW()').then(r => console.log('✅ Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e));"
```

## Bước 7: Khởi động Server

```bash
cd /home/user/LUYENTHI4/server
npm run dev
```

Kiểm tra endpoint:
```bash
# Test API endpoint
curl http://localhost:5000/api/games/vocabulary-movers?limit=5&level=movers

# Hoặc mở browser:
http://localhost:5000/api/games/vocabulary-movers?limit=5&level=movers
```

## Troubleshooting

### Lỗi: "peer authentication failed"
```bash
# Chỉnh sửa pg_hba.conf
sudo nano /etc/postgresql/[version]/main/pg_hba.conf

# Thay đổi dòng:
# local   all             postgres                                peer
# Thành:
local   all             postgres                                md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Lỗi: "password authentication failed"
```bash
# Reset password cho user postgres
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

### Lỗi: "database does not exist"
```bash
# Kiểm tra danh sách databases
psql -U postgres -l

# Tạo lại database nếu cần
createdb -U postgres question-cambridge-english
```

## Cấu trúc Database

### Bảng: `cambridge_questions`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key, auto increment |
| question_text | TEXT | Nội dung câu hỏi |
| options_json | JSONB | Mảng các đáp án |
| correct_answer | VARCHAR(255) | Đáp án đúng (dạng text) |
| explanation | TEXT | Giải thích đáp án |
| content_json | TEXT | Nội dung bổ sung (optional) |
| picture | BOOLEAN | Có hình ảnh hay không |
| subject | VARCHAR(100) | Môn học (english) |
| topic | VARCHAR(255) | Chủ đề (VD: Family & Friends) |
| grade_level | VARCHAR(50) | Cấp độ (movers, flyers, starters) |
| created_by | INTEGER | ID người tạo câu hỏi |
| is_active | BOOLEAN | Câu hỏi có active không |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

## Indexes đã tạo:
- `idx_cambridge_subject` - Query theo môn học
- `idx_cambridge_topic` - Query theo chủ đề
- `idx_cambridge_grade_level` - Query theo cấp độ
- `idx_cambridge_is_active` - Filter câu hỏi active
- `idx_cambridge_created_at` - Sort theo thời gian

## Dữ liệu mẫu

File SQL đã bao gồm 12 câu hỏi mẫu về chủ đề "Family & Friends" cho cấp độ Movers.

Bạn có thể thêm câu hỏi mới:

```sql
INSERT INTO cambridge_questions (
    question_text,
    options_json,
    correct_answer,
    explanation,
    picture,
    subject,
    topic,
    grade_level
) VALUES (
    'Your question here',
    '["option1","option2","option3","option4"]'::jsonb,
    'correct_option',
    'Explanation in Vietnamese',
    TRUE,
    'english',
    'Your Topic',
    'movers'
);
```

## Backup & Restore

### Backup database:
```bash
pg_dump -U postgres question-cambridge-english > backup_$(date +%Y%m%d).sql
```

### Restore database:
```bash
psql -U postgres question-cambridge-english < backup_20251201.sql
```

---

✅ **Setup hoàn tất!** Bây giờ bạn có thể chạy game Movers Quest với database riêng.
