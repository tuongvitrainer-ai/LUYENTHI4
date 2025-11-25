import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import { HomeOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

// Các trang giả lập (Placeholder Pages)
const HomePage = () => <div className="p-5"><h1>🏠 Trang Chủ - Bản đồ Học Tập</h1></div>;
const LeaderboardPage = () => <div className="p-5"><h1>🏆 Bảng Xếp Hạng</h1></div>;
const ProfilePage = () => <div className="p-5"><h1>👤 Hồ sơ Cá nhân</h1></div>;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
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
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/profile">Hồ sơ</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '0 16px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Luyện Thi ©{new Date().getFullYear()} Created by You
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
