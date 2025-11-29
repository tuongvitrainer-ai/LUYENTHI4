import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const HomePageSimple = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '32px' }}>Trang Chủ - Test</h1>
      <p style={{ color: 'black' }}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p style={{ color: 'black' }}>User: {user?.username || 'Guest'}</p>

      <div style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #4DA6FF 100%)',
        padding: '40px',
        borderRadius: '16px',
        marginTop: '20px',
        color: 'white'
      }}>
        <h2>Nhiệm vụ hôm nay</h2>
        <p>Nhiệm vụ: Hoàn thành 5 bài toán đố</p>
        <Button type="primary" size="large" icon={<ThunderboltOutlined />}>
          Bắt đầu ngay
        </Button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: 'black' }}>Ôn Luyện</h3>
        <Link to="/practice">
          <Button type="default" size="large">Vào học</Button>
        </Link>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: 'black' }}>Thi Thử</h3>
        <Link to="/exam/thu-thach">
          <Button type="default" size="large">Vào học</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePageSimple;
