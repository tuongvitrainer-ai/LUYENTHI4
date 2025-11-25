import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { loginAPI, getMeAPI } from '../services/authService';
import { submitGameResultAPI } from '../services/gameService';
import { getPendingRewards, clearPendingRewards, getTotalPendingStars } from '../services/pendingRewardService';

// Tạo Context
const AuthContext = createContext();

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Khi App khởi động: Kiểm tra token và lấy thông tin user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await getMeAPI();
          if (response.success) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Hàm xử lý pending rewards sau khi đăng nhập
  const processPendingRewards = async () => {
    const pendingRewards = getPendingRewards();

    if (pendingRewards.length === 0) {
      return;
    }

    const totalStars = getTotalPendingStars();
    message.loading(`Đang xử lý ${pendingRewards.length} phần thưởng chờ (${totalStars} sao)...`, 0);

    let successCount = 0;
    let failCount = 0;

    for (const reward of pendingRewards) {
      try {
        await submitGameResultAPI(reward.gameId, {
          answers: reward.answers || [],
          score: reward.score,
        });
        successCount++;
      } catch (error) {
        console.error('Error submitting pending reward:', error);
        failCount++;
      }
    }

    // Xóa tất cả pending rewards sau khi xử lý
    clearPendingRewards();

    // Đóng loading message
    message.destroy();

    // Thông báo kết quả
    if (successCount > 0) {
      message.success(`Đã nhận ${totalStars} sao từ ${successCount} phần thưởng!`, 5);
    }

    if (failCount > 0) {
      message.warning(`Có ${failCount} phần thưởng không thể xử lý`, 3);
    }
  };

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);

      if (response.success && response.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.token);

        // Set state user
        setUser(response.user);
        setIsAuthenticated(true);

        // Thông báo thành công
        message.success(response.message || 'Đăng nhập thành công!');

        // Xử lý pending rewards (nếu có)
        await processPendingRewards();

        // Chuyển hướng về trang chủ
        navigate('/');

        return { success: true };
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại');
      return { success: false, error };
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');

    // Reset state
    setUser(null);
    setIsAuthenticated(false);

    // Thông báo
    message.success('Đăng xuất thành công!');

    // Chuyển hướng về trang login
    navigate('/login');
  };

  // Giá trị context cung cấp cho các component con
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
