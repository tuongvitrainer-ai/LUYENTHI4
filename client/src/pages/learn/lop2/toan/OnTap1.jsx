import React, { useState } from 'react';
import '../../IframeGame.css';

const OnTap1 = () => {
  const [loading, setLoading] = useState(true);

  // Đường dẫn tới game HTML5 độc lập
  const gameUrl = "/learn/lop2/toan/ontap1/index.html";

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="iframe-game-wrapper">
      {/* Title bar */}
      <div className="iframe-game-title">
        <h2>
          <span>📝</span>
          Ôn tập Toán Lớp 2
        </h2>
      </div>

      {/* Game container */}
      <div className="iframe-game-container">
        {loading && (
          <div className="iframe-game-loading">
            <div className="iframe-game-loading-spinner">⏳</div>
            <p>Đang tải bài học...</p>
          </div>
        )}

        <iframe
          src={gameUrl}
          title="Ôn tập Toán Lớp 2 - Bài 1"
          onLoad={handleIframeLoad}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default OnTap1;