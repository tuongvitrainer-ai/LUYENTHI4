const db = require('../config/db');

/**
 * Lấy danh sách tất cả game/exam
 * @returns {Promise<Array>} Danh sách exams
 */
const getAllGames = async () => {
  try {
    const result = await db.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.duration_minutes,
        e.grade_id,
        g.name as grade_name,
        u.username as created_by_username
      FROM exams e
      LEFT JOIN grades g ON e.grade_id = g.id
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.id DESC
    `);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một game/exam theo ID (không bao gồm câu hỏi)
 * @param {number} id - ID của exam
 * @returns {Promise<Object|null>} Exam object hoặc null
 */
const getGameById = async (id) => {
  try {
    const result = await db.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.duration_minutes,
        e.grade_id,
        g.name as grade_name,
        e.created_by,
        u.username as created_by_username
      FROM exams e
      LEFT JOIN grades g ON e.grade_id = g.id
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
    `, [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách câu hỏi của một exam
 * @param {number} examId - ID của exam
 * @returns {Promise<Array>} Danh sách câu hỏi
 */
const getGameQuestions = async (examId) => {
  try {
    const result = await db.query(`
      SELECT
        q.id,
        q.content,
        q.type,
        q.difficulty_level,
        eq.points
      FROM exam_questions eq
      JOIN question_bank q ON eq.question_id = q.id
      WHERE eq.exam_id = $1
      ORDER BY q.id
    `, [examId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Lưu kết quả attempt của user
 * @param {Object} data - { userId, examId, score }
 * @returns {Promise<Object>} Attempt object vừa tạo
 */
const createAttempt = async ({ userId, examId, score }) => {
  try {
    const result = await db.query(`
      INSERT INTO exam_attempts (user_id, exam_id, score, status, completed_at)
      VALUES ($1, $2, $3, 'completed', CURRENT_TIMESTAMP)
      RETURNING *
    `, [userId, examId, score]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Lưu chi tiết câu trả lời của user
 * @param {Object} data - { attemptId, questionId, userAnswer, isCorrect }
 * @returns {Promise<void>}
 */
const saveAttemptAnswer = async ({ attemptId, questionId, userAnswer, isCorrect }) => {
  try {
    await db.query(`
      INSERT INTO attempt_answers (attempt_id, question_id, user_answer, is_correct)
      VALUES ($1, $2, $3, $4)
    `, [attemptId, questionId, userAnswer, isCorrect]);
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy lịch sử attempts của user cho một exam
 * @param {number} userId
 * @param {number} examId
 * @returns {Promise<Array>} Danh sách attempts
 */
const getUserAttempts = async (userId, examId) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM exam_attempts
      WHERE user_id = $1 AND exam_id = $2
      ORDER BY completed_at DESC
    `, [userId, examId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy câu hỏi ngẫu nhiên cho game "Thử Thách Khởi Đầu" theo grade level
 * @param {number} gradeLevel - Lớp (3, 4, 5)
 * @param {number} limit - Số câu hỏi cần lấy (mặc định 15)
 * @returns {Promise<Array>} Danh sách câu hỏi
 */
const getChallengeQuestions = async (gradeLevel, limit = 15) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        question_text,
        options_json,
        correct_answer,
        subject,
        topic,
        grade_level
      FROM questions
      WHERE grade_level = $1
      ORDER BY RANDOM()
      LIMIT $2
    `, [gradeLevel, limit]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy câu hỏi với lọc môn học và độ khó
 * @param {Object} params - { gradeLevel, subjects, difficultyLevel, limit }
 * @returns {Promise<Array>} Danh sách câu hỏi
 */
const getChallengeQuestionsWithFilters = async ({ gradeLevel, subjects = [], difficultyLevel = 6, limit = 15 }) => {
  try {
    // Map difficulty level to distribution
    const difficultyMap = {
      1: { easy: 1.0, medium: 0, hard: 0 },
      2: { easy: 0.8, medium: 0.2, hard: 0 },
      3: { easy: 0.6, medium: 0.4, hard: 0 },
      4: { easy: 0.5, medium: 0.5, hard: 0 },
      5: { easy: 0.2, medium: 0.8, hard: 0 },
      6: { easy: 0, medium: 1.0, hard: 0 },
      7: { easy: 0, medium: 0.8, hard: 0.2 },
      8: { easy: 0, medium: 0.5, hard: 0.5 },
      9: { easy: 0, medium: 0.2, hard: 0.8 },
      10: { easy: 0, medium: 0, hard: 1.0 },
    };

    const distribution = difficultyMap[difficultyLevel] || difficultyMap[6];

    // Calculate number of questions per difficulty
    const easyCount = Math.round(limit * distribution.easy);
    const mediumCount = Math.round(limit * distribution.medium);
    const hardCount = Math.round(limit * distribution.hard);

    // Build subject filter
    let subjectFilter = '';
    let queryParams = [gradeLevel];
    let paramIndex = 2;

    if (subjects.length > 0 && !subjects.includes('all')) {
      subjectFilter = `AND subject = ANY($${paramIndex}::text[])`;
      queryParams.push(subjects);
      paramIndex++;
    }

    // Fetch questions by difficulty
    const questions = [];

    // Easy questions
    if (easyCount > 0) {
      const easyResult = await db.query(`
        SELECT id, question_text, options_json, correct_answer, subject, topic, grade_level, difficulty
        FROM questions
        WHERE grade_level = $1 ${subjectFilter} AND difficulty IN (1, 2, 3)
        ORDER BY RANDOM()
        LIMIT $${paramIndex}
      `, [...queryParams, easyCount]);
      questions.push(...easyResult.rows);
    }

    // Medium questions
    if (mediumCount > 0) {
      const mediumResult = await db.query(`
        SELECT id, question_text, options_json, correct_answer, subject, topic, grade_level, difficulty
        FROM questions
        WHERE grade_level = $1 ${subjectFilter} AND difficulty IN (4, 5, 6, 7)
        ORDER BY RANDOM()
        LIMIT $${paramIndex}
      `, [...queryParams, mediumCount]);
      questions.push(...mediumResult.rows);
    }

    // Hard questions
    if (hardCount > 0) {
      const hardResult = await db.query(`
        SELECT id, question_text, options_json, correct_answer, subject, topic, grade_level, difficulty
        FROM questions
        WHERE grade_level = $1 ${subjectFilter} AND difficulty IN (8, 9, 10)
        ORDER BY RANDOM()
        LIMIT $${paramIndex}
      `, [...queryParams, hardCount]);
      questions.push(...hardResult.rows);
    }

    // Shuffle questions to mix difficulties
    const shuffled = questions.sort(() => Math.random() - 0.5);

    // Return exactly the requested limit (or what we have)
    return shuffled.slice(0, limit);
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy chi tiết câu hỏi theo danh sách IDs
 * @param {Array<number>} questionIds - Mảng IDs của câu hỏi
 * @returns {Promise<Array>} Danh sách câu hỏi chi tiết
 */
const getQuestionsByIds = async (questionIds) => {
  try {
    if (!questionIds || questionIds.length === 0) {
      return [];
    }

    const result = await db.query(`
      SELECT
        id,
        question_text,
        options_json,
        correct_answer,
        subject,
        topic,
        explanation,
        grade_level
      FROM questions
      WHERE id = ANY($1::int[])
    `, [questionIds]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Lưu kết quả challenge test
 * @param {Object} data - { userId, gradeLevel, correctAnswers, totalQuestions, score, timeTaken }
 * @returns {Promise<Object>} Challenge test result object
 */
const saveChallengeResult = async ({ userId, gradeLevel, correctAnswers, totalQuestions, score, timeTaken }) => {
  try {
    const result = await db.query(`
      INSERT INTO challenge_tests (user_id, grade_level, correct_answers, total_questions, score, time_taken, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
    `, [userId, gradeLevel, correctAnswers, totalQuestions, score, timeTaken]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Lưu chi tiết câu trả lời của challenge test
 * @param {Object} data - { testId, questionId, userAnswer, correctAnswer, isCorrect }
 * @returns {Promise<void>}
 */
const saveChallengeAnswer = async ({ testId, questionId, userAnswer, correctAnswer, isCorrect }) => {
  try {
    await db.query(`
      INSERT INTO challenge_answers (test_id, question_id, user_answer, correct_answer, is_correct)
      VALUES ($1, $2, $3, $4, $5)
    `, [testId, questionId, userAnswer, correctAnswer, isCorrect]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllGames,
  getGameById,
  getGameQuestions,
  createAttempt,
  saveAttemptAnswer,
  getUserAttempts,
  getChallengeQuestions,
  getChallengeQuestionsWithFilters,
  getQuestionsByIds,
  saveChallengeResult,
  saveChallengeAnswer,
};
