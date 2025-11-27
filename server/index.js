const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/db'); // Test DB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const gameRoutes = require('./routes/gameRoutes'); // Game routes
const adminRoutes = require('./routes/adminRoutes'); // Admin routes

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

// Auth Routes
app.use('/api/auth', authRoutes);

// Game Routes (Support Public Play)
app.use('/api/games', gameRoutes);

// Admin Routes (Protected by verifyToken & checkRole(['admin']))
app.use('/api/admin', adminRoutes);

// Challenge Routes (Game "Thử Thách Khởi Đầu")
const gameController = require('./controllers/gameController');
app.post('/api/challenge/submit', gameController.submitChallenge);

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

// Hàm kiểm tra kết nối Database
const testDatabaseConnection = async () => {
  try {
    const result = await db.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Connected to PostgreSQL');
    console.log(`   Database Version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
    console.log(`   Current Time: ${result.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL');
    console.error('   Error:', error.message);
    return false;
  }
};

// Khởi động Server
const startServer = async () => {
  // Kiểm tra kết nối Database trước
  const isDbConnected = await testDatabaseConnection();

  if (!isDbConnected) {
    console.error('⚠️  Server starting without database connection. Please check your database configuration.');
  }

  // Start Server
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
};

// Gọi hàm khởi động
startServer();