const { Pool } = require('pg');
require('dotenv').config();

// Tạo kết nối Pool (tốt cho hiệu năng khi có nhiều user)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('🛢️  Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌  Unexpected error on idle client', err);
  process.exit(-1);
});

// Hàm helper để query
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};