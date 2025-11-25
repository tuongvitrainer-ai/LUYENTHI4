import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Space, Badge } from 'antd';
import {
  HomeOutlined,
  TrophyOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      path: '/',
    },
    {
      key: '2',
      icon: <RocketOutlined />,
      label: 'Games',
      path: '/games',
    },
    {
      key: '3',
      icon: <TrophyOutlined />,
      label: 'Xếp hạng',
      path: '/leaderboard',
    },
    ...(isAuthenticated
      ? [
          {
            key: '4',
            icon: <UserOutlined />,
            label: 'Hồ sơ',
            path: '/profile',
          },
        ]
      : []),
  ];

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <RocketOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />
            {!collapsed && <span className="logo-text">Luyện Thi</span>}
          </div>
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu">
            {menuItems.map((item) => (
              <li key={item.key} className="menu-item">
                <Link to={item.path} className="menu-link">
                  <span className="menu-icon">{item.icon}</span>
                  {!collapsed && <span className="menu-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated && user?.wallet && (
            <div className={`wallet-info ${collapsed ? 'collapsed' : ''}`}>
              <div className="wallet-item">
                <StarOutlined style={{ color: '#ffd700' }} />
                {!collapsed && <span>{user.wallet.stars || 0}</span>}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            {/* Breadcrumb hoặc title có thể thêm ở đây */}
          </div>

          <div className="header-right">
            {isAuthenticated ? (
              // User đã đăng nhập
              <Space size="middle">
                {user?.wallet && (
                  <Badge count={user.wallet.stars || 0} showZero overflowCount={999}>
                    <div className="header-wallet">
                      <StarOutlined style={{ fontSize: 20, color: '#ffd700' }} />
                    </div>
                  </Badge>
                )}

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <div className="user-dropdown">
                    <Avatar
                      icon={<UserOutlined />}
                      src={user?.avatarUrl}
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                    <span className="username">{user?.username}</span>
                  </div>
                </Dropdown>
              </Space>
            ) : (
              // Guest
              <Space>
                <Button
                  type="default"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  Đăng ký
                </Button>
              </Space>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>

        {/* Footer */}
        <footer className="footer">
          <p>Luyện Thi © {new Date().getFullYear()} - Học tập vui vẻ mỗi ngày!</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
