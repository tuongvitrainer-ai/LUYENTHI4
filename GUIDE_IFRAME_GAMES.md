# 📘 QUY TRÌNH TÍCH HỢP GAME HTML5 ĐỘC LẬP (IFRAME)

## 📋 Tổng quan

Tài liệu này hướng dẫn cách tích hợp game HTML5 độc lập vào hệ thống Luyện Thi bằng iframe.

---

## 🎯 Khi nào dùng Iframe?

### ✅ **SỬ DỤNG Iframe khi:**
- Game đã có sẵn dạng HTML/CSS/JS độc lập
- Game được phát triển bởi bên thứ 3
- Game cần chạy trong môi trường sandbox riêng
- Muốn tách biệt hoàn toàn logic game với React app

### ❌ **KHÔNG dùng Iframe khi:**
- Game cần tương tác sâu với React state
- Cần share data/events giữa game và app
- Game nhỏ, đơn giản, viết bằng React components
- Cần SEO tốt cho nội dung game

---

## 📁 Cấu trúc thư mục

```
LUYENTHI4/
├── client/
│   ├── public/
│   │   └── learn/           # ← Tất cả game HTML5 ở đây
│   │       └── lop2/
│   │           └── toan/
│   │               └── ontap1/
│   │                   ├── index.html
│   │                   ├── style.css
│   │                   ├── script.js
│   │                   └── assets/
│   │                       ├── images/
│   │                       └── sounds/
│   └── src/
│       ├── pages/
│       │   └── learn/
│       │       ├── IframeGame.css       # ← CSS dùng chung
│       │       └── lop2/
│       │           └── toan/
│       │               └── OnTap1.jsx   # ← Wrapper component
│       └── App.jsx
```

---

## 🔧 QUY TRÌNH TÍCH HỢP 5 BƯỚC

### **BƯỚC 1: Chuẩn bị Game HTML5**

1. **Đặt game vào thư mục `public/learn/`:**
   ```bash
   client/public/learn/lop2/toan/ontap1/
   ```

2. **Kiểm tra file `index.html` có đầy đủ:**
   ```html
   <!DOCTYPE html>
   <html lang="vi">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Ôn tập Toán Lớp 2</title>
     <link rel="stylesheet" href="style.css">
   </head>
   <body>
     <!-- Game content -->
     <script src="script.js"></script>
   </body>
   </html>
   ```

3. **Test game độc lập:**
   ```
   http://localhost:5173/learn/lop2/toan/ontap1/index.html
   ```

---

### **BƯỚC 2: Tạo Wrapper Component**

1. **Tạo file component:**
   ```bash
   client/src/pages/learn/lop2/toan/OnTap1.jsx
   ```

2. **Copy template sau:**

```jsx
import React, { useState } from 'react';
import '../IframeGame.css';

const OnTap1 = () => {
  const [loading, setLoading] = useState(true);

  // ⚠️ QUAN TRỌNG: Đường dẫn phải bắt đầu bằng /learn/
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
          Ôn tập Toán Lớp 2 - Bài 1
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
```

---

### **BƯỚC 3: Đăng ký Route trong App.jsx**

1. **Import component:**
   ```jsx
   import OnTap1 from './pages/learn/lop2/toan/OnTap1';
   ```

2. **Thêm route:**
   ```jsx
   <Route path="/learn/lop-2/toan/on-tap-1" element={<OnTap1 />} />
   ```

**Ví dụ đầy đủ:**

```jsx
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main layout routes */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />

                {/* ← Thêm route game HTML5 ở đây */}
                <Route
                  path="/learn/lop-2/toan/on-tap-1"
                  element={<OnTap1 />}
                />

              </Routes>
            </MainLayout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
```

---

### **BƯỚC 4: Test và Debug**

1. **Khởi động dev server:**
   ```bash
   cd client
   npm run dev
   ```

2. **Truy cập URL:**
   ```
   http://localhost:5173/learn/lop-2/toan/on-tap-1
   ```

3. **Kiểm tra:**
   - ✅ Iframe hiển thị full màn hình (không bị nhỏ)
   - ✅ Game load đầy đủ (hình ảnh, âm thanh)
   - ✅ Responsive trên mobile/tablet
   - ✅ Không có lỗi CORS trong console

