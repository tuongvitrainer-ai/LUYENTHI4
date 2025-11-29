const db = require('../config/db');

/**
 * POST /api/admin/lessons
 * Tạo bài học mới
 * Body: { chapter_id, title, description, thumbnail_url, is_free, order }
 */
const createLesson = async (req, res) => {
  try {
    const { chapter_id, title, description, thumbnail_url, is_free, order } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề bài học là bắt buộc',
      });
    }

    // Kiểm tra chapter_id có tồn tại không (nếu có)
    if (chapter_id) {
      const checkChapter = await db.query('SELECT * FROM chapters WHERE id = $1', [chapter_id]);
      if (checkChapter.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chapter với ID này',
        });
      }
    }

    // Tạo lesson mới
    const result = await db.query(
      `INSERT INTO lessons (chapter_id, title, description, thumbnail_url, is_free, "order")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        chapter_id || null,
        title,
        description || null,
        thumbnail_url || null,
        is_free || false,
        order || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Tạo bài học thành công',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in createLesson:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo bài học',
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/lessons/:id
 * Sửa bài học
 * Body: { chapter_id, title, description, thumbnail_url, is_free, order } (tất cả đều optional)
 */
const updateLesson = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { chapter_id, title, description, thumbnail_url, is_free, order } = req.body;

    // Kiểm tra lesson có tồn tại không
    const checkLesson = await db.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (checkLesson.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học',
      });
    }

    // Kiểm tra chapter_id có tồn tại không (nếu có trong body)
    if (chapter_id) {
      const checkChapter = await db.query('SELECT * FROM chapters WHERE id = $1', [chapter_id]);
      if (checkChapter.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chapter với ID này',
        });
      }
    }

    // Xây dựng câu lệnh UPDATE động
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (chapter_id !== undefined) {
      updates.push(`chapter_id = $${paramCount}`);
      values.push(chapter_id);
      paramCount++;
    }

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (thumbnail_url !== undefined) {
      updates.push(`thumbnail_url = $${paramCount}`);
      values.push(thumbnail_url);
      paramCount++;
    }

    if (is_free !== undefined) {
      updates.push(`is_free = $${paramCount}`);
      values.push(is_free);
      paramCount++;
    }

    if (order !== undefined) {
      updates.push(`"order" = $${paramCount}`);
      values.push(order);
      paramCount++;
    }

    // Nếu không có gì để update
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có thông tin nào để cập nhật',
      });
    }

    // Thêm lessonId vào cuối mảng values
    values.push(lessonId);

    // Thực hiện UPDATE
    const updateQuery = `
      UPDATE lessons
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật bài học thành công',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in updateLesson:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật bài học',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/lessons/:id
 * Xóa bài học
 * Lưu ý: Xóa lesson sẽ xóa cascade các lesson_contents liên quan (nếu có foreign key ON DELETE CASCADE)
 */
const deleteLesson = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);

    // Kiểm tra lesson có tồn tại không
    const checkLesson = await db.query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    if (checkLesson.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học',
      });
    }

    // Xóa lesson_contents liên quan trước (nếu không có CASCADE)
    await db.query('DELETE FROM lesson_contents WHERE lesson_id = $1', [lessonId]);

    // Xóa lesson
    const result = await db.query('DELETE FROM lessons WHERE id = $1 RETURNING *', [lessonId]);

    return res.status(200).json({
      success: true,
      message: 'Xóa bài học thành công',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteLesson:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bài học',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/lessons
 * Lấy danh sách tất cả lessons (có phân trang)
 * Query params: page (default 1), limit (default 10)
 */
const getAllLessons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Lấy tổng số lessons
    const countResult = await db.query('SELECT COUNT(*) FROM lessons');
    const totalLessons = parseInt(countResult.rows[0].count);

    // Lấy danh sách lessons với thông tin chapter
    const result = await db.query(
      `SELECT
        l.*,
        c.title as chapter_title,
        s.name as subject_name,
        g.name as grade_name
      FROM lessons l
      LEFT JOIN chapters c ON l.chapter_id = c.id
      LEFT JOIN subjects s ON c.subject_id = s.id
      LEFT JOIN grades g ON s.grade_id = g.id
      ORDER BY l."order" ASC, l.id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách lessons thành công',
      data: {
        lessons: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLessons / limit),
          totalLessons: totalLessons,
          limit: limit,
        },
      },
    });
  } catch (error) {
    console.error('Error in getAllLessons:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách lessons',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/lessons/:id
 * Lấy chi tiết một lesson (bao gồm lesson_contents)
 */
const getLessonById = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);

    // Lấy thông tin lesson
    const lessonResult = await db.query(
      `SELECT
        l.*,
        c.title as chapter_title,
        s.name as subject_name,
        g.name as grade_name
      FROM lessons l
      LEFT JOIN chapters c ON l.chapter_id = c.id
      LEFT JOIN subjects s ON c.subject_id = s.id
      LEFT JOIN grades g ON s.grade_id = g.id
      WHERE l.id = $1`,
      [lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học',
      });
    }

    // Lấy lesson_contents
    const contentsResult = await db.query(
      'SELECT * FROM lesson_contents WHERE lesson_id = $1 ORDER BY "order" ASC',
      [lessonId]
    );

    const lesson = lessonResult.rows[0];
    lesson.contents = contentsResult.rows;

    return res.status(200).json({
      success: true,
      message: 'Lấy chi tiết lesson thành công',
      data: lesson,
    });
  } catch (error) {
    console.error('Error in getLessonById:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết lesson',
      error: error.message,
    });
  }
};

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
};
