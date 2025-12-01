const gameModel = require('../models/gameModel');
const cambridgeModel = require('../models/cambridgeModel');

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
 * Query params: ?limit=15&subjects=Toán học,Tiếng Việt&difficultyLevel=6
 */
const getChallengeQuestions = async (req, res) => {
  try {
    const { gradeLevel } = req.params;
    const limit = parseInt(req.query.limit) || 15;
    const difficultyLevel = parseInt(req.query.difficultyLevel) || 6;

    // Parse subjects from query string
    let subjects = [];
    if (req.query.subjects) {
      subjects = typeof req.query.subjects === 'string'
        ? req.query.subjects.split(',').map(s => s.trim())
        : req.query.subjects;
    }

    // Validate grade level
    if (![3, 4, 5].includes(parseInt(gradeLevel))) {
      return res.status(400).json({
        success: false,
        message: 'Grade level phải là 3, 4 hoặc 5',
      });
    }

    // Validate difficulty level
    if (difficultyLevel < 1 || difficultyLevel > 10) {
      return res.status(400).json({
        success: false,
        message: 'Difficulty level phải từ 1 đến 10',
      });
    }

    // Lấy câu hỏi từ database với filters
    const questionsFromDB = await gameModel.getChallengeQuestionsWithFilters({
      gradeLevel: parseInt(gradeLevel),
      subjects,
      difficultyLevel,
      limit
    });

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

/**
 * Nộp bài game "Thử Thách Khởi Đầu"
 * POST /api/challenge/submit
 * Access: Public (không yêu cầu auth)
 * Body: { user_id, grade_level, answers: [{ question_id, user_answer }], time_taken }
 */
const submitChallenge = async (req, res) => {
  try {
    const { user_id, grade_level, answers, time_taken } = req.body;

    // Validate input
    if (!user_id || !grade_level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (user_id, grade_level, answers)',
      });
    }

    if (![3, 4, 5].includes(parseInt(grade_level))) {
      return res.status(400).json({
        success: false,
        message: 'Grade level phải là 3, 4 hoặc 5',
      });
    }

    // Lấy chi tiết câu hỏi từ database
    const questionIds = answers.map(a => a.question_id);
    const questionsFromDB = await gameModel.getQuestionsByIds(questionIds);

    if (questionsFromDB.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }

    // Tạo map để dễ dàng tra cứu
    const questionMap = {};
    questionsFromDB.forEach(q => {
      // Parse options_json
      let options = [];
      try {
        options = typeof q.options_json === 'string'
          ? JSON.parse(q.options_json)
          : q.options_json;
      } catch (err) {
        console.error(`Error parsing options_json for question ${q.id}:`, err);
        options = [];
      }

      questionMap[q.id] = {
        ...q,
        options: options
      };
    });

    // Tính điểm và tạo review_questions
    let correctCount = 0;
    const subjectScores = {};
    const reviewQuestions = [];

    answers.forEach(answer => {
      const question = questionMap[answer.question_id];
      if (!question) return;

      const userAnswerText = answer.user_answer;
      const correctAnswerText = question.correct_answer;
      const isCorrect = userAnswerText === correctAnswerText;

      if (isCorrect) {
        correctCount++;
      }

      // Đếm điểm theo môn
      if (!subjectScores[question.subject]) {
        subjectScores[question.subject] = { correct: 0, total: 0 };
      }
      subjectScores[question.subject].total++;
      if (isCorrect) {
        subjectScores[question.subject].correct++;
      }

      // Thêm vào review_questions
      reviewQuestions.push({
        question_id: question.id,
        question_text: question.question_text,
        options: question.options,
        user_answer: userAnswerText,
        correct_answer: correctAnswerText,
        is_correct: isCorrect,
        explanation: question.explanation || 'Chưa có giải thích',
        subject: question.subject,
        topic: question.topic,
      });
    });

    const totalQuestions = answers.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Tính số sao dựa trên điểm
    let starsEarned = 0;
    if (scorePercentage >= 90) starsEarned = 3;
    else if (scorePercentage >= 70) starsEarned = 2;
    else if (scorePercentage >= 50) starsEarned = 1;

    // Lưu kết quả vào database
    const testResult = await gameModel.saveChallengeResult({
      userId: user_id,
      gradeLevel: grade_level,
      correctAnswers: correctCount,
      totalQuestions: totalQuestions,
      score: scorePercentage,
      timeTaken: time_taken || 0,
    });

    // Lưu chi tiết từng câu trả lời
    for (const reviewQuestion of reviewQuestions) {
      await gameModel.saveChallengeAnswer({
        testId: testResult.id,
        questionId: reviewQuestion.question_id,
        userAnswer: reviewQuestion.user_answer,
        correctAnswer: reviewQuestion.correct_answer,
        isCorrect: reviewQuestion.is_correct,
      });
    }

    // Trả về kết quả với review_questions
    return res.status(200).json({
      success: true,
      message: 'Nộp bài thành công',
      data: {
        test_id: testResult.id,
        correct_answers: correctCount,
        total_questions: totalQuestions,
        score: scorePercentage,
        stars_earned: starsEarned,
        time_taken: time_taken || 0,
        subject_scores: subjectScores,
        review_questions: reviewQuestions, // Trả về mảng review_questions đầy đủ
      },
    });
  } catch (error) {
    console.error('Submit challenge error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi nộp bài',
      error: error.message,
    });
  }
};

/**
 * Lấy câu hỏi cho game "Vocabulary Movers" với instant feedback
 * GET /api/games/vocabulary-movers
 * Access: Public
 * Query params: ?limit=15&gradeLevel=movers&topic=Family%20%26%20Friends
 */
const getVocabularyMoversQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const gradeLevel = req.query.gradeLevel || 'movers'; // movers, flyers, starters
    const topic = req.query.topic || null;

    // Validate grade level
    const validLevels = ['movers', 'flyers', 'starters'];
    if (!validLevels.includes(gradeLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Grade level phải là movers, flyers, hoặc starters',
      });
    }

    // Lấy câu hỏi từ cambridge_questions table
    const questionsFromDB = await cambridgeModel.getCambridgeQuestions({
      gradeLevel,
      topic,
      limit
    });

    // Transform data: parse options_json nếu cần
    const questions = questionsFromDB.map(q => {
      // Parse options_json từ string/jsonb thành array
      let options = [];
      try {
        options = typeof q.options_json === 'string'
          ? JSON.parse(q.options_json)
          : q.options_json;
      } catch (err) {
        console.error(`Error parsing options_json for question ${q.id}:`, err);
        options = [];
      }

      return {
        id: q.id,
        question: q.question_text,
        options: options,
        correctAnswer: q.correct_answer, // Return as TEXT for instant feedback
        explanation: q.explanation,
        subject: q.subject,
        topic: q.topic,
        gradeLevel: q.grade_level,
        picture: q.picture
      };
    });

    // Get total available questions count
    const totalAvailable = await cambridgeModel.getCambridgeQuestionsCount(gradeLevel, topic);

    return res.status(200).json({
      success: true,
      count: questions.length,
      totalAvailable,
      gradeLevel,
      topic,
      questions,
    });
  } catch (error) {
    console.error('Get vocabulary movers questions error:', error);
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
  getChallengeQuestions,
  submitChallenge,
  getVocabularyMoversQuestions,
};
