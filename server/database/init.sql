-- 1. ENUMS (Định nghĩa các loại dữ liệu cố định)
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'essay', 'fill_in_blank', 'matching');
CREATE TYPE lesson_content_type AS ENUM ('video', 'text', 'game_module', 'pdf');
CREATE TYPE game_mode AS ENUM ('solo', 'pvp_realtime');

-- 2. USERS & AUTHENTICATION
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng liên kết Phụ huynh - Học sinh
CREATE TABLE parent_student (
    parent_id INTEGER REFERENCES users(id),
    student_id INTEGER REFERENCES users(id),
    PRIMARY KEY (parent_id, student_id)
);

-- 3. GAMIFICATION (VÍ & ĐIỂM THƯỞNG)
CREATE TABLE user_wallets (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    coins INTEGER DEFAULT 0, -- Xu để đổi quà
    stars INTEGER DEFAULT 0, -- Sao để xếp hạng
    accumulated_points INTEGER DEFAULT 0 -- Tổng điểm tích lũy trọn đời
);

-- 4. ACADEMIC STRUCTURE (CẤU TRÚC HỌC TẬP)
CREATE TABLE grades ( -- Khối lớp (Lớp 1, 2, 3...)
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE subjects ( -- Môn học (Toán, Tiếng Việt...)
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_id INTEGER REFERENCES grades(id)
);

CREATE TABLE chapters ( -- Chương bài học
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    title VARCHAR(200) NOT NULL,
    "order" INTEGER DEFAULT 0 -- Thứ tự sắp xếp
);

-- 5. LESSONS (BÀI HỌC)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT FALSE, -- Cho phép học thử không?
    "order" INTEGER DEFAULT 0
);

-- Chi tiết nội dung bài học (Video, Text, Game module)
CREATE TABLE lesson_contents (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id),
    type lesson_content_type NOT NULL,
    title VARCHAR(200),
    data_url TEXT, -- Link Youtube, Link file PDF, hoặc Link game module
    text_content TEXT, -- Nội dung soạn thảo từ React Quill
    "order" INTEGER DEFAULT 0
);

-- 6. QUESTION BANK & EXAMS (NGÂN HÀNG CÂU HỎI & THI)
CREATE TABLE question_bank (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id), -- Gắn thẻ môn học để lọc
    grade_id INTEGER REFERENCES grades(id),     -- Gắn thẻ lớp
    content JSONB NOT NULL, -- Chứa đề bài, đáp án A,B,C,D (Lưu JSON cho linh hoạt)
    correct_answer TEXT NOT NULL,
    explanation TEXT, -- Giải thích đáp án
    difficulty_level INTEGER DEFAULT 1, -- 1: Dễ, 2: Vừa, 3: Khó
    type question_type NOT NULL
);

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER, -- Thời gian làm bài
    grade_id INTEGER REFERENCES grades(id),
    created_by INTEGER REFERENCES users(id) -- Giáo viên tạo đề
);

-- Liên kết Đề thi - Câu hỏi
CREATE TABLE exam_questions (
    exam_id INTEGER REFERENCES exams(id),
    question_id INTEGER REFERENCES question_bank(id),
    points INTEGER DEFAULT 10, -- Điểm số cho câu này
    PRIMARY KEY (exam_id, question_id)
);

-- 7. RESULTS & LEADERBOARD (KẾT QUẢ & XẾP HẠNG)
CREATE TABLE exam_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    exam_id INTEGER REFERENCES exams(id),
    score DECIMAL(5,2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in_progress' -- in_progress, completed
);

-- Bảng lưu chi tiết từng câu trả lời của học sinh
CREATE TABLE attempt_answers (
    attempt_id INTEGER REFERENCES exam_attempts(id),
    question_id INTEGER REFERENCES question_bank(id),
    user_answer TEXT,
    is_correct BOOLEAN
);

-- 8. REAL-TIME PVP (Dành cho tương lai)
CREATE TABLE pvp_matches (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER REFERENCES users(id),
    player2_id INTEGER REFERENCES users(id),
    game_module_id INTEGER, -- ID của game module (ví dụ: game nối từ)
    winner_id INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);