const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực JWT token
 * Kiểm tra header Authorization: Bearer <token>
 * Nếu token hợp lệ -> gán req.user = decoded_data và next()
 * Nếu sai -> trả về 401 Unauthorized
 */
const verifyToken = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp. Vui lòng đăng nhập.',
      });
    }

    // Extract token từ "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    );

    // Gán thông tin user vào req.user
    req.user = decoded;

    // Tiếp tục xử lý request
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    // Phân biệt các loại lỗi
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.',
      });
    }

    // Lỗi khác
    return res.status(401).json({
      success: false,
      message: 'Xác thực thất bại',
      error: error.message,
    });
  }
};

/**
 * Middleware xác thực JWT token (Optional)
 * Nếu có token -> Xác thực như bình thường và gán req.user
 * Nếu KHÔNG có token -> Vẫn cho qua (next()), nhưng req.user = null
 * Dùng cho các API public mà vẫn muốn biết user là ai (nếu đã login)
 */
const optionalAuth = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;

    // Nếu không có token -> req.user = null và cho qua
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    // Extract token từ "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    );

    // Gán thông tin user vào req.user
    req.user = decoded;

    // Tiếp tục xử lý request
    next();
  } catch (error) {
    // Nếu token không hợp lệ hoặc hết hạn -> req.user = null và cho qua
    console.error('Optional auth - Invalid token:', error.message);
    req.user = null;
    next();
  }
};

/**
 * Middleware kiểm tra role của user
 * Sử dụng sau verifyToken
 * @param {Array<string>} allowedRoles - Danh sách các role được phép truy cập
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user đã được set bởi verifyToken
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập tài nguyên này',
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra quyền truy cập',
        error: error.message,
      });
    }
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  checkRole,
};
