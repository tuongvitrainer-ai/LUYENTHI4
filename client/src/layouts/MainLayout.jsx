import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, Space, Badge, Drawer } from 'antd';
import {
  HomeOutlined,
  TrophyOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  StarOutlined,
  FireOutlined,
  CustomerServiceOutlined,
  EditOutlined,
  ShoppingOutlined,
  GiftOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      icon: <EditOutlined />,
      label: 'Rèn luyện',
      path: '/practice',
    },
    {
      key: '3',
      icon: <CustomerServiceOutlined />,
      label: 'Chơi mà học',
      path: '/games',
    },
    {
      key: '4',
      icon: <BookOutlined />,
      label: 'Ebook',
      path: '/ebook',
    },
    {
      key: '5',
      icon: <TrophyOutlined />,
      label: 'Bảng vàng',
      path: '/leaderboard',
    },
    {
      key: '6',
      icon: <GiftOutlined />,
      label: 'Phần thưởng',
      path: '/shop',
    },
  ];

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🐟</span>
            {!collapsed && <span className="logo-text">Vượt Vũ Môn</span>}
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
          {isAuthenticated && user && (
            <div className={`student-card ${collapsed ? 'collapsed' : ''}`}>
              <Avatar
                size={collapsed ? 40 : 64}
                icon={<UserOutlined />}
                src={user?.avatarUrl}
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              {!collapsed && (
                <div className="student-info">
                  <div className="student-name">{user?.fullName || user?.username || 'Bé An'}</div>
                  <div className="student-level">
                    <span className="level-text">Level {user?.level || 5}</span>
                  </div>
                  <div className="level-progress">
                    <div className="progress-bar" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            {/* Hamburger Menu Button - Chỉ hiển thị trên mobile */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <MenuOutlined style={{ fontSize: 24 }} />
            </button>
          </div>

          <div className="header-right">
            {isAuthenticated ? (
              // User đã đăng nhập
              <Space size="large">
                {/* Streak Counter */}
                <div className="header-streak">
                  <FireOutlined style={{ fontSize: 20, color: '#ff4500' }} />
                  <span className="streak-count">{user?.streak || 12} ngày</span>
                </div>

                {/* Stars Display */}
                {user?.wallet && (
                  <div className="header-stars">
                    <StarOutlined style={{ fontSize: 20, color: '#ffd700' }} />
                    <span className="stars-count">{user.wallet.stars || 350} sao</span>
                  </div>
                )}

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <div className="user-dropdown">
                    <Avatar
                      icon={<UserOutlined />}
                      src={user?.avatarUrl}
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
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

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="mobile-drawer-header">
            <span className="logo-icon">🐟</span>
            <span className="logo-text">Vượt Vũ Môn</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="mobile-menu-drawer"
        width={280}
      >
        <nav className="mobile-nav">
          <ul className="mobile-menu">
            {menuItems.map((item) => (
              <li key={item.key} className="mobile-menu-item">
                <Link
                  to={item.path}
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Footer with Student Card */}
        {isAuthenticated && user && (
          <div className="mobile-student-card">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={user?.avatarUrl}
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <div className="student-info">
              <h4>{user?.fullName || user?.username || 'Học sinh'}</h4>
              <p className="student-level">Level {user?.level || 1}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${user?.progress || 45}%` }}
                />
              </div>
              <p className="progress-text">{user?.progress || 45}% hoàn thành</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MainLayout;