4. **Debug các lỗi thường gặp:**

   **Lỗi: Iframe bị nhỏ**
   - Kiểm tra CSS `.iframe-game-wrapper` có đúng không
   - Kiểm tra `IframeGame.css` đã được import chưa

   **Lỗi: Game không load**
   - Kiểm tra đường dẫn `gameUrl` có đúng không
   - Kiểm tra file `index.html` có tồn tại trong `public/learn/` không
   - Xem console có lỗi 404 không

   **Lỗi: CORS**
   - Game phải ở trong `public/learn/`, không ở nơi khác
   - Không dùng đường dẫn tuyệt đối (http://...)

---

### **BƯỚC 5: Tạo Reusable Component (Tùy chọn)**

Nếu có nhiều game, tạo component tái sử dụng:

```jsx
// src/components/IframeGameWrapper.jsx
import React, { useState } from 'react';
import './IframeGame.css';

const IframeGameWrapper = ({ gameUrl, title, icon = '📝' }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="iframe-game-wrapper">
      <div className="iframe-game-title">
        <h2>
          <span>{icon}</span>
          {title}
        </h2>
      </div>

      <div className="iframe-game-container">
        {loading && (
          <div className="iframe-game-loading">
            <div className="iframe-game-loading-spinner">⏳</div>
            <p>Đang tải bài học...</p>
          </div>
        )}

        <iframe
          src={gameUrl}
          title={title}
          onLoad={() => setLoading(false)}
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default IframeGameWrapper;
```

**Sử dụng:**

```jsx
import IframeGameWrapper from '@/components/IframeGameWrapper';

const OnTap1 = () => (
  <IframeGameWrapper
    gameUrl="/learn/lop2/toan/ontap1/index.html"
    title="Ôn tập Toán Lớp 2 - Bài 1"
    icon="📝"
  />
);
```

---

## 🎨 Tùy chỉnh CSS

### **Thay đổi màu sắc title bar:**

```css
.iframe-game-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### **Thêm border cho game:**

```css
.iframe-game-container {
  border: 4px solid var(--color-primary);
  border-radius: 12px;
}
```

### **Responsive cho tablet:**

```css
@media (max-width: 1024px) {
  .iframe-game-wrapper {
    height: calc(100vh - 50px);
  }
}
```

---

## 🚀 Best Practices

### **1. Naming Convention:**
- **File game:** `public/learn/lop{X}/{mon}/{bai}/index.html`
- **Component:** `OnTap{X}.jsx`, `BaiTap{X}.jsx`
- **Route:** `/learn/lop-{x}/{mon}/{bai}-{id}`

### **2. Performance:**
```jsx
// Lazy load component
const OnTap1 = React.lazy(() => import('./pages/learn/lop2/toan/OnTap1'));

// Use in route
<Route
  path="/learn/lop-2/toan/on-tap-1"
  element={<Suspense fallback={<Loading />}><OnTap1 /></Suspense>}
/>
```

### **3. SEO:**
```jsx
// Add Helmet for metadata
import { Helmet } from 'react-helmet';

const OnTap1 = () => (
  <>
    <Helmet>
      <title>Ôn tập Toán Lớp 2 - Bài 1 | Luyện Thi</title>
      <meta name="description" content="Bài tập ôn tập Toán lớp 2..." />
    </Helmet>
    <IframeGameWrapper ... />
  </>
);
```

### **4. Analytics:**
```jsx
useEffect(() => {
  // Track game open
  analytics.track('game_opened', {
    game_id: 'ontap-toan-lop2-bai1',
    timestamp: Date.now()
  });
}, []);
```

---

## 📊 Checklist tích hợp

```
[ ] Game HTML5 đã đặt trong public/learn/
[ ] Đường dẫn gameUrl đúng format /learn/...
[ ] Component wrapper đã tạo
[ ] IframeGame.css đã import
[ ] Route đã đăng ký trong App.jsx
[ ] Test game load thành công
[ ] Test responsive mobile/tablet
[ ] Không có lỗi console
[ ] Title bar hiển thị đúng
[ ] Loading state hoạt động
```

---

## 🆘 Troubleshooting

### **Game không hiển thị (blank screen):**
1. Mở DevTools → Console → Xem lỗi
2. Kiểm tra Network tab → Xem file nào 404
3. Kiểm tra đường dẫn trong `index.html` (phải dùng relative path)

### **Game bị nhỏ:**
1. Kiểm tra CSS `.iframe-game-wrapper` có `margin: calc(-1 * var(--spacing-xl))`
2. Kiểm tra `.iframe-game-container` có `flex: 1`
3. Kiểm tra iframe có `width: 100%; height: 100%`

### **CORS error:**
1. Game phải ở trong `public/`, không dùng external URL
2. Nếu bắt buộc dùng external, cần CORS proxy

---

## 📚 Ví dụ thực tế

**Ví dụ 1: Game Toán Lớp 3**
```
File: public/learn/lop3/toan/phep-cong/index.html
Component: OnTapPhepCong.jsx
Route: /learn/lop-3/toan/phep-cong
```

**Ví dụ 2: Game Tiếng Việt Lớp 4**
```
File: public/learn/lop4/tieng-viet/chu-cai/index.html
Component: HocChuCai.jsx
Route: /learn/lop-4/tieng-viet/chu-cai
```

---

## ✅ Kết luận

Quy trình 5 bước:
1. ✅ Đặt game vào `public/learn/`
2. ✅ Tạo wrapper component
3. ✅ Đăng ký route trong `App.jsx`
4. ✅ Test và debug
5. ✅ (Optional) Tạo reusable component

**Lưu ý quan trọng:**
- Iframe dùng cho game HTML5 độc lập
- CSS `.iframe-game-wrapper` để fullscreen
- Route naming: `/learn/lop-{x}/{mon}/{bai}`
