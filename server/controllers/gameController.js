const gameModel = require('../models/gameModel');

/**
 * Lấy danh sách tất cả games/exams
 * GET /api/games
 * Access: Public (optionalAuth)
 */
const getAllGames = async (req, res) => {
  try {
    const games = await gameModel.getAllGames();

    return res.status(200).json({
      success: true,
      count: games.length,
      games,
      user: req.user ? { id: req.user.id, username: req.user.email } : null,
    });
  } catch (error) {
    console.error('Get all games error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách games',
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết một game/exam theo ID (bao gồm câu hỏi)
 * GET /api/games/:id
 * Access: Public (optionalAuth)
 */
const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin exam
    const game = await gameModel.getGameById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy game',
      });
    }

    // Lấy danh sách câu hỏi
    const questions = await gameModel.getGameQuestions(id);

    // Nếu user đã đăng nhập, lấy lịch sử attempts của user
    let userAttempts = [];
    if (req.user) {
      userAttempts = await gameModel.getUserAttempts(req.user.id, id);
    }

    return res.status(200).json({
      success: true,
      game: {
        ...game,
        questions,
        totalQuestions: questions.length,
      },
      userAttempts,
      isAuthenticated: !!req.user,
    });
  } catch (error) {
    console.error('Get game by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết game',
      error: error.message,
    });
  }
};

/**
 * Nộp kết quả game/exam
 * POST /api/games/:id/submit
 * Access: Private (verifyToken - Bắt buộc đăng nhập)
 * Body: { answers: [{ questionId, userAnswer }], score }
 */
const submitGameResult = async (req, res) => {
  try {
    const { id: examId } = req.params;
    const { answers, score } = req.body;
    const userId = req.user.id; // req.user được set bởi verifyToken

    // Validate input
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu answers không hợp lệ',
      });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: 'Điểm số không được để trống',
      });
    }

    // Kiểm tra exam có tồn tại không
    const game = await gameModel.getGameById(examId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy game',
      });
    }

    // Lưu attempt vào database
    const attempt = await gameModel.createAttempt({
      userId,
      examId,
      score,
    });

    // Lưu chi tiết từng câu trả lời
    for (const answer of answers) {
      await gameModel.saveAttemptAnswer({
        attemptId: attempt.id,
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Nộp bài thành công',
      attempt: {
        id: attempt.id,
        score: attempt.score,
        completedAt: attempt.completed_at,
      },
    });
  } catch (error) {
    console.error('Submit game result error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi nộp bài',
      error: error.message,
    });
  }
};

/**
 * Lấy câu hỏi cho game "Thử Thách Khởi Đầu"
 * GET /api/games/challenge/:gradeLevel
 * Access: Public
 * Query params: ?limit=15
 */
const getChallengeQuestions = async (req, res) => {
  try {
    const { gradeLevel } = req.params;
    const limit = parseInt(req.query.limit) || 15;

    // Validate grade level
    if (![3, 4, 5].includes(parseInt(gradeLevel))) {
      return res.status(400).json({
        success: false,
        message: 'Grade level phải là 3, 4 hoặc 5',
      });
    }

    // Lấy câu hỏi từ database
    const questionsFromDB = await gameModel.getChallengeQuestions(parseInt(gradeLevel), limit);

    // Transform data: parse options_json và tìm correctAnswerIndex
    const questions = questionsFromDB.map(q => {
      // Parse options_json từ string thành array
      let options = [];
      try {
        options = typeof q.options_json === 'string'
          ? JSON.parse(q.options_json)
          : q.options_json;
      } catch (err) {
        console.error(`Error parsing options_json for question ${q.id}:`, err);
        options = [];
      }

      // Tìm index của correct_answer trong mảng options
      const correctAnswerIndex = options.findIndex(opt => opt === q.correct_answer);

      return {
        id: q.id,
        question: q.question_text,
        options: options,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0, // Fallback to 0 if not found
        subject: q.subject,
        topic: q.topic,
      };
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      gradeLevel: parseInt(gradeLevel),
      questions,
    });
  } catch (error) {
    console.error('Get challenge questions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy câu hỏi',
      error: error.message,
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  submitGameResult,
  getChallengeQuestions, // Export function mới
};
