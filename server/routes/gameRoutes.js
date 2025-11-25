const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { verifyToken, optionalAuth } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/games
 * @desc    Lấy danh sách tất cả games/exams
 * @access  Public (optionalAuth - Không bắt buộc đăng nhập)
 */
router.get('/', optionalAuth, gameController.getAllGames);

/**
 * @route   GET /api/games/:id
 * @desc    Lấy chi tiết một game/exam (bao gồm câu hỏi)
 * @access  Public (optionalAuth - Không bắt buộc đăng nhập)
 */
router.get('/:id', optionalAuth, gameController.getGameById);

/**
 * @route   POST /api/games/:id/submit
 * @desc    Nộp kết quả game/exam
 * @access  Private (verifyToken - Bắt buộc đăng nhập)
 * @body    { answers: [{ questionId, userAnswer, isCorrect }], score }
 */
router.post('/:id/submit', verifyToken, gameController.submitGameResult);

module.exports = router;
