import { useState } from 'react';
import useGameSound from '../../hooks/useGameSound';
import GameButton from '../ui/GameButton';
import GameCard from '../ui/GameCard';
import './SoundDemo.css';

/**
 * Sound Demo Component
 * Minh họa cách sử dụng useGameSound hook và Design Tokens
 */
const SoundDemo = () => {
  const {
    playClick,
    playCorrect,
    playWrong,
    playSuccess,
    playFail,
    playHover,
    playCoin,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useGameSound();

  const [score, setScore] = useState(0);

  const handleCorrectAnswer = () => {
    playCorrect();
    setScore(score + 10);
  };

  const handleWrongAnswer = () => {
    playWrong();
    setScore(Math.max(0, score - 5));
  };

  const handleCollectCoin = () => {
    playCoin();
    setScore(score + 1);
  };

  return (
    <div className="sound-demo">
      <GameCard title="🎵 Sound System Demo" variant="gradient">
        <div className="sound-demo__content">
          {/* Header với controls */}
          <div className="sound-demo__header">
            <div className="sound-demo__info">
              <h3>Score: {score}</h3>
              <p className="text-muted">Click các nút để test âm thanh!</p>
            </div>
            <div className="sound-demo__controls">
              <GameButton
                variant="ghost"
                size="small"
                onClick={toggleMute}
                icon={isMuted ? '🔇' : '🔊'}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </GameButton>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="sound-demo__volume">
            <label htmlFor="volume-slider">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(e.target.value / 100)}
              className="sound-demo__slider"
            />
          </div>

          {/* Basic Sounds */}
          <div className="sound-demo__section">
            <h4>Basic Sounds</h4>
            <div className="sound-demo__buttons">
              <GameButton
                variant="primary"
                onClick={playClick}
                onMouseEnter={playHover}
              >
                Click Sound
              </GameButton>
              <GameButton
                variant="secondary"
                onClick={playHover}
              >
                Hover Sound
              </GameButton>
            </div>
          </div>

          {/* Game Feedback Sounds */}
          <div className="sound-demo__section">
            <h4>Game Feedback</h4>
            <div className="sound-demo__buttons">
              <GameButton
                variant="success"
                onClick={handleCorrectAnswer}
                onMouseEnter={playHover}
                icon="✓"
              >
                Correct (+10)
              </GameButton>
              <GameButton
                variant="danger"
                onClick={handleWrongAnswer}
                onMouseEnter={playHover}
                icon="✗"
              >
                Wrong (-5)
              </GameButton>
              <GameButton
                variant="warning"
                onClick={handleCollectCoin}
                onMouseEnter={playHover}
                icon="⭐"
              >
                Collect Star (+1)
              </GameButton>
            </div>
          </div>

          {/* Result Sounds */}
          <div className="sound-demo__section">
            <h4>Game Results</h4>
            <div className="sound-demo__buttons">
              <GameButton
                variant="success"
                onClick={playSuccess}
                onMouseEnter={playHover}
                icon="🎉"
              >
                Success!
              </GameButton>
              <GameButton
                variant="danger"
                onClick={playFail}
                onMouseEnter={playHover}
                icon="😢"
              >
                Failed
              </GameButton>
            </div>
          </div>

          {/* Design Tokens Example */}
          <div className="sound-demo__section">
            <h4>Design Tokens Example</h4>
            <div className="sound-demo__tokens">
              <div className="token-example">
                <span className="token-label">Spacing:</span>
                <div className="token-boxes">
                  <div className="token-box" style={{ padding: 'var(--space-sm)' }}>
                    sm
                  </div>
                  <div className="token-box" style={{ padding: 'var(--space-md)' }}>
                    md
                  </div>
                  <div className="token-box" style={{ padding: 'var(--space-lg)' }}>
                    lg
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GameCard>

      {/* Code Example */}
      <GameCard title="💻 Code Example" variant="outlined">
        <pre className="sound-demo__code">
{`import useGameSound from '@/hooks/useGameSound';

function MyGame() {
  const { playCorrect, playWrong, playClick } = useGameSound();

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      playCorrect();
      // ... logic khi đúng
    } else {
      playWrong();
      // ... logic khi sai
    }
  };

  return (
    <button onClick={() => { playClick(); handleAnswer(true); }}>
      Submit Answer
    </button>
  );
}`}
        </pre>
      </GameCard>
    </div>
  );
};

export default SoundDemo;
