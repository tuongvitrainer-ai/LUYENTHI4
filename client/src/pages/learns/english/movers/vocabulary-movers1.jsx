import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import GameButton from '@/components/ui/GameButton';
import GameCard from '@/components/ui/GameCard';
import useGameSound from '@/hooks/useGameSound';
import './vocabulary-movers1.css';

const MoversQuest = () => {
  // Setup states
  const [questionCount, setQuestionCount] = useState(15);
  const [timeLimit, setTimeLimit] = useState(10); // 10 min, 20 min, or 0 (no time)
  const [showTest, setShowTest] = useState(false);

  // Game states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: { answerIndex, isCorrect } }
  const [checkedAnswers, setCheckedAnswers] = useState({}); // Lock answered questions
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // API states
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sound hook
  const { playClick, playCorrect, playWrong } = useGameSound();

  // Timer countdown
  useEffect(() => {
    if (showTest && !showResults && timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTest, showResults, timeLimit]);

  // Keyboard navigation - Enter to next question
  useEffect(() => {
    if (showTest && !showResults) {
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const currentQuestion = questions[currentQuestionIndex];
          if (currentQuestion && checkedAnswers[currentQuestion.id]) {
            // Only allow next if current question is answered
            if (currentQuestionIndex < questions.length - 1) {
              handleNextQuestion();
            } else {
              handleFinish();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [showTest, showResults, currentQuestionIndex, questions.length, checkedAnswers]);

  const startTest = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call API to get questions with correctAnswer visible
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.get(`${API_BASE}/api/games/vocabulary-movers`, {
        params: {
          limit: questionCount,
          gradeLevel: 'movers' // movers, flyers, or starters
        }
      });

      if (response.data.success && response.data.questions.length > 0) {
        setQuestions(response.data.questions);
        setShowTest(true);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setCheckedAnswers({});
        setScore(0);
        setTimeRemaining(timeLimit * 60); // Convert minutes to seconds
        setShowResults(false);
        console.log(`✅ Loaded ${response.data.questions.length} questions`);
      } else {
        throw new Error('Không có câu hỏi nào');
      }
    } catch (err) {
      console.error('❌ Error fetching questions:', err);
      setError(err.response?.data?.message || err.message || 'Không thể tải câu hỏi');
      alert('Lỗi khi tải câu hỏi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    // Prevent re-answering
    if (checkedAnswers[questionId]) {
      return;
    }

    playClick();

    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    // Check if answer is correct
    const isCorrect = currentQuestion.options[answerIndex] === currentQuestion.correctAnswer;

    // Play sound
    if (isCorrect) {
      playCorrect();
      setScore(prev => prev + 1);
    } else {
      playWrong();
    }

    // Lock this question
    setCheckedAnswers({
      ...checkedAnswers,
      [questionId]: true
    });

    // Save answer
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        answerIndex,
        isCorrect
      }
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

  const handleFinish = () => {
    setShowResults(true);
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

    // Check if answered and show correct/incorrect
    if (userAnswers[question.id]) {
      return userAnswers[question.id].isCorrect ? 'correct' : 'incorrect';
    }

    return 'pending';
  };

  const getGridColumns = () => {
    const count = questions.length;
    if (count <= 15) return 3;
    if (count <= 24) return 4;
    if (count <= 30) return 5;
    return 6;
  };

  const getGridGap = () => {
    const count = questions.length;
    if (count <= 15) return '8px';
    if (count <= 24) return '6px';
    if (count <= 30) return '5px';
    return '4px';
  };

  // Setup Screen
  if (!showTest) {
    return (
      <div className="movers-quest">
        <div className="game-container">
          <h1 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: '700',
            color: 'var(--color-primary)',
            margin: '0 0 var(--space-lg) 0',
            padding: 'var(--space-md) 0'
          }}>
            🚀 MOVERS QUEST
          </h1>

          <div style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-lg)',
            padding: 'var(--space-md)',
            background: '#FFE5E5',
            borderRadius: 'var(--border-radius-lg)',
            border: '2px solid var(--color-danger)'
          }}>
            Ready to master vocabulary? 📚
          </div>

          {/* Question Count Selection */}
          <GameCard variant="default" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}>
              📝 Choose number of questions:
            </div>
            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {[15, 24, 36, 45].map(count => (
                <GameButton
                  key={count}
                  variant={questionCount === count ? 'primary' : 'secondary'}
                  size="medium"
                  onClick={() => {
                    playClick();
                    setQuestionCount(count);
                  }}
                >
                  {count} questions
                </GameButton>
              ))}
            </div>
          </GameCard>

          {/* Time Limit Selection */}
          <GameCard variant="default" style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}>
              ⏱️ Choose time limit:
            </div>
            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <GameButton
                variant={timeLimit === 10 ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => {
                  playClick();
                  setTimeLimit(10);
                }}
              >
                10 minutes
              </GameButton>
              <GameButton
                variant={timeLimit === 20 ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => {
                  playClick();
                  setTimeLimit(20);
                }}
              >
                20 minutes
              </GameButton>
              <GameButton
                variant={timeLimit === 0 ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => {
                  playClick();
                  setTimeLimit(0);
                }}
              >
                No time limit
              </GameButton>
            </div>
          </GameCard>

          {/* Start Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'var(--space-xl)'
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
              {loading ? 'Loading questions...' : 'Start! 🚀'}
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="movers-quest">
        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">🎉 RESULTS</h1>
          </div>

          <div className="results-content">
            {/* Score Card */}
            <div className="score-card">
              <div className="score-circle">
                <div className="score-number">{percentage}%</div>
                <div className="score-label">Score</div>
              </div>
              <div className="score-right-info">
                <div className="score-detail">
                  Correct <strong>{score}</strong> / {questions.length} questions
                </div>
                {timeLimit > 0 && (
                  <div className="time-info-inline">
                    ⏱️ Time: {formatTime(timeLimit * 60 - timeRemaining)}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Moved before Answer Review */}
            <div className="results-actions">
              <GameButton
                variant="warning"
                size="large"
                onClick={() => {
                  playClick();
                  setShowTest(false);
                  setShowResults(false);
                }}
              >
                Try Again
              </GameButton>
              <GameButton
                variant="secondary"
                size="large"
                onClick={() => {
                  playClick();
                  window.history.back();
                }}
              >
                🏠 Home
              </GameButton>
            </div>

            {/* Review Questions */}
            <div className="detailed-review">
              <h3 className="review-title">📝 Answer Review</h3>
              <div className="review-questions">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = userAnswer?.isCorrect || false;
                  const userAnswerText = userAnswer
                    ? question.options[userAnswer.answerIndex]
                    : '(Not answered)';

                  return (
                    <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className="review-header">
                        <span className="review-number">Question {index + 1}</span>
                        <span className={`review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Wrong'}
                        </span>
                      </div>
                      <div className="review-question-text">
                        <ReactMarkdown>
                          {question.question || question.question_text || 'No content'}
                        </ReactMarkdown>
                      </div>
                      <div className="review-answers">
                        <div className="review-answer">
                          <strong>Your answer:</strong>{' '}
                          <span className={isCorrect ? 'answer-correct' : 'answer-wrong'}>
                            {userAnswerText}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="review-answer">
                            <strong>Correct answer:</strong>{' '}
                            <span className="answer-correct">{question.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                      {/* Show explanation in review */}
                      {question.explanation && (
                        <div className="review-explanation">
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '4px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#666'
                          }}>
                            <span>💡</span>
                            <span>Explanation:</span>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#555',
                            fontStyle: 'italic'
                          }}>
                            {question.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  const currentQuestion = questions[currentQuestionIndex] || null;
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion.id] : undefined;
  const isLocked = currentQuestion ? checkedAnswers[currentQuestion.id] : false;

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="movers-quest test-mode">
        <div className="test-container">
          <div className="test-content" style={{ width: '100%', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <h2>⏳ Loading questions...</h2>
            <p>Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  // Find correct answer index for highlighting
  const correctAnswerIndex = currentQuestion.options.findIndex(
    opt => opt === currentQuestion.correctAnswer
  );

  return (
    <div className="movers-quest test-mode">
      <div className="test-container">
        {/* Left Column - Navigation */}
        <div className="test-navigation">
          {/* Timer */}
          {timeLimit > 0 && (
            <div className="timer-box">
              <div className="timer-icon">⏱️</div>
              <div className="timer-value">{formatTime(timeRemaining)}</div>
              <div className="timer-label">Time Remaining</div>
            </div>
          )}

          {/* Question Grid */}
          <div className="question-grid">
            <div className="grid-title">Question List</div>
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
        </div>

        {/* Right Column - Question Content */}
        <div className="test-content">
          {/* Question Header */}
          <div className="question-header">
            <div className="question-title">QUESTION {currentQuestionIndex + 1}</div>
            <div className="question-topic">
              <span className="topic-icon">📚</span>
              <span className="topic-text">
                Vocabulary: {currentQuestion.topic || 'Vocabulary'}
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="question-content">
            <div className="question-text">
              <ReactMarkdown>
                {currentQuestion.question || currentQuestion.question_text || 'No content'}
              </ReactMarkdown>
            </div>

            {/* Answer Options */}
            <div className="answer-options">
              {(currentQuestion.options || []).map((option, index) => {
                const isSelected = currentAnswer?.answerIndex === index;
                const isCorrectOption = index === correctAnswerIndex;
                const showAsCorrect = isLocked && isCorrectOption;
                const showAsWrong = isLocked && isSelected && !currentAnswer.isCorrect;

                return (
                  <button
                    key={index}
                    className={`answer-option ${isSelected ? 'selected' : ''} ${showAsCorrect ? 'correct' : ''} ${showAsWrong ? 'wrong' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    disabled={isLocked}
                    style={{
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked && !isSelected && !isCorrectOption ? 0.5 : 1
                    }}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">
                      <ReactMarkdown>{option}</ReactMarkdown>
                    </span>
                    {isSelected && <span className="option-check">✓</span>}
                    {showAsCorrect && !isSelected && <span className="option-check">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation - Show after answer is locked */}
            {isLocked && currentQuestion.explanation && (
              <div style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-md)',
                background: currentAnswer?.isCorrect
                  ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
                  : 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                borderRadius: 'var(--border-radius-md)',
                border: currentAnswer?.isCorrect
                  ? '2px solid #66BB6A'
                  : '2px solid #FFA726',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: currentAnswer?.isCorrect ? '#2E7D32' : '#E65100'
                }}>
                  <span style={{ fontSize: '20px' }}>
                    {currentAnswer?.isCorrect ? '✓' : 'ℹ️'}
                  </span>
                  <span>Explanation:</span>
                </div>
                <div style={{
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#424242'
                }}>
                  {currentQuestion.explanation}
                </div>
              </div>
            )}
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
              ← Previous
            </GameButton>

            {currentQuestionIndex === questions.length - 1 && isLocked ? (
              <GameButton
                variant="success"
                size="medium"
                onClick={() => {
                  playClick();
                  handleFinish();
                }}
              >
                Finish 🎉
              </GameButton>
            ) : (
              <GameButton
                variant="primary"
                size="medium"
                onClick={() => {
                  playClick();
                  handleNextQuestion();
                }}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next →
              </GameButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoversQuest;
