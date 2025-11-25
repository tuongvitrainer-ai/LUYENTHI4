import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { registerAPI } from '../../services/authService';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await registerAPI({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      if (response.success) {
        message.success(response.message || 'Đăng ký thành công!');
        // Chuyển hướng về trang login sau 1.5s
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        message.error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Register error:', error);
      message.error(error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>
              Đăng ký
            </Title>
            <Text type="secondary">Tạo tài khoản mới để bắt đầu!</Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên!',
                },
              ]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập!',
                },
                {
                  min: 3,
                  message: 'Tên đăng nhập phải có ít nhất 3 ký tự!',
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="username123"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
                {
                  min: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu của bạn"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng xác nhận mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: 44 }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Đã có tài khoản?{' '}
              <Link to="/login" style={{ fontWeight: 'bold' }}>
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default RegisterPage;
