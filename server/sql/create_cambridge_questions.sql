-- ========================================
-- CREATE DATABASE FOR CAMBRIDGE ENGLISH QUESTIONS
-- ========================================

-- Step 1: Tạo database mới (chạy lệnh này khi kết nối vào postgres database)
-- CREATE DATABASE "question-cambridge-english"
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.utf8'
--     LC_CTYPE = 'en_US.utf8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Step 2: Kết nối vào database "question-cambridge-english" rồi chạy script bên dưới

-- ========================================
-- CREATE TABLE FOR CAMBRIDGE ENGLISH QUESTIONS
-- ========================================

CREATE TABLE IF NOT EXISTS cambridge_questions (
    id SERIAL PRIMARY KEY,

    -- Question content
    question_text TEXT NOT NULL,
    options_json JSONB NOT NULL,  -- Array các đáp án: ["aunt","father","uncle","son"]
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    content_json TEXT,  -- Additional content if needed

    -- Media
    picture BOOLEAN DEFAULT FALSE,

    -- Metadata
    subject VARCHAR(100) DEFAULT 'english',
    topic VARCHAR(255) NOT NULL,  -- VD: "Family & Friends"
    grade_level VARCHAR(50) DEFAULT 'movers',  -- movers, flyers, starters

    -- User tracking
    created_by INTEGER,  -- User ID who created the question

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_cambridge_subject ON cambridge_questions(subject);
CREATE INDEX idx_cambridge_topic ON cambridge_questions(topic);
CREATE INDEX idx_cambridge_grade_level ON cambridge_questions(grade_level);
CREATE INDEX idx_cambridge_is_active ON cambridge_questions(is_active);
CREATE INDEX idx_cambridge_created_at ON cambridge_questions(created_at);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cambridge_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cambridge_questions_updated_at
BEFORE UPDATE ON cambridge_questions
FOR EACH ROW
EXECUTE FUNCTION update_cambridge_questions_updated_at();

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

INSERT INTO cambridge_questions (
    question_text,
    options_json,
    correct_answer,
    explanation,
    picture,
    subject,
    topic,
    grade_level,
    is_active
) VALUES
(
    'Your mother''s or your father''s sister is your ___',
    '["uncle","aunt","cousin","grandparent"]'::jsonb,
    'aunt',
    'Cô, dì, mợ, bác gái (Chị em gái của bố mẹ)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'Your mother''s or your father''s brother is your ___',
    '["aunt","father","uncle","son"]'::jsonb,
    'uncle',
    'Chú, cậu, bác trai (Anh em trai của bố mẹ)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'Your grandmother or your grandfather is your ___',
    '["parent","grandparent","cousin","aunt"]'::jsonb,
    'grandparent',
    'Ông hoặc Bà',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'The daughter of your uncle or aunt is your ___',
    '["grandson","sister","mother","cousin"]'::jsonb,
    'cousin',
    'Anh chị em họ (Con gái/trai của chú bác)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'Your mother or your father is your ___',
    '["parent","uncle","aunt","teacher"]'::jsonb,
    'parent',
    'Bố hoặc Mẹ (Phụ huynh)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'A male child in relation to the parent is a ___',
    '["daughter","son","father","uncle"]'::jsonb,
    'son',
    'Con trai (của bố mẹ)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'A female child in relation to the parent is a ___',
    '["son","mother","aunt","daughter"]'::jsonb,
    'daughter',
    'Con gái (của bố mẹ)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'A very young child is called a ___',
    '["grown-up","man","baby","woman"]'::jsonb,
    'baby',
    'Em bé (Trẻ sơ sinh)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'An adult; not a child anymore is a ___',
    '["baby","child","boy","grown-up"]'::jsonb,
    'grown-up',
    'Người lớn (Người trưởng thành)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'Someone you like spending time with is your ___',
    '["friend","family","cousin","neighbour"]'::jsonb,
    'friend',
    'Bạn bè',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'This person lives near your house',
    '["friend","family","cousin","neighbour"]'::jsonb,
    'neighbour',
    'Hàng xóm (Người sống cạnh nhà)',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
),
(
    'Someone who is in the same class as you at school',
    '["teacher","nurse","classmate","friend"]'::jsonb,
    'classmate',
    'Bạn cùng lớp',
    TRUE,
    'english',
    'Family & Friends',
    'movers',
    TRUE
);

-- ========================================
-- VERIFY DATA
-- ========================================

SELECT
    id,
    question_text,
    correct_answer,
    topic,
    grade_level,
    is_active
FROM cambridge_questions
ORDER BY id;

-- Check total count
SELECT COUNT(*) as total_questions FROM cambridge_questions WHERE is_active = TRUE;
