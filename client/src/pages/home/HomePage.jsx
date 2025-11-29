import { Link } from 'react-router-dom';
import { Button, Card, Row, Col } from 'antd';
import {
  RocketOutlined,
  EditOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  // Sample game data - replace with real data from API
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
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          className="quest-button"
        >
          Bắt đầu ngay
        </Button>
      </div>

      {/* Tier 2: Core Features - Ôn Luyện & Thi Thử */}
      <Row gutter={[24, 24]} className="core-features">
        <Col xs={24} md={12}>
          <Card className="feature-card practice-card" hoverable>
            <div className="card-icon">
              <span className="icon-large">📚</span>
              <span className="calculator-icon">🖩</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Ôn Luyện</h3>
              <Link to="/practice">
                <Button type="default" size="large" className="card-button">
                  Vào học
                </Button>
              </Link>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="feature-card exam-card" hoverable>
            <div className="card-icon">
              <span className="icon-large">📝</span>
              <span className="pen-icon">✏️</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Thi Thử</h3>
              <Link to="/exam/thu-thach">
                <Button type="default" size="large" className="card-button">
                  Vào học
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tier 3: Entertainment Section */}
      <div className="entertainment-section">
        <h2 className="section-title">Giải lao xíu nào!</h2>
        <Row gutter={[16, 16]} className="games-grid">
          {featuredGames.map((game) => (
            <Col xs={12} sm={8} md={6} key={game.id}>
              <Link to={game.path}>
                <Card className="game-card" hoverable>
                  <div className="game-icon">{game.icon}</div>
                  <div className="game-badge">{game.badge}</div>
                  <h4 className="game-title">{game.title}</h4>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Guest Message */}
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
