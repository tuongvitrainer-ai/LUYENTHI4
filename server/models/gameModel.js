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

module.exports = {
  getAllGames,
  getGameById,
  getGameQuestions,
  createAttempt,
  saveAttemptAnswer,
  getUserAttempts,
};
