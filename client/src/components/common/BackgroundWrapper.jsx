import React from 'react';
import './BackgroundWrapper.css';

/**
 * BackgroundWrapper Component
 *
 * Hiển thị background với chủ đề "Đại dương và sóng biển"
 * với hiệu ứng làm mờ và lớp phủ màu xanh da trời
 */
const BackgroundWrapper = () => {
  return (
    <div className="background-wrapper">
      {/* Hình ảnh background với hiệu ứng blur */}
      <div
        className="background-image"
        style={{
          backgroundImage: 'url(/assets/ocean-waves.svg)',
        }}
      />

      {/* Lớp phủ màu xanh da trời bán trong suốt */}
      <div className="background-overlay" />
    </div>
  );
};

export default BackgroundWrapper;
