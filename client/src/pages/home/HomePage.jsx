import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GameCard from '../../components/ui/GameCard';
import GameButton from '../../components/ui/GameButton';
import { useGameSound } from '../../hooks/useGameSound';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { playClick } = useGameSound();

  const handleQuestClick = () => {
    playClick();
    // Navigate to quest
  };


  return (
    <div className="homepage">
      {/* Tier 1: Daily Quest Banner */}
      <div className="daily-quest-banner">
        <div className="quest-content">
          <div className="quest-illustration">
            <div className="student-avatar">
              <img
                src="/src/assets/images/student.png"
                alt="Học sinh"
                className="avatar-icon"
                style={{ width: '120px', height: '120px', borderRadius: '50%' }}
              />
              <span className="question-mark">❓</span>
            </div>

          </div>
          <div className="quest-info">
            <h2 className="quest-title">Thử thách hôm nay</h2>
            <p className="quest-description">Thử thách: Hoàn thành 5 bài toán đố</p>
          </div>
        </div>
        <GameButton
          variant="primary"
          size="large"
          onClick={handleQuestClick}
          className="quest-button"
        >
          ⚡ Bắt đầu ngay
        </GameButton>
      </div>

      {/* Tier 2: Core Features */}
      <div className="core-features-grid">
        <GameCard
          variant="gradient"
          hoverable
          className="practice-card"
        >
          <div className="feature-content">
            {/* Icon bên trái trong vòng tròn */}
            <div className="feature-icon-circle">
              <div className="feature-icon">
                <span className="icon-large">📚</span>
                <span className="icon-small">🖩</span>
              </div>
            </div>

            {/* 3 dòng chữ bên phải */}
            <div className="feature-info">
              <h3 className="feature-title">Ôn Luyện</h3>
              <p className="feature-description">Luyện tập các môn Toán, Văn, Anh...</p>
              <p className="feature-description">Ôn thi Starters, Movers, Flyers</p>
              <Link to="/practice">
                <GameButton variant="secondary" size="medium" onClick={playClick}>
                  Vào học
                </GameButton>
              </Link>
            </div>
          </div>
        </GameCard>

        <GameCard
          variant="gradient"
          hoverable
          className="exam-card"
        >
          <div className="feature-content">
            {/* Icon bên trái trong vòng tròn */}
            <div className="feature-icon-circle">
              <div className="feature-icon">
                <span className="icon-large">📝</span>
                <span className="icon-small">✏️</span>
              </div>
            </div>

            {/* 3 dòng chữ bên phải */}
            <div className="feature-info">
              <h3 className="feature-title">Thi Thử</h3>
              <p className="feature-description">Thi thử đề các năm, đề mẫu</p>
              <p className="feature-description">Giới hạn thời gian, chấm bài ngay</p>
              <Link to="/exam/thu-thach">
                <GameButton variant="secondary" size="medium" onClick={playClick}>
                  Vào học
                </GameButton>
              </Link>
            </div>
          </div>
        </GameCard>
      </div>

      {/* Cambridge Young Learners English (YLE) */}
      <div className="yle-section">
        <h2 className="section-title">Cambridge Young Learners English (YLE)</h2>
        <div className="yle-grid">
          {/* Starters */}
          <Link to="./yle/starters">
            <GameCard
              variant="gradient"
              hoverable
              className="yle-card yle-starters"
              onClick={playClick}
            >
              <div className="yle-content">
                <div className="yle-icon">🌱</div>
                <h3 className="yle-title">Starters</h3>
                
              </div>
            </GameCard>
          </Link>

          {/* Movers */}
          <Link to="/yle/movers">
            <GameCard
              variant="gradient"
              hoverable
              className="yle-card yle-movers"
              onClick={playClick}
            >
              <div className="yle-content">
                <div className="yle-icon">🚲</div>
                <h3 className="yle-title">Movers</h3>
                
              </div>
            </GameCard>
          </Link>

          {/* Flyers */}
          <Link to="/yle/flyers">
            <GameCard
              variant="gradient"
              hoverable
              className="yle-card yle-flyers"
              onClick={playClick}
            >
              <div className="yle-content">
                <div className="yle-icon">✈️</div>
                <h3 className="yle-title">Flyers</h3>
                
              </div>
            </GameCard>
          </Link>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="guest-message">
          <p>
            <strong>Chế độ khách:</strong>Hãy đăng nhập để lưu điểm số và xem lịch sử ôn tập nhé!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
