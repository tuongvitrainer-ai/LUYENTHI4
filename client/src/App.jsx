import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import { HomeOutlined, TrophyOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const { Header, Content, Footer, Sider } = Layout;

// Các trang giả lập (Placeholder Pages)
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="p-5">
      <h1>🏠 Trang Chủ - Bản đồ Học Tập</h1>
      {!isAuthenticated && (
        <p>
          <strong>Chế độ khách:</strong> Bạn có thể xem và chơi game mà không cần đăng nhập.
          Đăng nhập để lưu điểm số và xem lịch sử!
        </p>
      )}
      {isAuthenticated && (
        <p>Xin chào, <strong>{user?.username}</strong>! Chúc bạn học tập vui vẻ!</p>
      )}
    </div>
  );
};

const LeaderboardPage = () => <div className="p-5"><h1>🏆 Bảng Xếp Hạng</h1></div>;

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div className="p-5">
      <h1>👤 Hồ sơ Cá nhân</h1>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Full Name: {user?.fullName || 'Chưa cập nhật'}</p>
    </div>
  );
};

// Main Layout Component (Hoạt động cho cả guest và authenticated user)
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Menu items cho user đã đăng nhập
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Hồ sơ cá nhân</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TrophyOutlined />}>
            <Link to="/leaderboard">Xếp hạng</Link>
          </Menu.Item>
          {isAuthenticated && (
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/profile">Hồ sơ</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {isAuthenticated ? (
            // User đã đăng nhập: Hiển thị avatar và dropdown
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                <span>{user?.username}</span>
              </div>
            </Dropdown>
          ) : (
            // Guest: Hiển thị nút Login và Register
            <Space>
              <Link to="/login">
                <Button type="default" icon={<LoginOutlined />}>
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Đăng ký</Button>
              </Link>
            </Space>
          )}
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            {/* Profile route - Bảo vệ bằng ProtectedRoute */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Luyện Thi ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Layout - Public access (không cần đăng nhập) */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
