import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Bảo vệ các route chỉ dành cho user đã đăng nhập
 * Nếu chưa đăng nhập -> Chuyển hướng về /login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  // Đã đăng nhập -> Hiển thị nội dung
  return children;
};

export default ProtectedRoute;
