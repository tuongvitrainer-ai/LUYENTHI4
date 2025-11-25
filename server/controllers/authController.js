const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * Đăng ký user mới
 * POST /api/auth/register
 * Body: { username, email, password, fullName?, role? }
 */
const register = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email và password không được để trống',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password phải có ít nhất 6 ký tự',
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng',
      });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username đã được sử dụng',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await userModel.createUser({
      username,
      email,
      passwordHash,
      role: role || 'student',
      fullName: fullName || null,
    });

    // Trả về thông báo thành công (không trả token, bắt user đăng nhập lại)
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng đăng nhập.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message,
    });
  }
};

/**
 * Đăng nhập
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password không được để trống',
      });
    }

    // Tìm user theo email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng',
      });
    }

    // So sánh password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng',
      });
    }

    // Lấy full user data (bao gồm wallet) bằng findById
    const fullUser = await userModel.findById(user.id);

    // Tạo JWT token (expires in 7 days)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
      { expiresIn: '7d' }
    );

    // Trả về token và thông tin user (bao gồm wallet)
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        role: fullUser.role,
        fullName: fullUser.full_name,
        avatarUrl: fullUser.avatar_url,
        wallet: {
          coins: parseInt(fullUser.coins) || 0,
          stars: parseInt(fullUser.stars) || 0,
          accumulatedPoints: parseInt(fullUser.accumulated_points) || 0,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message,
    });
  }
};

/**
 * Lấy thông tin user hiện tại (từ token)
 * GET /api/auth/me
 * Headers: Authorization: Bearer <token>
 */
const getMe = async (req, res) => {
  try {
    // req.user đã được set bởi middleware verifyToken
    const userId = req.user.id;

    // Tìm user theo ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }

    // Trả về thông tin user (không bao gồm password) + wallet
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        wallet: {
          coins: parseInt(user.coins) || 0,
          stars: parseInt(user.stars) || 0,
          accumulatedPoints: parseInt(user.accumulated_points) || 0,
        },
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
