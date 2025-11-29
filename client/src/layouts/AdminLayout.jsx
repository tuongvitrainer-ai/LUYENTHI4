import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items cho sidebar
  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý Users</Link>,
    },
    {
      key: '/admin/lessons',
      icon: <BookOutlined />,
      label: <Link to="/admin/lessons">Quản lý Bài học</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  // Dropdown menu cho user
  const userMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Về trang chủ',
      onClick: () => navigate('/'),
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

  // Lấy selected key từ current path
  const getSelectedKey = () => {
    const path = location.pathname;
    // Nếu đang ở /admin/lessons/edit/:id thì vẫn highlight /admin/lessons
    if (path.startsWith('/admin/lessons')) return '/admin/lessons';
    if (path.startsWith('/admin/users')) return '/admin/users';
    if (path.startsWith('/admin/settings')) return '/admin/settings';
    return '/admin';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? '📊' : '📊 Admin Panel'}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Toggle Button */}
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                cursor: 'pointer',
                marginRight: 24,
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>

            {/* Breadcrumb hoặc title */}
            <h2 style={{ margin: 0, fontSize: 18 }}>Admin Dashboard</h2>
          </div>

          {/* User Info */}
          <Space size="middle">
            {user?.wallet && (
              <Badge count={user.wallet.stars || 0} showZero overflowCount={999}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    borderRadius: 8,
                  }}
                >
                  <StarOutlined style={{ fontSize: 18, color: '#ffd700' }} />
                </div>
              </Badge>
            )}

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  src={user?.avatarUrl}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <span style={{ fontWeight: 500 }}>{user?.username}</span>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          Luyện Thi Admin Panel © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
