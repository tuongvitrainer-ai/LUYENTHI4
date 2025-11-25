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
 * Tìm user theo ID (bao gồm wallet)
 * @param {number} id
 * @returns {Promise<Object|null>} User object hoặc null nếu không tìm thấy
 */
const findById = async (id) => {
  try {
    const result = await db.query(
      `SELECT
        u.id, u.username, u.email, u.full_name, u.role, u.avatar_url,
        u.created_at, u.updated_at,
        COALESCE(w.coins, 0) as coins,
        COALESCE(w.stars, 0) as stars,
        COALESCE(w.accumulated_points, 0) as accumulated_points
      FROM users u
      LEFT JOIN user_wallets w ON u.id = w.user_id
      WHERE u.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo user mới (và wallet mặc định)
 * @param {Object} userData - { username, email, passwordHash, role, fullName }
 * @returns {Promise<Object>} User object vừa tạo (không bao gồm password_hash)
 */
const createUser = async ({ username, email, passwordHash, role = 'student', fullName }) => {
  try {
    // Tạo user
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, full_name, role, avatar_url, created_at, updated_at`,
      [username, email, passwordHash, role, fullName]
    );

    const newUser = result.rows[0];

    // Tạo wallet mặc định cho user (coins=0, stars=0, accumulated_points=0)
    await db.query(
      `INSERT INTO user_wallets (user_id, coins, stars, accumulated_points)
       VALUES ($1, 0, 0, 0)
       ON CONFLICT (user_id) DO NOTHING`,
      [newUser.id]
    );

    return newUser;
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
