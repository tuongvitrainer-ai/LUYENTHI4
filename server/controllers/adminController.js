const db = require('../config/db');

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả người dùng (có phân trang)
 * Query params: page (default 1), limit (default 10)
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Lấy tổng số users
    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(countResult.rows[0].count);

    // Lấy danh sách users với phân trang
    const result = await db.query(
      `SELECT
        u.id, u.username, u.email, u.full_name, u.role, u.avatar_url,
        u.created_at, u.updated_at,
        COALESCE(w.coins, 0) as coins,
        COALESCE(w.stars, 0) as stars,
        COALESCE(w.accumulated_points, 0) as accumulated_points
      FROM users u
      LEFT JOIN user_wallets w ON u.id = w.user_id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách users thành công',
      data: {
        users: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers: totalUsers,
          limit: limit,
        },
      },
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách users',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/users/:id
 * Sửa thông tin user (đổi Role, cập nhật thông tin)
 * Body: { role, full_name, avatar_url } (tất cả đều optional)
 */
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role, full_name, avatar_url } = req.body;

    // Kiểm tra user có tồn tại không
    const checkUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }

    // Xây dựng câu lệnh UPDATE động
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (role !== undefined) {
      // Validate role
      const validRoles = ['admin', 'teacher', 'parent', 'student'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Role không hợp lệ. Chỉ chấp nhận: ${validRoles.join(', ')}`,
        });
      }
      updates.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (full_name !== undefined) {
      updates.push(`full_name = $${paramCount}`);
      values.push(full_name);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount}`);
      values.push(avatar_url);
      paramCount++;
    }

    // Nếu không có gì để update
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có thông tin nào để cập nhật',
      });
    }

    // Thêm updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Thêm userId vào cuối mảng values
    values.push(userId);

    // Thực hiện UPDATE
    const updateQuery = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, full_name, role, avatar_url, created_at, updated_at
    `;

    const result = await db.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật user',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Xóa user (soft delete hoặc hard delete)
 * Lưu ý: Xóa user sẽ ảnh hưởng đến các bảng liên quan (exam_attempts, user_wallets, etc.)
 */
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Kiểm tra user có tồn tại không
    const checkUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }

    // Kiểm tra không được xóa chính mình (admin đang login)
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể xóa chính tài khoản của mình',
      });
    }

    // Hard delete user (và các dữ liệu liên quan sẽ bị ảnh hưởng)
    // Nếu muốn soft delete, có thể thêm column is_active hoặc deleted_at
    await db.query('DELETE FROM user_wallets WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM exam_attempts WHERE user_id = $1)', [userId]);
    await db.query('DELETE FROM exam_attempts WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM parent_student WHERE parent_id = $1 OR student_id = $1', [userId]);

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email', [userId]);

    return res.status(200).json({
      success: true,
      message: 'Xóa user thành công',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa user',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
