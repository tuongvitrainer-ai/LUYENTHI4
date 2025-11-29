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

  const featuredGames = [
    {
      id: 1,
      title: 'Cá Chép Hóa Rồng',
      icon: '🐟',
      badge: '5',
      path: '/games',
    },
    {
      id: 2,
      title: 'Toán Học Vui Nhộn',
      icon: '🎓',
      badge: '5',
      path: '/games',
    },
    {
      id: 3,
      title: 'Ghép Chữ Nhanh',
      icon: '🔤',
      badge: '5',
      path: '/games',
    },
  ];

  return (
    <div className="homepage">
      {/* Tier 1: Daily Quest Banner */}
      <div className="daily-quest-banner">
        <div className="quest-content">
          <div className="quest-illustration">
            <div className="student-avatar">
              <span className="avatar-icon">🧒</span>
              <span className="question-mark">❓</span>
            </div>
          </div>
          <div className="quest-info">
            <h2 className="quest-title">Nhiệm vụ hôm nay</h2>
            <p className="quest-description">Nhiệm vụ: Hoàn thành 5 bài toán đố</p>
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
            <div className="feature-icon">
              <span className="icon-large">📚</span>
              <span className="icon-small">🖩</span>
            </div>
            <h3 className="feature-title">Ôn Luyện</h3>
            <Link to="/practice">
              <GameButton variant="secondary" size="large" fullWidth onClick={playClick}>
                Vào học
              </GameButton>
            </Link>
          </div>
        </GameCard>

        <GameCard
          variant="gradient"
          hoverable
          className="exam-card"
        >
          <div className="feature-content">
            <div className="feature-icon">
              <span className="icon-large">📝</span>
              <span className="icon-small">✏️</span>
            </div>
            <h3 className="feature-title">Thi Thử</h3>
            <Link to="/exam/thu-thach">
              <GameButton variant="secondary" size="large" fullWidth onClick={playClick}>
                Vào học
              </GameButton>
            </Link>
          </div>
        </GameCard>
      </div>

      {/* Tier 3: Entertainment */}
      <div className="entertainment-section">
        <h2 className="section-title">Giải lao xíu nào!</h2>
        <div className="games-grid">
          {featuredGames.map((game) => (
            <Link to={game.path} key={game.id}>
              <GameCard
                hoverable
                className="mini-game-card"
                onClick={playClick}
              >
                <div className="game-badge">{game.badge}</div>
                <div className="game-icon">{game.icon}</div>
                <h4 className="game-title">{game.title}</h4>
              </GameCard>
            </Link>
          ))}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="guest-message">
          <p>
            <strong>Chế độ khách:</strong> Bạn có thể xem và chơi game mà không cần đăng nhập.
            Đăng nhập để lưu điểm số và xem lịch sử!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
