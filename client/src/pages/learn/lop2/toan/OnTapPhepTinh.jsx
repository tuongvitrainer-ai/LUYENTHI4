import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calculator, 
  Clock, 
  Trophy, 
  RefreshCcw, 
  Play, 
  CheckCircle, 
  XCircle, 
  Settings,
  Target,
  Volume2,
  VolumeX,
  Star
} from 'lucide-react';
import { Input, Progress, Radio, ConfigProvider } from 'antd';

// ==========================================
// 1. GLOBAL DESIGN TOKENS & STYLES
// Mô phỏng file index.css của dự án chính
// ==========================================
const GlobalStyles = () => (
  <style>{`
    :root {
      /* Colors - Blue Pastel Palette */
      --color-primary: #a8d5ff;
      --color-primary-light: #c9e4ff;
      --color-primary-dark: #3b82f6; /* Adjusted for better contrast on text */
      --color-primary-hover: #8cc8ff;
      
      /* Semantic Colors */
      --color-success: #a8e6cf;
      --color-success-dark: #2d6a4f;
      --color-warning: #ffd19a;
      --color-danger: #ffb3ba;
      --color-danger-dark: #e63946;
      --color-bg: #f0f9ff;
      --color-surface: #ffffff;

      /* Spacing */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      --space-2xl: 48px;

      /* Typography */
      --font-family: 'Quicksand', sans-serif;
      --font-size-sm: 14px;
      --font-size-base: 16px;
      --font-size-lg: 18px;
      --font-size-xl: 20px;
      --font-size-2xl: 24px;
      --font-size-3xl: 30px;
      --font-size-4xl: 48px;

      /* Animation */
      --duration-fast: 200ms;
      --duration-normal: 300ms;
      --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      --game-scale-hover: 1.05;
      --game-scale-active: 0.95;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--color-bg);
      margin: 0;
      padding: 0;
    }

    /* Utility Classes based on Tokens */
    .game-text-title { font-size: var(--font-size-3xl); font-weight: 700; color: var(--color-primary-dark); }
    .game-text-body { font-size: var(--font-size-base); color: #4b5563; }
    
    /* Animation Keyframes */
    @keyframes wiggle {
      0%, 100% { transform: rotate(0); }
      25% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
    }
    .animate-wiggle { animation: wiggle var(--duration-normal) var(--ease-bounce); }
  `}</style>
);

// ==========================================
// 2. MOCK HOOKS & UTILS (Theo Design Tokens)
// ==========================================

// Giả lập hook useGameSound theo tài liệu
const useGameSound = () => {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = (type) => {
    if (isMuted) return;
    // Trong thực tế, đây sẽ gọi file audio assets
    // console.log(`🔊 Playing sound: ${type}`);
    
    // Giả lập âm thanh cơ bản bằng Web Audio API để demo hoạt động
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      
      switch (type) {
        case 'click':
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.1, now);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        case 'correct':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'wrong':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(100, now + 0.2);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'success':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.setValueAtTime(600, now + 0.1);
          osc.frequency.setValueAtTime(800, now + 0.2);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
          break;
        default: break;
      }
    } catch (e) {
      // Ignore audio errors
    }
  };

  return {
    playClick: () => playSound('click'),
    playCorrect: () => playSound('correct'),
    playWrong: () => playSound('wrong'),
    playSuccess: () => playSound('success'),
    playFail: () => playSound('fail'),
    playHover: () => {}, // Disabled for demo noise reduction
    toggleMute: () => setIsMuted(!isMuted),
    isMuted,
  };
};

// ==========================================
// 3. UI COMPONENTS (Theo Design Tokens)
// ==========================================

const GameCard = ({ children, title, variant = 'default', className = '' }) => {
  // Mapping variants to styles
  const getBackground = () => {
    switch(variant) {
      case 'gradient': return 'linear-gradient(135deg, #ffffff 0%, var(--color-bg) 100%)';
      case 'outlined': return 'transparent';
      default: return 'var(--color-surface)';
    }
  };

  return (
    <div 
      className={className}
      style={{
        background: getBackground(),
        borderRadius: '24px',
        padding: 'var(--space-lg)',
        boxShadow: variant === 'outlined' ? 'none' : '0 10px 25px -5px rgba(59, 130, 246, 0.15)',
        border: variant === 'outlined' ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.5)',
        marginBottom: 'var(--space-lg)',
        transition: 'all 0.3s ease'
      }}
    >
      {title && (
        <div style={{ marginBottom: 'var(--space-md)', borderBottom: '2px solid var(--color-bg)', paddingBottom: 'var(--space-sm)' }}>
           {title}
        </div>
      )}
      {children}
    </div>
  );
};

const GameButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  block = false,
  className = '',
  disabled = false
}) => {
  const { playClick } = useGameSound();

  const getColors = () => {
    switch(variant) {
      case 'success': return { bg: 'var(--color-success)', text: 'var(--color-success-dark)' };
      case 'danger': return { bg: 'var(--color-danger)', text: 'var(--color-danger-dark)' };
      case 'warning': return { bg: 'var(--color-warning)', text: '#92400e' };
      case 'ghost': return { bg: 'transparent', text: 'var(--color-primary-dark)' };
      case 'primary': 
      default: return { bg: 'var(--color-primary)', text: 'var(--color-primary-dark)' };
    }
  };

  const getPadding = () => {
    switch(size) {
      case 'small': return 'var(--space-xs) var(--space-sm)';
      case 'large': return 'var(--space-md) var(--space-lg)';
      case 'medium': 
      default: return 'var(--space-sm) var(--space-md)';
    }
  };

  const colors = getColors();

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          playClick();
          onClick && onClick(e);
        }
      }}
      style={{
        width: block ? '100%' : 'auto',
        backgroundColor: disabled ? '#e5e7eb' : colors.bg,
        color: disabled ? '#9ca3af' : colors.text,
        padding: getPadding(),
        borderRadius: '12px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: size === 'large' ? 'var(--font-size-lg)' : 'var(--font-size-base)',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        transition: 'transform var(--duration-fast) var(--ease-bounce), filter 0.2s',
        transform: 'scale(1)',
        boxShadow: disabled ? 'none' : '0 4px 0 rgba(0,0,0,0.1)', // 3D effect
        marginBottom: 'var(--space-sm)'
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(var(--game-scale-active)) translateY(4px)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter = 'brightness(1.05)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.filter = 'brightness(1)')}
    >
      {icon}
      {children}
    </button>
  );
};

// ==========================================
// 4. GAME LOGIC UTILS
// ==========================================
const generateQuestion = (type, range) => {
  const operations = ['+', '-', '*', '/'];
  let op;

  if (type === 'mixed') {
    op = operations[Math.floor(Math.random() * operations.length)];
  } else {
    const map = { add: '+', subtract: '-', multiply: '*', divide: '/' };
    op = map[type];
  }

  let num1, num2, questionText, answer;
  const maxNum = range;

  switch (op) {
    case '+':
      answer = Math.floor(Math.random() * (maxNum - 10)) + 11;
      num1 = Math.floor(Math.random() * (answer - 5)) + 5;
      num2 = answer - num1;
      questionText = `${num1} + ${num2}`;
      break;
    case '-':
      num1 = Math.floor(Math.random() * (maxNum - 10)) + 11;
      num2 = Math.floor(Math.random() * (num1 - 5)) + 1;
      answer = num1 - num2;
      questionText = `${num1} - ${num2}`;
      break;
    case '*':
      do { 
        num1 = Math.floor(Math.random() * 8) + 2; 
        num2 = Math.floor(Math.random() * 8) + 2; 
      } while (num1 === 2 && num2 === 2);
      answer = num1 * num2;
      questionText = `${num1} × ${num2}`;
      break;
    case '/':
      do { 
        num2 = Math.floor(Math.random() * 8) + 2; 
        answer = Math.floor(Math.random() * 8) + 2; 
        num1 = num2 * answer; 
      } while (num1 === num2);
      questionText = `${num1} ÷ ${num2}`;
      break;
    default:
      questionText = "1 + 1";
      answer = 2;
  }
  return { questionText, answer };
};

