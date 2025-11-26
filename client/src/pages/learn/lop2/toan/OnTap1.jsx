import React from 'react';

const OnTap1 = () => {
  // CẬP NHẬT ĐƯỜNG DẪN MỚI (Thêm chữ '/learn' vào đầu)
  // Cấu trúc thư mục: public/learn/lop2/toan/ontap1/index.html
  // Đường dẫn truy cập: /learn/lop2/toan/ontap1/index.html
  const gameUrl = "/learn/lop2/toan/ontap1/index.html";

  return (
    // Sử dụng h-[calc(100vh-xxx)] để set chiều cao vừa khít màn hình trừ đi Header
    // Giả sử Header + Padding khoảng 100px-120px
    <div className="w-full flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
      
      {/* Tiêu đề bài học */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl font-bold text-[var(--primary-color)] flex items-center gap-2">
          <span>📝</span> Ôn tập Toán Lớp 2 - Bài 1
        </h2>
      </div>

      {/* Khung chứa Game/Bài học */}
      {/* flex-1 sẽ giúp nó chiếm toàn bộ khoảng trống còn lại */}
      <div className="flex-1 border-2 border-[var(--primary-color)] rounded-xl overflow-hidden shadow-md bg-white relative">
        <iframe 
          src={gameUrl}
          title="Bài tập Toán"
          className="w-full h-full absolute inset-0" // absolute inset-0 giúp iframe bung hết cỡ khung cha
          style={{ 
            border: 'none',
            // Xóa minHeight cứng để nó tự co giãn theo màn hình
          }} 
        />
      </div>
    </div>
  );
};

export default OnTap1;