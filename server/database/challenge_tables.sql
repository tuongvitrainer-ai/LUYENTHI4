-- Migration: Tạo bảng lưu kết quả game "Thử Thách Khởi Đầu"

-- Bảng lưu kết quả test
CREATE TABLE IF NOT EXISTS challenge_tests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    grade_level INTEGER NOT NULL CHECK (grade_level IN (3, 4, 5)),
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0, -- Điểm phần trăm (0-100)
    time_taken INTEGER DEFAULT 0, -- Thời gian làm bài (giây)
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu chi tiết từng câu trả lời
CREATE TABLE IF NOT EXISTS challenge_answers (
    id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL REFERENCES challenge_tests(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tăng tốc query
CREATE INDEX IF NOT EXISTS idx_challenge_tests_user_id ON challenge_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_tests_grade_level ON challenge_tests(grade_level);
CREATE INDEX IF NOT EXISTS idx_challenge_tests_completed_at ON challenge_tests(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_answers_test_id ON challenge_answers(test_id);
CREATE INDEX IF NOT EXISTS idx_challenge_answers_question_id ON challenge_answers(question_id);

-- Thêm comment cho các bảng
COMMENT ON TABLE challenge_tests IS 'Lưu kết quả game Thử Thách Khởi Đầu';
COMMENT ON TABLE challenge_answers IS 'Lưu chi tiết từng câu trả lời trong game Thử Thách Khởi Đầu';
