import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Alert, Space } from 'antd';
import { StarOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { getGameByIdAPI, submitGameResultAPI } from '../../services/gameService';
import { savePendingReward } from '../../services/pendingRewardService';
import PendingRewardModal from '../../components/game/PendingRewardModal';

const GamePlayPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingReward, setPendingReward] = useState(null);

  // Load game data
  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const response = await getGameByIdAPI(id);
        if (response.success) {
          setGame(response.game);
        } else {
          message.error('Không thể tải game');
        }
      } catch (error) {
        console.error('Load game error:', error);
        message.error(error.message || 'Không thể tải game');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  // Bắt đầu chơi game (Demo)
  const handleStartGame = () => {
    setIsPlaying(true);
    message.info('Bắt đầu chơi! (Đây là chế độ demo)');

    // Giả lập chơi game trong 3 giây
    setTimeout(() => {
      finishGame();
    }, 3000);
  };

  // Kết thúc game và tính điểm (Demo)
  const finishGame = () => {
    // Giả lập kết quả ngẫu nhiên
    const randomScore = Math.floor(Math.random() * 50) + 50; // 50-100
    const randomStars = Math.floor(randomScore / 20); // 2-5 sao

    const result = {
      gameId: parseInt(id),
      score: randomScore,
      stars: randomStars,
      answers: [], // Trong thực tế sẽ có danh sách câu trả lời
    };

    setGameResult(result);
    setIsPlaying(false);

    // Xử lý kết quả
    handleGameResult(result);
  };

  // Xử lý kết quả game
  const handleGameResult = async (result) => {
    if (isAuthenticated) {
      // User đã đăng nhập -> Submit ngay
      await submitResult(result);
    } else {
      // User chưa đăng nhập -> Lưu vào localStorage và hiển thị modal
      const saved = savePendingReward(result);
      if (saved) {
        setPendingReward(result);
        setShowPendingModal(true);
      }
    }
  };

  // Submit kết quả lên server
  const submitResult = async (result) => {
    try {
      const response = await submitGameResultAPI(result.gameId, {
        answers: result.answers,
        score: result.score,
      });

      if (response.success) {
        message.success(`Đã lưu kết quả! Bạn được ${result.stars} sao!`);
      }
    } catch (error) {
      console.error('Submit result error:', error);
      message.error(error.message || 'Không thể lưu kết quả');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" tip="Đang tải game..." />
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Alert message="Không tìm thấy game" type="error" />
        <Button onClick={() => navigate('/')} style={{ marginTop: 20 }}>
          Về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={
          <Space>
            <TrophyOutlined />
            {game.title}
          </Space>
        }
        extra={
          !isAuthenticated && (
            <Alert
              message="Chế độ khách: Đăng nhập để lưu điểm"
              type="info"
              showIcon
              banner
            />
          )
        }
      >
        {!isAuthenticated && (
          <Alert
            message="Bạn đang chơi ở chế độ khách"
            description="Điểm số sẽ được lưu tạm thời. Đăng nhập để nhận sao vào tài khoản!"
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        {isAuthenticated && (
          <Alert
            message={`Chào ${user?.username}!`}
            description="Điểm số của bạn sẽ được lưu vào tài khoản ngay sau khi hoàn thành."
            type="success"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <div style={{ marginTop: 20 }}>
          <p><strong>Mô tả:</strong> {game.description || 'Không có mô tả'}</p>
          <p><strong>Số câu hỏi:</strong> {game.totalQuestions || 0}</p>
          <p><strong>Thời gian:</strong> {game.duration_minutes || 0} phút</p>
        </div>

        <div style={{ marginTop: 30, textAlign: 'center' }}>
          {!isPlaying && !gameResult && (
            <Button
              type="primary"
              size="large"
              onClick={handleStartGame}
              icon={<TrophyOutlined />}
            >
              Bắt đầu chơi
            </Button>
          )}

          {isPlaying && (
            <div>
              <Spin size="large" />
              <p style={{ marginTop: 20 }}>Đang chơi game... (Demo 3s)</p>
            </div>
          )}

          {gameResult && (
            <div>
              <Card
                style={{
                  background: '#fff7e6',
                  border: '2px solid #faad14',
                  maxWidth: 400,
                  margin: '0 auto',
                }}
              >
                <h3>
                  <StarOutlined style={{ color: '#faad14' }} /> Kết quả
                </h3>
                <p style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {gameResult.stars} Sao
                </p>
                <p>Điểm số: {gameResult.score}</p>
              </Card>

              <Space style={{ marginTop: 20 }}>
                <Button onClick={() => setGameResult(null)}>Chơi lại</Button>
                <Button type="primary" onClick={() => navigate('/')}>
                  Về trang chủ
                </Button>
              </Space>
            </div>
          )}
        </div>
      </Card>

      {/* Modal cho pending reward */}
      <PendingRewardModal
        visible={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        reward={pendingReward}
      />
    </div>
  );
};

export default GamePlayPage;
