import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet là nơi nội dung thay đổi sẽ hiện ra
// Import Sidebar và Header của bạn ở đây
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      {/* 1. Sidebar cố định bên trái */}
      <aside className="app-sidebar">
        {/* <Sidebar /> */}
        <div>Sidebar Menu</div>
      </aside>

      {/* 2. Khu vực chính bên phải */}
      <main className="app-main">
        {/* 2.1 Header cố định ở trên */}
        <header className="app-header">
          {/* <Header /> */}
          <div>Top Menu</div>
        </header>

        {/* 2.2 Nội dung thay đổi (Game/Bài học sẽ hiện ở đây) */}
        <div className="app-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default MainLayout;