import { Navigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProtectedAdminRoute Component
 * Bảo vệ các route chỉ dành cho Admin
 * - Nếu chưa đăng nhập -> Chuyển hướng về /login
 * - Nếu đã đăng nhập nhưng không phải Admin -> Hiển thị lỗi 403
 */
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // Đang loading -> Hiển thị spinner
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển hướng về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng không phải Admin -> Hiển thị lỗi 403
  if (user?.role !== 'admin') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  // Đã đăng nhập và là Admin -> Hiển thị nội dung
  return children;
};

export default ProtectedAdminRoute;
