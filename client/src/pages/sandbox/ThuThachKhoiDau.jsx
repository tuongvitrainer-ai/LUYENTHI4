import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import GameButton from '@/components/ui/GameButton';
import GameCard from '@/components/ui/GameCard';
import useGameSound from '@/hooks/useGameSound';
import './ThuThachKhoiDau.css';

const SUBJECT_CONFIG = {
  math: { name: 'Toán học', icon: '🔢', color: '#87CEEB', total: 4 },
  vietnamese: { name: 'Tiếng Việt', icon: '📚', color: '#FF6B6B', total: 4 },
  english: { name: 'Tiếng Anh', icon: '🗣️', color: '#51CF66', total: 4 },
  logic: { name: 'Tư duy Logic', icon: '🤔', color: '#9775FA', total: 3 }
};

const ThuThachKhoiDau = () => {
  const [selectedLevel, setSelectedLevel] = useState(3); // Mặc định chọn lớp 3
  const [questionCount, setQuestionCount] = useState(15); // NEW: Số câu hỏi
  const [difficultyLevel, setDifficultyLevel] = useState(4); // NEW: Mức độ khó (1-10, mặc định 4)
  const [selectedSubjects, setSelectedSubjects] = useState(['all']); // NEW: Môn học đã chọn (mặc định: tất cả)
  const [showTest, setShowTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // API integration
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [reviewQuestions, setReviewQuestions] = useState([]); // NEW: Detailed review

  // Sound hook
  const { playClick, playCorrect, playWrong } = useGameSound();

  // Timer countdown
  useEffect(() => {
    if (showTest && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTest, showResults]);

  // Keyboard navigation - Press Enter to go to next question
  useEffect(() => {
    if (showTest && !showResults && !showConfirmDialog) {
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (currentQuestionIndex < questions.length - 1) {
            handleNextQuestion();
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [showTest, showResults, showConfirmDialog, currentQuestionIndex, questions.length]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleSubjectToggle = (subject) => {
    if (subject === 'all') {
      setSelectedSubjects(['all']);
    } else {
      setSelectedSubjects(prev => {
        const newSelection = prev.filter(s => s !== 'all');
        if (newSelection.includes(subject)) {
          const filtered = newSelection.filter(s => s !== subject);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newSelection, subject];
        }
      });
    }
  };

  const startTest = async () => {
    if (!selectedLevel) {
      alert('Vui lòng chọn lớp học!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call API to get questions
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE}/api/games/challenge/${selectedLevel}`, {
        params: {
          limit: questionCount
        }
      });

      if (response.data.success && response.data.questions.length > 0) {
        // API đã trả về data đúng format: { id, question, options, correctAnswer, subject, topic }
        setQuestions(response.data.questions);
        setShowTest(true);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeRemaining(30 * 60);
        setShowResults(false);
        setStartTime(Date.now());
        console.log(`✅ Loaded ${response.data.questions.length} questions from database`);
      } else {
        throw new Error('Không có câu hỏi nào');
      }
    } catch (err) {
      console.error('❌ Error fetching questions:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải câu hỏi');
      alert('Lỗi khi tải câu hỏi từ database. Vui lòng kiểm tra kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    playClick();
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < questions.length) {
      setShowConfirmDialog(true);
    } else {
      handleSubmit();
    }
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Prepare answers for API
      const answersArray = questions.map(q => {
        const answerIndex = userAnswers[q.id];
        const answerText = (answerIndex !== undefined && q.options && q.options[answerIndex])
          ? q.options[answerIndex]
          : '';

        console.log(`Question ${q.id}: User selected index ${answerIndex}, which is "${answerText}"`);

        return {
          question_id: q.id,
          user_answer: answerText
        };
      });

      const timeTaken = Math.floor((Date.now() - startTime) / 1000); // seconds

      console.log('📤 Submitting answers:', answersArray);

      // Submit to API
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/challenge/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // TODO: Get from auth context
          grade_level: selectedLevel,
          answers: answersArray,
          time_taken: timeTaken
        })
      });

      if (!response.ok) {
        throw new Error('Không thể nộp bài');
      }

      const data = await response.json();

      if (data.success) {
        // Use results from API
        const results = {
          score: data.data.correct_answers,
          total: data.data.total_questions,
          percentage: data.data.score,
          subjectScores: data.data.subject_scores,
          timeTaken: data.data.time_taken,
          starsEarned: data.data.stars_earned,
          testId: data.data.test_id
        };

        console.log('✅ Test submitted successfully:', results);
        console.log('📋 Review questions received:', data.data.review_questions);
        console.log('📊 Review questions count:', data.data.review_questions?.length || 0);

        // If backend doesn't return review_questions, create fallback from frontend
        let reviewData = data.data.review_questions;
        if (!reviewData || reviewData.length === 0) {
          console.warn('⚠️ Backend did not return review_questions, creating fallback...');
          reviewData = questions.map((q, index) => {
            const answerIndex = userAnswers[q.id];
            const userAnswerText = (answerIndex !== undefined && q.options)
              ? q.options[answerIndex]
              : '';

            // We don't know the correct answer from frontend, so mark as unknown
            return {
              question_id: q.id,
              question_text: q.question || q.question_text,
              options: q.options,
              user_answer: userAnswerText,
              correct_answer: 'N/A (chưa có từ backend)',
              is_correct: false, // Can't determine without backend
              explanation: 'Chưa có giải thích (backend chưa trả về dữ liệu)',
              subject: q.subject,
              topic: q.topic
            };
          });
        }

        setTestResults(results);
        setReviewQuestions(reviewData);
        setShowResults(true);
        setShowConfirmDialog(false);
      } else {
        throw new Error(data.message || 'Lỗi khi nộp bài');
      }
    } catch (err) {
      console.error('Error submitting test:', err);

      // Fallback: Calculate locally if API fails
      console.log('⚠️  Calculating results locally as fallback');

      let correctCount = 0;
      const subjectScores = {};

      questions.forEach((question) => {
        const userAnswerIndex = userAnswers[question.id];
        const userAnswerText = question.options[userAnswerIndex];

        // Can't verify correctness without API, so just count answered
        const isAnswered = userAnswerIndex !== undefined;

        if (!subjectScores[question.subject]) {
          subjectScores[question.subject] = { correct: 0, total: 0 };
        }
        subjectScores[question.subject].total++;
        if (isAnswered) subjectScores[question.subject].correct++; // Assume correct for fallback
      });

      correctCount = Object.keys(userAnswers).length;

      const results = {
        score: correctCount,
        total: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        subjectScores,
        timeTaken: 30 * 60 - timeRemaining,
        starsEarned: 0 // Unknown without API
      };

      setTestResults(results);
      setShowResults(true);
      setShowConfirmDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (questions.length === 0) return 'pending';
    const question = questions[index];
    if (!question) return 'pending';
    if (index === currentQuestionIndex) return 'current';
    if (userAnswers[question.id] !== undefined) return 'completed';
    return 'pending';
  };

  const getSubjectProgress = (subject) => {
    if (questions.length === 0) return { answered: 0, total: 0 };

    const subjectQuestions = questions.filter(q => q.subject === subject);
    const answered = subjectQuestions.filter(q => userAnswers[q.id] !== undefined).length;
    return { answered, total: subjectQuestions.length };
  };

  const getGridColumns = () => {
    const count = questions.length;
    if (count <= 15) return 3;  // 3 cột: tối đa 5 dòng
    if (count <= 24) return 4;  // 4 cột: tối đa 6 dòng
    if (count <= 30) return 5;  // 5 cột: tối đa 6 dòng
    return 6;                    // 6 cột: 45 câu = 7.5 dòng ~ 8 dòng
  };

  const getGridGap = () => {
    const count = questions.length;
    if (count <= 15) return '8px';
    if (count <= 24) return '6px';
    if (count <= 30) return '5px';
    return '4px'; // 45 questions - gap rất nhỏ
  };

  // Màn hình chọn cấp độ
  if (!showTest) {
    return (
      <div className="thu-thach-khoi-dau">
        <div className="game-container">
          {/* Header */}
          <h1 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: '700',
            color: '#4A90E2',
            margin: '0 0 20px 0',
            padding: '10px 0'
          }}>
            KHỞI ĐỘNG THỬ THÁCH
          </h1>

          {/* Question for Level Selection */}
          <div style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            padding: '15px',
            background: '#FFE5E5',
            borderRadius: '12px',
            border: '2px solid #FF6B6B'
          }}>
            Bạn đang học lớp mấy?
          </div>

          {/* Level Selection */}
          <div className="level-selection">
            <div
              className={`level-card ${selectedLevel === 3 ? 'selected' : ''}`}
              onClick={() => {
                playClick();
                handleLevelSelect(3);
              }}
            >
              <div className="level-icon">👦</div>
              <div className="level-number">Lớp 3</div>
            </div>

            <div
              className={`level-card ${selectedLevel === 4 ? 'selected' : ''}`}
              onClick={() => {
                playClick();
                handleLevelSelect(4);
              }}
            >
              <div className="level-icon">🧒</div>
              <div className="level-number">Lớp 4</div>
            </div>

            <div
              className={`level-card ${selectedLevel === 5 ? 'selected' : ''}`}
              onClick={() => {
                playClick();
                handleLevelSelect(5);
              }}
            >
              <div className="level-icon">👨‍🎓</div>
              <div className="level-number">Lớp 5</div>
            </div>
          </div>

          {/* All Settings in unified style */}
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Question Count Selection */}
            <div style={{
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333',
                textAlign: 'center'
              }}>
                Chọn số lượng câu hỏi:
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {[15, 24, 30, 45].map(count => (
                  <button
                    key={count}
                    className={`count-option ${questionCount === count ? 'selected' : ''}`}
                    onClick={() => {
                      playClick();
                      setQuestionCount(count);
                    }}
                    style={{
                      padding: '12px 24px',
                      border: '2px solid',
                      borderColor: questionCount === count ? '#4A90E2' : '#ddd',
                      borderRadius: '8px',
                      background: questionCount === count ? '#4A90E2' : 'white',
                      color: questionCount === count ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      minWidth: '80px'
                    }}
                  >
                    {count} câu
                  </button>
                ))}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                marginTop: '12px',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                💡 Chọn số lượng câu hỏi nhiều thì mức độ đánh giá sẽ càng chính xác bạn nhé!
              </div>
            </div>

            {/* Difficulty Level Selection */}
            <div style={{
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333',
                textAlign: 'center'
              }}>
                Chọn mức độ khó:
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '14px', color: '#51CF66', fontWeight: '600' }}>
                  Dễ
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#FF6B6B', fontWeight: '600' }}>
                  Khó
                </span>
              </div>
              <div style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: difficultyLevel <= 3 ? '#51CF66' : difficultyLevel <= 7 ? '#FFD43B' : '#FF6B6B',
                marginTop: '8px'
              }}>
                Mức {difficultyLevel}
              </div>
            </div>

            {/* Subject Filter Selection */}
            <div style={{
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333',
                textAlign: 'center'
              }}>
                Chọn môn học:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  className={`subject-filter-option ${selectedSubjects.includes('all') ? 'selected' : ''}`}
                  onClick={() => {
                    playClick();
                    handleSubjectToggle('all');
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid',
                    borderColor: selectedSubjects.includes('all') ? '#4A90E2' : '#ddd',
                    borderRadius: '20px',
                    background: selectedSubjects.includes('all') ? '#4A90E2' : 'white',
                    color: selectedSubjects.includes('all') ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✨ Tất cả
                </button>
                {Object.entries(SUBJECT_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    className={`subject-filter-option ${selectedSubjects.includes(key) ? 'selected' : ''}`}
                    onClick={() => {
                      playClick();
                      handleSubjectToggle(key);
                    }}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid',
                      borderColor: selectedSubjects.includes(key) ? config.color : '#ddd',
                      borderRadius: '20px',
                      background: selectedSubjects.includes(key) ? config.color : 'white',
                      color: selectedSubjects.includes(key) ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {config.icon} {config.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button - Centered */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            marginBottom: '30px'
          }}>
            <GameButton
              variant="primary"
              size="large"
              onClick={() => {
                playClick();
                startTest();
              }}
              disabled={loading}
            >
              {loading ? 'Đang tải câu hỏi...' : 'Bắt đầu thử thách! 🚀'}
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình kết quả
  if (showResults && testResults) {
    // Safe get subject config
    const getSafeSubjectConfig = (subject) => {
      return SUBJECT_CONFIG[subject] || {
        name: subject || 'Không xác định',
        icon: '❓',
        color: '#87CEEB'
      };
    };

    return (
      <div className="thu-thach-khoi-dau">
        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">🎉 KẾT QUẢ BÀI TEST</h1>
          </div>

          <div className="results-content">
            {/* Overall Score with Time */}
            <div className="score-card">
              <div className="score-circle">
                <div className="score-number">{testResults.percentage || 0}%</div>
                <div className="score-label">Điểm số</div>
              </div>
              <div className="score-right-info">
                <div className="score-detail">
                  Đúng <strong>{testResults.score || 0}</strong> / {testResults.total || 0} câu
                </div>
                <div className="time-info-inline">
                  ⏱️ Thời gian làm bài: {formatTime(testResults.timeTaken)}
                </div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="subject-breakdown">
              <h3 className="breakdown-title">Phân tích theo môn học</h3>
              <div className="subject-scores">
                {testResults.subjectScores && Object.entries(testResults.subjectScores).map(([subject, scores]) => {
                  const subjectConfig = getSafeSubjectConfig(subject);
                  return (
                    <div key={subject} className="subject-score-card">
                      <div className="subject-header">
                        <span className="subject-icon">{subjectConfig.icon}</span>
                        <span className="subject-name">{subjectConfig.name}</span>
                      </div>
                      <div className="subject-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${scores.total > 0 ? (scores.correct / scores.total) * 100 : 0}%`,
                              backgroundColor: subjectConfig.color
                            }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {scores.correct || 0}/{scores.total || 0} câu đúng
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Review - ALWAYS VISIBLE */}
            <div className="detailed-review" style={{ marginTop: '24px' }}>
              <h3 className="review-title">📝 Chi tiết bài làm ({reviewQuestions.length} câu)</h3>
              {(() => {
                console.log('🔍 Rendering review section, reviewQuestions:', reviewQuestions);
                console.log('📊 Review questions count:', reviewQuestions.length);
                return null;
              })()}
              {reviewQuestions && reviewQuestions.length > 0 ? (
                <div className="review-questions">
                  {reviewQuestions.map((review, index) => {
                    const subjectConfig = getSafeSubjectConfig(review.subject);
                    return (
                      <div key={review.question_id || index} className={`review-item ${review.is_correct ? 'correct' : 'incorrect'}`}>
                        <div className="review-header">
                          <span className="review-number">Câu {index + 1}</span>
                          <span className={`review-badge ${review.is_correct ? 'correct' : 'incorrect'}`}>
                            {review.is_correct ? '✓ Đúng' : '✗ Sai'}
                          </span>
                        </div>
                        <div className="review-question-text">
                          <span className="subject-tag" style={{ backgroundColor: subjectConfig.color }}>
                            {subjectConfig.name}
                          </span>
                          <ReactMarkdown>
                            {review.question_text || 'Không có nội dung câu hỏi'}
                          </ReactMarkdown>
                        </div>
                        <div className="review-answers">
                          <div className="review-answer">
                            <strong>Đáp án của bạn:</strong>{' '}
                            <span className={review.is_correct ? 'answer-correct' : 'answer-wrong'}>
                              {review.user_answer || '(Chưa trả lời)'}
                            </span>
                          </div>
                          {!review.is_correct && (
                            <div className="review-answer">
                              <strong>Đáp án đúng:</strong>{' '}
                              <span className="answer-correct">{review.correct_answer || 'N/A'}</span>
                            </div>
                          )}
                        </div>
                        {review.explanation && review.explanation !== 'Chưa có giải thích (backend chưa trả về dữ liệu)' && (
                          <div className="review-explanation">
                            <strong>💡 Giải thích:</strong>{' '}
                            <ReactMarkdown>{review.explanation}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="review-placeholder" style={{
                  textAlign: 'center',
                  padding: '40px',
                  background: '#fff5f5',
                  borderRadius: '12px',
                  color: '#FF6B6B',
                  border: '2px dashed #FF6B6B'
                }}>
                  <h3>❌ Không có dữ liệu chi tiết</h3>
                  <p style={{ marginTop: '10px' }}>
                    Backend chưa trả về review_questions. Vui lòng chạy:
                  </p>
                  <code style={{
                    display: 'block',
                    background: '#000',
                    color: '#0f0',
                    padding: '10px',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontFamily: 'monospace'
                  }}>
                    cd vuot-vu-mon/server && npx knex migrate:latest
                  </code>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="results-actions">
              <GameButton
                variant="warning"
                size="large"
                onClick={() => {
                  playClick();
                  setShowTest(false);
                  setShowResults(false);
                  setSelectedLevel(null);
                  setReviewQuestions([]);
                }}
              >
                Làm lại bài test
              </GameButton>
              <GameButton
                variant="secondary"
                size="large"
                icon="🏠"
                iconPosition="left"
                onClick={() => {
                  playClick();
                  window.history.back();
                }}
              >
                Về trang chủ
              </GameButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình làm bài test
  const currentQuestion = questions[currentQuestionIndex] || null;
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion.id] : undefined;

  // Guard: Nếu không có câu hỏi hoặc data không hợp lệ, hiển thị loading
  if (questions.length === 0 || !currentQuestion) {
    console.warn('⚠️ No questions available or currentQuestion is null', {
      questionsLength: questions.length,
      currentQuestionIndex,
      currentQuestion
    });

    return (
      <div className="thu-thach-khoi-dau test-mode">
        <div className="test-container">
          <div className="test-content" style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
            <h2>⏳ Đang tải câu hỏi...</h2>
            <p>Vui lòng đợi trong giây lát</p>
            {questions.length === 0 && (
              <button
                onClick={() => window.location.reload()}
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
              >
                🔄 Tải lại trang
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Safe get subject config with fallback
  const getSubjectConfig = (subject) => {
    return SUBJECT_CONFIG[subject] || {
      name: subject || 'Không xác định',
      icon: '❓',
      color: '#87CEEB'
    };
  };

  const subjectConfig = getSubjectConfig(currentQuestion.subject);

  return (
    <div className="thu-thach-khoi-dau test-mode">
      <div className="test-container">
        {/* Left Column - Navigation */}
        <div className="test-navigation">
          {/* Timer */}
          <div className="timer-box">
            <div className="timer-icon">⏱️</div>
            <div className="timer-value">{formatTime(timeRemaining)}</div>
            <div className="timer-label">Thời gian còn lại</div>
          </div>

          {/* Question Grid */}
          <div className="question-grid">
            <div className="grid-title">Danh sách câu hỏi</div>
            <div
              className="question-numbers"
              style={{
                gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                gap: getGridGap()
              }}
            >
              {questions.map((q, index) => (
                <button
                  key={q.id || index}
                  className={`question-number-btn ${getQuestionStatus(index)}`}
                  onClick={() => handleQuestionClick(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="subject-progress-box">
            <div className="progress-title">Tiến độ theo môn</div>
            {Object.entries(SUBJECT_CONFIG).map(([key, config]) => {
              const progress = getSubjectProgress(key);
              if (progress.total === 0) return null; // Skip subjects with no questions
              return (
                <div key={key} className="subject-item">
                  <span className="subject-icon">{config.icon}</span>
                  <span className="subject-name">{config.name}</span>
                  <span className="subject-count">
                    ({progress.answered}/{progress.total})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Question Content */}
        <div className="test-content">
          {/* Question Header */}
          <div className="question-header">
            <div className="question-title">CÂU {currentQuestionIndex + 1}</div>
            <div className="question-topic">
              <span className="topic-icon">{subjectConfig.icon}</span>
              <span className="topic-text">
                {subjectConfig.name}: {currentQuestion.topic || 'Chưa có chủ đề'}
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="question-content">
            <div className="question-text">
              <ReactMarkdown>
                {currentQuestion.question || currentQuestion.question_text || 'Không có nội dung câu hỏi'}
              </ReactMarkdown>
            </div>

            {/* Answer Options */}
            <div className="answer-options">
              {(currentQuestion.options || []).map((option, index) => (
                <button
                  key={index}
                  className={`answer-option ${currentAnswer === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">
                    <ReactMarkdown>{option}</ReactMarkdown>
                  </span>
                  {currentAnswer === index && <span className="option-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="test-navigation-buttons">
            <GameButton
              variant="secondary"
              size="medium"
              onClick={() => {
                playClick();
                handlePrevQuestion();
              }}
              disabled={currentQuestionIndex === 0}
            >
              ← Câu trước
            </GameButton>

            <GameButton
              variant="warning"
              size="medium"
              onClick={() => {
                playClick();
                handleSubmitClick();
              }}
            >
              Nộp bài
            </GameButton>

            <GameButton
              variant="secondary"
              size="medium"
              onClick={() => {
                playClick();
                handleNextQuestion();
              }}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Câu sau →
            </GameButton>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content confirm-dialog">
            <div className="modal-header">
              <h2>⚠️ Xác nhận nộp bài</h2>
            </div>
            <div className="modal-body">
              <p>Bé vẫn còn <strong>{questions.length - Object.keys(userAnswers).length}</strong> câu chưa làm.</p>
              <p>Bé có chắc chắn muốn nộp bài không?</p>
            </div>
            <div className="modal-footer">
              <GameButton
                variant="secondary"
                size="medium"
                onClick={() => {
                  playClick();
                  setShowConfirmDialog(false);
                }}
              >
                Tiếp tục làm bài
              </GameButton>
              <GameButton
                variant="warning"
                size="medium"
                onClick={() => {
                  playClick();
                  handleSubmit();
                }}
              >
                Nộp bài ngay
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThuThachKhoiDau;
