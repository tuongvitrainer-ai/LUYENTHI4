import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import HomePageSimple from './pages/home/HomePageSimple';
import GameListPage from './pages/game/GameListPage';
import GamePlayPage from './pages/game/GamePlayPage';
import SoundDemo from './components/demo/SoundDemo';
import PracticePage from './pages/practice/PracticePage';

// bai tap
import ThuThachKhoiDau from './pages/learns/exam/ThuThachKhoiDau';

//LOP 2
import OnTap1 from './pages/learn/lop2/toan/OnTap1';
import Emg_Lop2_OnTap_HK1 from './pages/learns/english/EMG/Emg_Lop2_OnTap_HK1';

import Movers_Quest from './pages/learns/english/movers/vocabulary-movers1';
import MoversKnowledgeBase from './pages/learns/yle/movers';
import FlyersKnowledgeBase from './pages/learns/yle/flyers';
//game
import HangManTiengViet from './pages/game/words/HangManTiengViet';

// Import Admin Pages
import Dashboard from './pages/admin/Dashboard';
import UserManager from './pages/admin/UserManager';
import LessonManager from './pages/admin/LessonManager';
import LessonEditor from './pages/admin/LessonEditor';
import Settings from './pages/admin/Settings';

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

const ShopPage = () => (
  <div style={{ padding: '2rem' }}>
    <h1>🛒 Cửa Hàng</h1>
    <p>Tính năng đang được phát triển...</p>
  </div>
);

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
                  <Route path="/practice" element={<PracticePage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/demo/sound" element={<SoundDemo />} />

                  {/* Exam Routes */}
                  <Route path="/exam/thu-thach" element={<ThuThachKhoiDau />} />

                  {/* Lop 2 */}
                  <Route path="/learn/lop2/toan/ontap1" element={<OnTap1 />} />
                  <Route path="/lop2/emg/on-tap-hk1" element={<Emg_Lop2_OnTap_HK1 />} />
                  


                   {/* YLE Movers Knowledge Base */}
                  <Route path="/yle/movers" element={<MoversKnowledgeBase />} />
                  <Route path="/yle/flyers" element={<FlyersKnowledgeBase />} />
                  <Route path="/english/movers/vocabulary-movers" element={<Movers_Quest />} />


                  {/* GAMES */}
                  <Route path="/game/words/hangman-tv" element={<HangManTiengViet />} />

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
