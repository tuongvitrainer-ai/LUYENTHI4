import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Users"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Bài học"
              value={0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lượt thi"
              value={0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tăng trưởng"
              value={0}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Welcome Message */}
      <Card style={{ marginTop: 24 }}>
        <h2>Chào mừng đến với Admin Panel</h2>
        <p>
          Đây là trang quản trị của hệ thống Luyện Thi. Bạn có thể quản lý users, bài học,
          và xem các thống kê hệ thống.
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
