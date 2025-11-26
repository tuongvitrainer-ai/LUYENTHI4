import React from 'react';

const OnTap1 = () => {
  // Đường dẫn đến file HTML trong thư mục public
  // Lưu ý: Không cần chữ 'public' trong đường dẫn
  const gameUrl = "/learn/lop2/toan/ontap1/index.html";

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tiêu đề bài học (Optional) */}
      <h2 className="text-xl font-bold mb-4 text-[var(--primary-color)]">
        Ôn tập Toán Lớp 2
      </h2>

      {/* Khung chứa Game/Bài học */}
      <div className="flex-1 border-2 border-[var(--primary-color)] rounded-xl overflow-hidden shadow-md bg-white">
        <iframe 
          src={gameUrl}
          title="Bài tập Toán"
          className="w-full h-full"
          style={{ 
            border: 'none', 
            minHeight: '600px' // Chiều cao tối thiểu để không bị thụt
          }} 
        />
      </div>
    </div>
  );
};

export default OnTap1;