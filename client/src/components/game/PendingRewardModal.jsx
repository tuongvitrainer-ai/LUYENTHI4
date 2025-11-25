import { Modal, Button, Space } from 'antd';
import { TrophyOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * Modal hiển thị khi user chưa đăng nhập và có phần thưởng chờ
 * @param {boolean} visible - Hiển thị modal hay không
 * @param {function} onClose - Callback khi đóng modal
 * @param {Object} reward - { gameId, score, stars }
 */
const PendingRewardModal = ({ visible, onClose, reward }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <TrophyOutlined style={{ fontSize: 80, color: '#faad14' }} />

        <h2 style={{ marginTop: 20, fontSize: 24, color: '#faad14' }}>
          Chúc mừng bé!
        </h2>

        <div style={{ margin: '30px 0', fontSize: 18 }}>
          <div style={{ marginBottom: 15 }}>
            <span>Bé đạt được </span>
            <span style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
              {reward?.stars || 0} <StarOutlined />
            </span>
          </div>
          <div style={{ color: '#666' }}>
            Điểm số: <strong>{reward?.score || 0}</strong>
          </div>
        </div>

        <div
          style={{
            background: '#fff7e6',
            padding: '20px',
            borderRadius: 8,
            marginBottom: 20,
            border: '2px dashed #faad14',
          }}
        >
          <p style={{ margin: 0, fontSize: 16, color: '#d48806' }}>
            Hãy nhờ ba mẹ <strong>Đăng nhập/Đăng ký</strong> ngay
            <br />
            để bỏ số Sao này vào lợn đất nhé!
          </p>
        </div>

        <Space size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleLogin}
            style={{ flex: 1, height: 48 }}
          >
            Đăng nhập để nhận quà
          </Button>
          <Button
            size="large"
            onClick={handleRegister}
            style={{ flex: 1, height: 48 }}
          >
            Đăng ký mới
          </Button>
        </Space>

        <Button
          type="text"
          onClick={onClose}
          style={{ marginTop: 10 }}
        >
          Để sau
        </Button>
      </div>
    </Modal>
  );
};

export default PendingRewardModal;
