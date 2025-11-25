import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spin, message, Button, Tag } from 'antd';
import { TrophyOutlined, PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { getAllGamesAPI } from '../../services/gameService';
import { useAuth } from '../../context/AuthContext';

const GameListPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const response = await getAllGamesAPI();
        if (response.success) {
          setGames(response.games);
        } else {
          message.error('Không thể tải danh sách games');
        }
      } catch (error) {
        console.error('Load games error:', error);
        message.error(error.message || 'Không thể tải danh sách games');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" tip="Đang tải danh sách games..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h1>
          <TrophyOutlined /> Danh sách Games
        </h1>
        {!isAuthenticated && (
          <Tag color="orange">Chế độ khách: Đăng nhập để lưu điểm</Tag>
        )}
      </div>

      {games.length === 0 ? (
        <Card>
          <p>Chưa có game nào. Vui lòng quay lại sau!</p>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {games.map((game) => (
            <Col key={game.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    Chơi ngay
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={game.title}
                  description={
                    <div>
                      <p style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {game.description || 'Không có mô tả'}
                      </p>
                      <div style={{ marginTop: 10 }}>
                        {game.duration_minutes && (
                          <Tag icon={<ClockCircleOutlined />}>
                            {game.duration_minutes} phút
                          </Tag>
                        )}
                        {game.grade_name && (
                          <Tag icon={<FileTextOutlined />}>
                            {game.grade_name}
                          </Tag>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default GameListPage;
