const db = require('../config/db');

/**
 * Tìm user theo email
 * @param {string} email
 * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
 */
const findByEmail = async (email) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Tìm user theo username
 * @param {string} username
 * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
 */
const findByUsername = async (username) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Tìm user theo ID
 * @param {number} id
 * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
 */
const findById = async (id) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, full_name, role, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo user mới
 * @param {Object} userData - { username, email, passwordHash, role, fullName }
 * @returns {Promise<Object>} User object vừa tạo (không bao gồm password_hash)
 */
const createUser = async ({ username, email, passwordHash, role = 'student', fullName }) => {
  try {
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, full_name, role, avatar_url, created_at, updated_at`,
      [username, email, passwordHash, role, fullName]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
};
