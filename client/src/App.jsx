import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GameListPage from './pages/game/GameListPage';
import GamePlayPage from './pages/game/GamePlayPage';
import SoundDemo from './components/demo/SoundDemo';

// Import ở đầu file
import ThuThachKhoiDau from './pages/learns/exam/ThuThachKhoiDau';
import OnTap1 from './pages/learn/lop2/toan/OnTap1';

// Import Admin Pages
import Dashboard from './pages/admin/Dashboard';
import UserManager from './pages/admin/UserManager';
import LessonManager from './pages/admin/LessonManager';
import LessonEditor from './pages/admin/LessonEditor';
import Settings from './pages/admin/Settings';


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

const LeaderboardPage = () => (
  <div style={{ padding: '2rem' }}>
    <h1>🏆 Bảng Xếp Hạng</h1>
    <p>Tính năng đang được phát triển...</p>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>👤 Hồ sơ Cá nhân</h1>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <p><strong>Full Name:</strong> {user?.fullName || 'Chưa cập nhật'}</p>
      <p><strong>Coins:</strong> {user?.wallet?.coins || 0}</p>
      <p><strong>Stars:</strong> {user?.wallet?.stars || 0}</p>
      <p><strong>Accumulated Points:</strong> {user?.wallet?.accumulatedPoints || 0}</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth pages - No Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes - Wrapped in AdminLayout & ProtectedAdminRoute */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManager />} />
            <Route path="lessons" element={<LessonManager />} />
            <Route path="lessons/new" element={<LessonEditor />} />
            <Route path="lessons/edit/:id" element={<LessonEditor />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* All other routes - Wrapped in MainLayout */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/games" element={<GameListPage />} />
                  <Route path="/game/:id" element={<GamePlayPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/demo/sound" element={<SoundDemo />} />

                  {/* Exam Routes */}
                  <Route path="/exam/thu-thach" element={<ThuThachKhoiDau />} />

                  <Route path="/learn/lop2/toan/ontap1" element={<OnTap1 />} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
