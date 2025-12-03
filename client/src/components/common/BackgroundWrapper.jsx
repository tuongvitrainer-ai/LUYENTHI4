import React from 'react';
import './BackgroundWrapper.css';

/**
 * BackgroundWrapper Component
 *
 * Hiển thị background với chủ đề "Cá Chép Vượt Vũ Môn"
 * với hiệu ứng làm mờ và lớp phủ màu xanh dương
 */
const BackgroundWrapper = () => {
  return (
    <div className="background-wrapper">
      {/* Hình ảnh background với hiệu ứng blur */}
      <div
        className="background-image"
        style={{
          backgroundImage: 'url(/assets/koi-dragon-gate.svg)',
        }}
      />

      {/* Lớp phủ màu xanh dương bán trong suốt */}
      <div className="background-overlay" />
    </div>
  );
};

export default BackgroundWrapper;