// ==========================================
// 5. MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Use custom sound hook
  const { playCorrect, playWrong, playSuccess, playFail, toggleMute, isMuted } = useGameSound();

  // --- State ---
  const [screen, setScreen] = useState('setup'); 
  const [settings, setSettings] = useState({ type: 'mixed', time: 0, range: 100 });
  const [gameState, setGameState] = useState({
    questions: [],
    currentIndex: 0,
    score: 0,
    userAnswers: [],
    timeLeft: 0,
  });
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const inputRef = useRef(null);

  // --- Logic ---
  const startGame = () => {
    const totalQuestions = 10;
    const newQuestions = Array.from({ length: totalQuestions }, () => 
      generateQuestion(settings.type, settings.range)
    );

    setGameState({
      questions: newQuestions,
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      timeLeft: settings.time,
    });
    setInputValue('');
    setFeedback(null);
    setScreen('game');
  };

  const handleAnswer = () => {
    if (!inputValue) return;

    const currentQ = gameState.questions[gameState.currentIndex];
    const userVal = parseInt(inputValue, 10);
    const isCorrect = userVal === currentQ.answer;

    // Use Sound & Feedback State instead of Antd Message
    if (isCorrect) {
      playCorrect();
      setFeedback('correct');
    } else {
      playWrong();
      setFeedback('wrong');
    }

    const newAnswerRecord = {
      id: gameState.currentIndex,
      questionText: currentQ.questionText,
      correctAnswer: currentQ.answer,
      userAnswer: userVal,
      isCorrect: isCorrect
    };

    // Delay to show animation
    setTimeout(() => {
      setGameState(prev => {
        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.questions.length;

        if (isFinished) {
          playSuccess(); // End game sound
          setTimeout(() => finishGame([...prev.userAnswers, newAnswerRecord], prev.score + (isCorrect ? 1 : 0)), 500);
        }

        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          userAnswers: [...prev.userAnswers, newAnswerRecord],
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
        };
      });
      setFeedback(null);
      setInputValue('');
      if (inputRef.current) inputRef.current.focus();
    }, 1000); // Wait 1s for feedback
  };

  const finishGame = (finalAnswers, finalScore) => {
    setGameState(prev => ({
      ...prev,
      userAnswers: finalAnswers || prev.userAnswers,
      score: finalScore !== undefined ? finalScore : prev.score
    }));
    setScreen('result');
  };

  // --- Timer ---
  useEffect(() => {
    if (screen !== 'game' || settings.time === 0) return;
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          playFail();
          finishGame();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, settings.time]);

  // --- Screens ---

  const renderSetup = () => (
    <GameCard 
      variant="default"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-primary-dark)' }}>
          <Settings size={24} />
          <span className="game-text-title" style={{ fontSize: 'var(--font-size-xl)' }}>Cài Đặt</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Phép toán */}
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 'bold' }}>1. Phép toán</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
             {['add', 'subtract', 'multiply', 'divide'].map(type => (
               <GameButton 
                 key={type} 
                 variant={settings.type === type ? 'primary' : 'ghost'} 
                 onClick={() => setSettings({...settings, type})}
                 className={settings.type === type ? '' : 'bg-gray-100'}
               >
                 {{add: 'Cộng', subtract: 'Trừ', multiply: 'Nhân', divide: 'Chia'}[type]}
               </GameButton>
             ))}
             <div style={{ gridColumn: 'span 2' }}>
                <GameButton 
                  block 
                  variant={settings.type === 'mixed' ? 'primary' : 'ghost'}
                  onClick={() => setSettings({...settings, type: 'mixed'})}
                >
                  Tổng Hợp
                </GameButton>
             </div>
          </div>
        </div>

        {/* Thời gian & Phạm vi */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
           <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 'bold' }}>2. Thời gian</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {[0, 120, 300].map(t => (
                  <GameButton 
                    key={t} size="small"
                    variant={settings.time === t ? 'primary' : 'ghost'}
                    onClick={() => setSettings({...settings, time: t})}
                  >
                    {t === 0 ? 'Thoải mái' : `${t/60} phút`}
                  </GameButton>
                ))}
              </div>
           </div>
           <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 'bold' }}>3. Phạm vi</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {[20, 100, 1000].map(r => (
                  <GameButton 
                    key={r} size="small"
                    variant={settings.range === r ? 'primary' : 'ghost'}
                    onClick={() => setSettings({...settings, range: r})}
                  >
                    Đến {r}
                  </GameButton>
                ))}
              </div>
           </div>
        </div>

        <GameButton size="large" onClick={startGame} icon={<Play size={24}/>} block className="animate-wiggle">
          BẮT ĐẦU
        </GameButton>
      </div>
    </GameCard>
  );

  const renderGame = () => {
    const currentQ = gameState.questions[gameState.currentIndex];
    const progressPercent = settings.time > 0 ? (gameState.timeLeft / settings.time) * 100 : 100;

    return (
      <GameCard className="relative overflow-hidden">
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
            <Target size={18} color="var(--color-primary-dark)"/>
            <span style={{ fontWeight: 'bold' }}>{gameState.currentIndex + 1}/{gameState.questions.length}</span>
          </div>
          {settings.time > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', color: '#f97316' }}>
              <Clock size={18} />
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: 'var(--space-xl)', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progressPercent}%`, 
            height: '100%', 
            background: progressPercent < 20 ? 'var(--color-danger)' : 'var(--color-primary)',
            transition: 'width 1s linear'
          }} />
        </div>

        {/* Question */}
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-2xl) 0', 
          marginBottom: 'var(--space-lg)',
          transform: feedback ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}>
          {feedback === 'correct' && <div style={{ color: 'var(--color-success-dark)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Chính xác! 🎉</div>}
          {feedback === 'wrong' && <div style={{ color: 'var(--color-danger-dark)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Sai rồi! 😅</div>}
          
          <div style={{ 
            fontSize: 'var(--font-size-4xl)', 
            fontWeight: '900', 
            color: feedback === 'wrong' ? 'var(--color-danger)' : feedback === 'correct' ? 'var(--color-success-dark)' : '#1f2937' 
          }}>
            {currentQ?.questionText} = ?
          </div>
        </div>

        {/* Input Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
           <Input 
             ref={inputRef}
             type="number"
             value={inputValue}
             onChange={e => setInputValue(e.target.value)}
             onPressEnter={handleAnswer}
             placeholder="?"
             disabled={!!feedback}
             style={{
               fontSize: '32px',
               textAlign: 'center',
               height: '64px',
               borderRadius: '16px',
               border: `3px solid ${feedback === 'correct' ? 'var(--color-success)' : feedback === 'wrong' ? 'var(--color-danger)' : '#e5e7eb'}`
             }}
           />
           <GameButton 
             size="large" 
             block 
             onClick={handleAnswer} 
             disabled={!!feedback}
             variant={feedback === 'correct' ? 'success' : feedback === 'wrong' ? 'danger' : 'primary'}
           >
             TRẢ LỜI
           </GameButton>
        </div>
      </GameCard>
    );
  };

  const renderResult = () => {
    const isHigh = gameState.score >= 8;
    return (
      <GameCard variant="gradient">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          {isHigh ? <Trophy size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce" /> : <Star size={80} className="text-blue-400 mx-auto mb-4" />}
          <h2 className="game-text-title" style={{ marginBottom: 'var(--space-sm)' }}>
            {isHigh ? 'Tuyệt Vời!' : 'Hoàn Thành!'}
          </h2>
          <p className="game-text-body">Bé trả lời đúng <b>{gameState.score}/{gameState.questions.length}</b> câu</p>
        </div>

        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          background: 'rgba(255,255,255,0.6)', 
          borderRadius: '12px', 
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)'
        }}>
          {gameState.userAnswers.map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: 'var(--space-sm)',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontWeight: 'bold', color: '#6b7280' }}>#{idx+1}</span>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>{item.questionText}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span style={{ 
                  color: item.isCorrect ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
                  fontWeight: 'bold'
                }}>
                  {item.userAnswer}
                </span>
                {item.isCorrect ? <CheckCircle size={20} color="var(--color-success-dark)"/> : <XCircle size={20} color="var(--color-danger-dark)"/>}
              </div>
            </div>
          ))}
        </div>

        <GameButton block size="large" onClick={() => setScreen('setup')} icon={<RefreshCcw />}>
          CHƠI LẠI
        </GameButton>
      </GameCard>
    );
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 'var(--space-md)' 
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
             <h1 style={{ 
               fontSize: 'var(--font-size-4xl)', 
               color: 'var(--color-primary-dark)', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               gap: 'var(--space-sm)',
               margin: 0
             }}>
               <Calculator size={40} strokeWidth={2.5} />
               <span>Ôn tập các phép tính</span>
             </h1>
             <button 
               onClick={toggleMute} 
               style={{ 
                 marginTop: 'var(--space-sm)', 
                 background: 'none', 
                 border: 'none', 
                 color: 'var(--color-primary-dark)', 
                 cursor: 'pointer' 
               }}
             >
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
          </div>

          {/* Render Screens */}
          <div style={{ transition: 'all 0.3s ease' }}>
             {screen === 'setup' && renderSetup()}
             {screen === 'game' && renderGame()}
             {screen === 'result' && renderResult()}
          </div>
        </div>
      </div>
    </>
  );
}