const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký user mới
 * @access  Public
 * @body    { username, email, password, fullName?, role? }
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập và nhận JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private (Cần token)
 * @header  Authorization: Bearer <token>
 */
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
