const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/db'); // Test DB connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Bảo mật header
app.use(cors());   // Cho phép Frontend gọi API
app.use(morgan('dev')); // Log request
app.use(express.json()); // Parse JSON body

// Routes (Ví dụ)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Luyen Thi API 🚀' });
});

// Test DB Route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connection successful', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});