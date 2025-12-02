-- Migration: Tạo bảng vocabulary_questions cho game Vocabulary Movers

-- Bảng lưu câu hỏi từ vựng (Movers, Flyers, Starters)
CREATE TABLE IF NOT EXISTS vocabulary_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,                          -- Câu hỏi (VD: "Your mother's or...")
    options_json JSONB NOT NULL,                          -- Mảng các đáp án JSON: ["uncle","aunt","cousin","grandma"]
    correct_answer TEXT NOT NULL,                         -- Đáp án đúng (VD: "aunt")
    explanation TEXT,                                     -- Giải thích đáp án
    picture TEXT,                                         -- URL ảnh minh họa (nếu có)
    subject VARCHAR(100) DEFAULT 'english',               -- Môn học (mặc định: english)
    topic VARCHAR(200) NOT NULL,                          -- Chủ đề (VD: "Family & Friends")
    grade_level VARCHAR(50) NOT NULL,                     -- Cấp độ: movers, flyers, starters
    content_json JSONB,                                   -- Dữ liệu bổ sung (nếu cần)
    created_by INTEGER REFERENCES users(id),              -- Người tạo câu hỏi
    is_active BOOLEAN DEFAULT TRUE,                       -- Câu hỏi có active không?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Ngày tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Ngày cập nhật
);

-- Tạo index để tăng tốc query
CREATE INDEX IF NOT EXISTS idx_vocabulary_questions_grade_level ON vocabulary_questions(grade_level);
CREATE INDEX IF NOT EXISTS idx_vocabulary_questions_topic ON vocabulary_questions(topic);
CREATE INDEX IF NOT EXISTS idx_vocabulary_questions_subject ON vocabulary_questions(subject);
CREATE INDEX IF NOT EXISTS idx_vocabulary_questions_is_active ON vocabulary_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_vocabulary_questions_created_at ON vocabulary_questions(created_at DESC);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_vocabulary_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at khi update
CREATE TRIGGER trigger_update_vocabulary_questions_updated_at
    BEFORE UPDATE ON vocabulary_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_questions_updated_at();

-- Comment cho bảng
COMMENT ON TABLE vocabulary_questions IS 'Lưu câu hỏi từ vựng cho game Vocabulary Movers/Flyers/Starters';
COMMENT ON COLUMN vocabulary_questions.options_json IS 'Mảng JSON các đáp án, VD: ["uncle","aunt","cousin","grandma"]';
COMMENT ON COLUMN vocabulary_questions.grade_level IS 'Cấp độ: movers, flyers, hoặc starters';

-- Insert dữ liệu mẫu (từ hình ảnh bạn cung cấp)
INSERT INTO vocabulary_questions (question_text, options_json, correct_answer, explanation, subject, topic, grade_level, is_active)
VALUES
    ('Your mother''s or father''s sister',
     '["uncle","aunt","cousin","grandma"]'::jsonb,
     'aunt',
     'Cô, dì, mợ, bác gái (Chị em gái của bố mẹ)',
     'english',
     'Family & Friends',
     'movers',
     TRUE),

    ('Your mother''s or father''s brother',
     '["aunt","father","uncle","son"]'::jsonb,
     'uncle',
     'Chú, cậu, bác trai (Anh em trai của bố mẹ)',
     'english',
     'Family & Friends',
     'movers',
     TRUE),

    ('Your grandmother or grandfather',
     '["parent","grandparent","cousin","sister"]'::jsonb,
     'grandparent',
     'Ông hoặc Bà',
     'english',
     'Family & Friends',
     'movers',
     TRUE),

    ('The daughter of your parents',
     '["grandson","sister","mother","granddaughter"]'::jsonb,
     'granddaughter',
     'Cháu gái (của ông bà)',
     'english',
     'Family & Friends',
     'movers',
     TRUE),

    ('The son of your parents',
     '["brother","father","grandson","son"]'::jsonb,
     'grandson',
     'Cháu trai (của ông bà)',
     'english',
     'Family & Friends',
     'movers',
     TRUE);

-- Verification query
SELECT id, question_text, options_json, correct_answer, topic, grade_level, created_at
FROM vocabulary_questions
ORDER BY id;
