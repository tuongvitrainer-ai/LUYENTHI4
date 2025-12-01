const db = require('../config/db');

/**
 * Cambridge English Questions Model
 * Handles queries for cambridge_questions table
 */

/**
 * Get random Cambridge English questions with filters
 * @param {Object} filters - { gradeLevel, topic, limit }
 * @returns {Array} Array of questions
 */
const getCambridgeQuestions = async (filters = {}) => {
  try {
    const {
      gradeLevel = 'movers',
      topic = null,
      limit = 15
    } = filters;

    let query = `
      SELECT
        id,
        question_text,
        options_json,
        correct_answer,
        explanation,
        picture,
        subject,
        topic,
        grade_level
      FROM cambridge_questions
      WHERE is_active = TRUE
        AND grade_level = $1
    `;

    const params = [gradeLevel];

    // Add topic filter if provided
    if (topic) {
      query += ` AND topic = $${params.length + 1}`;
      params.push(topic);
    }

    // Random order and limit
    query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting cambridge questions:', error);
    throw error;
  }
};

/**
 * Get all topics for a specific grade level
 * @param {String} gradeLevel - movers, flyers, starters
 * @returns {Array} Array of unique topics
 */
const getCambridgeTopics = async (gradeLevel = 'movers') => {
  try {
    const query = `
      SELECT DISTINCT topic
      FROM cambridge_questions
      WHERE is_active = TRUE
        AND grade_level = $1
      ORDER BY topic
    `;

    const result = await db.query(query, [gradeLevel]);
    return result.rows.map(row => row.topic);
  } catch (error) {
    console.error('Error getting cambridge topics:', error);
    throw error;
  }
};

/**
 * Get question by ID
 * @param {Number} id - Question ID
 * @returns {Object} Question object
 */
const getCambridgeQuestionById = async (id) => {
  try {
    const query = `
      SELECT *
      FROM cambridge_questions
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting cambridge question by id:', error);
    throw error;
  }
};

/**
 * Get total count of questions
 * @param {String} gradeLevel - movers, flyers, starters
 * @param {String} topic - optional topic filter
 * @returns {Number} Total count
 */
const getCambridgeQuestionsCount = async (gradeLevel = 'movers', topic = null) => {
  try {
    let query = `
      SELECT COUNT(*) as count
      FROM cambridge_questions
      WHERE is_active = TRUE
        AND grade_level = $1
    `;

    const params = [gradeLevel];

    if (topic) {
      query += ` AND topic = $2`;
      params.push(topic);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting cambridge questions count:', error);
    throw error;
  }
};

/**
 * Add new Cambridge question
 * @param {Object} questionData - Question data
 * @returns {Object} Created question
 */
const addCambridgeQuestion = async (questionData) => {
  try {
    const {
      question_text,
      options_json,
      correct_answer,
      explanation,
      picture = false,
      subject = 'english',
      topic,
      grade_level = 'movers',
      created_by = null
    } = questionData;

    const query = `
      INSERT INTO cambridge_questions (
        question_text,
        options_json,
        correct_answer,
        explanation,
        picture,
        subject,
        topic,
        grade_level,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      question_text,
      JSON.stringify(options_json),
      correct_answer,
      explanation,
      picture,
      subject,
      topic,
      grade_level,
      created_by
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding cambridge question:', error);
    throw error;
  }
};

/**
 * Update Cambridge question
 * @param {Number} id - Question ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated question
 */
const updateCambridgeQuestion = async (id, updates) => {
  try {
    const allowedFields = [
      'question_text',
      'options_json',
      'correct_answer',
      'explanation',
      'picture',
      'topic',
      'grade_level',
      'is_active'
    ];

    const setClause = [];
    const params = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        params.push(updates[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);

    const query = `
      UPDATE cambridge_questions
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, params);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating cambridge question:', error);
    throw error;
  }
};

/**
 * Delete (soft delete) Cambridge question
 * @param {Number} id - Question ID
 * @returns {Boolean} Success status
 */
const deleteCambridgeQuestion = async (id) => {
  try {
    const query = `
      UPDATE cambridge_questions
      SET is_active = FALSE
      WHERE id = $1
      RETURNING id
    `;

    const result = await db.query(query, [id]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting cambridge question:', error);
    throw error;
  }
};

module.exports = {
  getCambridgeQuestions,
  getCambridgeTopics,
  getCambridgeQuestionById,
  getCambridgeQuestionsCount,
  addCambridgeQuestion,
  updateCambridgeQuestion,
  deleteCambridgeQuestion
};
