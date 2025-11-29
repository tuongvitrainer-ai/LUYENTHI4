const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const lessonController = require('../controllers/lessonController');

/**
 * ADMIN ROUTES
 * Tất cả routes dưới đây đều yêu cầu:
 * 1. verifyToken: Đã đăng nhập
 * 2. checkRole(['admin']): Có role admin
 */

// ============== USER MANAGEMENT API ==============
// GET /api/admin/users - Lấy danh sách tất cả users (có phân trang)
router.get('/users', verifyToken, checkRole(['admin']), adminController.getAllUsers);

// PUT /api/admin/users/:id - Sửa thông tin user (đổi Role, cập nhật thông tin)
router.put('/users/:id', verifyToken, checkRole(['admin']), adminController.updateUser);

// DELETE /api/admin/users/:id - Xóa user
router.delete('/users/:id', verifyToken, checkRole(['admin']), adminController.deleteUser);

// ============== LESSON MANAGEMENT API ==============
// GET /api/admin/lessons - Lấy danh sách tất cả lessons (có phân trang)
router.get('/lessons', verifyToken, checkRole(['admin']), lessonController.getAllLessons);

// GET /api/admin/lessons/:id - Lấy chi tiết một lesson
router.get('/lessons/:id', verifyToken, checkRole(['admin']), lessonController.getLessonById);

// POST /api/admin/lessons - Tạo bài học mới
router.post('/lessons', verifyToken, checkRole(['admin']), lessonController.createLesson);

// PUT /api/admin/lessons/:id - Sửa bài học
router.put('/lessons/:id', verifyToken, checkRole(['admin']), lessonController.updateLesson);

// DELETE /api/admin/lessons/:id - Xóa bài học
router.delete('/lessons/:id', verifyToken, checkRole(['admin']), lessonController.deleteLesson);

module.exports = router;
