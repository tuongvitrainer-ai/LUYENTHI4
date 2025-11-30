# 📘 HƯỚNG DẪN THAY ĐỔI GIAO DIỆN - DÀNH CHO NGƯỜI MỚI BẮT ĐẦU

> **Mục đích**: Hướng dẫn chi tiết cách thay đổi màu sắc, hình ảnh, logo, kích thước các thành phần trên trang web **Vượt Vũ Môn**.

---

## 📋 MỤC LỤC

1. [Thay Đổi Logo](#1-thay-đổi-logo)
2. [Thay Đổi Màu Sắc Chủ Đạo](#2-thay-đổi-màu-sắc-chủ-đạo)
3. [Thay Đổi Hình Ảnh Banner](#3-thay-đổi-hình-ảnh-banner)
4. [Thay Đổi Kích Thước Banner](#4-thay-đổi-kích-thước-banner)
5. [Thay Đổi Hình Minh Họa (Emoji → Ảnh)](#5-thay-đổi-hình-minh-họa-emoji--ảnh)
6. [Thay Đổi Font Chữ](#6-thay-đổi-font-chữ)
7. [Thay Đổi Game Cards](#7-thay-đổi-game-cards)
8. [Thêm Ảnh Nền (Background)](#8-thêm-ảnh-nền-background)

---

## 🛠️ CÔNG CỤ CẦN THIẾT

- **Trình soạn thảo code**: Visual Studio Code (VS Code) - [Download tại đây](https://code.visualstudio.com/)
- **Trình duyệt web**: Chrome hoặc Edge
- **Ảnh muốn thay**: Định dạng PNG, JPG, SVG

---

## 1️⃣ THAY ĐỔI LOGO

### 🎯 Mục tiêu
Thay logo cá chép 🐟 thành logo riêng của bạn.

### 📂 File cần chỉnh sửa
```
📁 client/src/layouts/MainLayout.jsx
```

### 🔧 Cách làm

#### **Option 1: Thay bằng Emoji khác**

**Bước 1**: Mở file `MainLayout.jsx`

**Bước 2**: Tìm dòng này (khoảng dòng 85):
```jsx
<span className="logo-icon">🐟</span>
```

**Bước 3**: Thay emoji 🐟 bằng emoji bạn thích:
```jsx
<span className="logo-icon">🎓</span>  <!-- Mũ tốt nghiệp -->
<span className="logo-icon">📚</span>  <!-- Sách -->
<span className="logo-icon">🌟</span>  <!-- Ngôi sao -->
<span className="logo-icon">🚀</span>  <!-- Tên lửa -->
```

**Bước 4**: Lưu file (Ctrl + S)

---

#### **Option 2: Thay bằng Logo Hình Ảnh**

**Bước 1**: Chuẩn bị logo
- Tải logo về máy (file .png hoặc .svg)
- Đặt tên: `logo.png`
- Kích thước khuyến nghị: 100x100 pixels

**Bước 2**: Đặt logo vào thư mục
```
📁 client/src/assets/images/logo.png
```

**Bước 3**: Mở file `MainLayout.jsx`, tìm dòng:
```jsx
<span className="logo-icon">🐟</span>
```

**Bước 4**: Thay bằng:
```jsx
<img
  src="/src/assets/images/logo.png"
  alt="Logo"
  className="logo-icon"
  style={{ width: '40px', height: '40px' }}
/>
```

**Bước 5**: Lưu file

---

### 🎨 Thay Đổi Kích Thước Logo

Mở file:
```
📁 client/src/layouts/MainLayout.css
```

Tìm dòng (khoảng dòng 45):
```css
.logo-icon {
  font-size: 28px;
}
```

Thay đổi:
```css
.logo-icon {
  font-size: 36px;  /* Logo lớn hơn */
}
```

---

## 2️⃣ THAY ĐỔI MÀU SẮC CHỦ ĐẠO

### 📂 File cần chỉnh sửa
```
📁 client/src/index.css
```

### 🎨 Các màu hiện tại

Mở file `index.css`, tìm phần đầu (từ dòng 1-20):

```css
:root {
  /* Màu chính - Xanh Dương */
  --color-primary: #4DA6FF;          /* Xanh dương chính */
  --color-primary-light: #87CEEB;    /* Xanh nhạt */
  --color-primary-dark: #3182CE;     /* Xanh đậm */

  /* Màu phụ */
  --color-accent: #FFA500;           /* Cam (nút bấm) */
  --color-gold: #FFD700;             /* Vàng kim (sao) */

  /* Màu nền */
  --bg-primary: #F0F8FF;             /* Nền trắng xanh */
}
```

### 🔧 Cách thay đổi

#### **Ví dụ 1: Đổi sang theme màu Hồng**

```css
:root {
  --color-primary: #FF69B4;          /* Hồng chính */
  --color-primary-light: #FFB6C1;    /* Hồng nhạt */
  --color-primary-dark: #C71585;     /* Hồng đậm */

  --color-accent: #FFD700;           /* Vàng */
  --color-gold: #FFA500;             /* Cam */

  --bg-primary: #FFF0F5;             /* Nền hồng nhạt */
}
```

#### **Ví dụ 2: Đổi sang theme màu Xanh Lá**

```css
:root {
  --color-primary: #4CAF50;          /* Xanh lá chính */
  --color-primary-light: #81C784;    /* Xanh lá nhạt */
  --color-primary-dark: #388E3C;     /* Xanh lá đậm */

  --color-accent: #FFC107;           /* Vàng */
  --color-gold: #FF9800;             /* Cam */

  --bg-primary: #F1F8E9;             /* Nền xanh lá nhạt */
}
```

#### **Ví dụ 3: Đổi sang theme màu Tím**

```css
:root {
  --color-primary: #9C27B0;          /* Tím chính */
  --color-primary-light: #CE93D8;    /* Tím nhạt */
  --color-primary-dark: #7B1FA2;     /* Tím đậm */

  --color-accent: #FFD54F;           /* Vàng */
  --color-gold: #FFA726;             /* Cam */

  --bg-primary: #F3E5F5;             /* Nền tím nhạt */
}
```

### 🌈 Tool chọn màu online
- **Google Color Picker**: Tìm "color picker" trên Google
- **Coolors.co**: Tạo bảng màu tự động
- **Adobe Color**: color.adobe.com

---

## 3️⃣ THAY ĐỔI HÌNH ẢNH BANNER

### 📂 File cần chỉnh sửa
```
📁 client/src/pages/home/HomePage.jsx
📁 client/src/pages/home/HomePage.css
```

### 🔧 Thêm ảnh nền banner

**Bước 1**: Chuẩn bị ảnh
- Tải ảnh về (ví dụ: ocean-wave.jpg)
- Kích thước khuyến nghị: 1200x400 pixels
- Đặt vào: `client/src/assets/images/ocean-wave.jpg`

**Bước 2**: Mở file `HomePage.css`, tìm:
```css
.daily-quest-banner {
  background: linear-gradient(135deg, #87CEEB 0%, #4DA6FF 100%);
}
```

**Bước 3**: Thay bằng:
```css
.daily-quest-banner {
  background:
    linear-gradient(135deg, rgba(135, 206, 235, 0.8) 0%, rgba(77, 166, 255, 0.8) 100%),
    url('/src/assets/images/ocean-wave.jpg') center/cover;
  background-size: cover;
  background-position: center;
}
```

**Giải thích**:
- `rgba(..., 0.8)`: Màu gradient với độ trong suốt 80%
- `url(...)`: Đường dẫn đến ảnh
- `center/cover`: Ảnh phủ kín và căn giữa

---

### 🖼️ Sử dụng ảnh online (không cần tải về)

```css
.daily-quest-banner {
  background:
    linear-gradient(135deg, rgba(135, 206, 235, 0.7) 0%, rgba(77, 166, 255, 0.7) 100%),
    url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200');
  background-size: cover;
}
```

---

## 4️⃣ THAY ĐỔI KÍCH THƯỚC BANNER

### 📂 File cần chỉnh sửa
```
📁 client/src/pages/home/HomePage.css
```

### 🔧 Cách làm

Tìm class `.daily-quest-banner` (khoảng dòng 9):

```css
.daily-quest-banner {
  padding: var(--spacing-xl);  /* Khoảng cách bên trong */
}
```

**Thay đổi padding (khoảng cách trong)**:

```css
/* Banner nhỏ gọn */
.daily-quest-banner {
  padding: 20px;
}

/* Banner vừa phải (mặc định) */
.daily-quest-banner {
  padding: 32px;
}

/* Banner rộng rãi */
.daily-quest-banner {
  padding: 50px;
}
```

**Thay đổi chiều cao**:

```css
.daily-quest-banner {
  padding: var(--spacing-xl);
  min-height: 200px;  /* Chiều cao tối thiểu */
}
```

---

## 5️⃣ THAY ĐỔI HÌNH MINH HỌA (EMOJI → ẢNH)

### 🎯 Thay emoji 🧒 bằng hình học sinh thật

### 📂 File cần chỉnh sửa
```
📁 client/src/pages/home/HomePage.jsx
```

### 🔧 Cách làm

**Bước 1**: Chuẩn bị ảnh
- Tải ảnh học sinh (student.png)
- Đặt vào: `client/src/assets/images/student.png`

**Bước 2**: Mở file `HomePage.jsx`, tìm (khoảng dòng 47-49):
```jsx
<div className="student-avatar">
  <span className="avatar-icon">🧒</span>
  <span className="question-mark">❓</span>
</div>
```

**Bước 3**: Thay bằng:
```jsx
<div className="student-avatar">
  <img
    src="/src/assets/images/student.png"
    alt="Học sinh"
    className="avatar-icon"
    style={{ width: '80px', height: '80px', borderRadius: '50%' }}
  />
  <span className="question-mark">❓</span>
</div>
```

### 🌐 Sử dụng ảnh Avatar online miễn phí

```jsx
<img
  src="https://api.dicebear.com/7.x/avataaars/svg?seed=student&backgroundColor=b6e3f4"
  alt="Học sinh"
  className="avatar-icon"
  style={{ width: '80px', height: '80px', borderRadius: '50%' }}
/>
```

**Các API Avatar miễn phí**:
- DiceBear: https://dicebear.com/
- UI Avatars: https://ui-avatars.com/
- Boring Avatars: https://boringavatars.com/

---

## 6️⃣ THAY ĐỔI ICON CÁC CARD (📚, 📝)

### 📂 File cần chỉnh sửa
```
📁 client/src/pages/home/HomePage.jsx
```

### 🔧 Thay icon Ôn Luyện

Tìm (khoảng dòng 75-77):
```jsx
<div className="feature-icon">
  <span className="icon-large">📚</span>
  <span className="icon-small">🖩</span>
</div>
```

**Thay bằng ảnh**:
```jsx
<div className="feature-icon">
  <img
    src="/src/assets/images/books.png"
    alt="Sách"
    className="icon-large"
    style={{ width: '80px', height: '80px' }}
  />
</div>
```

**Hoặc dùng icon online**:
```jsx
<img
  src="https://cdn-icons-png.flaticon.com/512/3330/3330307.png"
  alt="Sách"
  style={{ width: '80px', height: '80px' }}
/>
```

---

## 7️⃣ THAY ĐỔI GAME CARDS

### 📂 File cần chỉnh sửa
```
📁 client/src/pages/home/HomePage.jsx
```

### 🔧 Thêm/Xóa/Sửa game

Tìm phần `featuredGames` (khoảng dòng 17-39):

```jsx
const featuredGames = [
  {
    id: 1,
    title: 'Cá Chép Hóa Rồng',
    icon: '🐟',
    badge: '5',
    path: '/games',
  },
  // Thêm game mới ở đây
];
```

**Thêm game mới**:
```jsx
const featuredGames = [
  {
    id: 1,
    title: 'Cá Chép Hóa Rồng',
    icon: '🐟',
    badge: '5',
    path: '/games',
  },
  {
    id: 2,
    title: 'Toán Học Vui Nhộn',
    icon: '🎓',
    badge: '5',
    path: '/games',
  },
  {
    id: 3,
    title: 'Ghép Chữ Nhanh',
    icon: '🔤',
    badge: '5',
    path: '/games',
  },
  // ✨ GAME MỚI
  {
    id: 4,
    title: 'Khám Phá Khoa Học',
    icon: '🔬',
    badge: '3',
    path: '/games',
  },
];
```

**Thay icon game bằng ảnh**:
```jsx
{
  id: 1,
  title: 'Cá Chép Hóa Rồng',
  icon: <img src="/src/assets/images/fish-game.png" style={{width: '56px', height: '56px'}} />,
  badge: '5',
  path: '/games',
}
```

---

## 8️⃣ THÊM ẢNH NỀN (BACKGROUND) CHO TOÀN TRANG

### 📂 File cần chỉnh sửa
```
📁 client/src/index.css
```

### 🔧 Cách làm

Tìm phần `body` (khoảng dòng 137):

```css
body {
  margin: 0;
  font-family: var(--font-family-base);
  background-color: var(--bg-primary);
}
```

**Thêm ảnh nền**:
```css
body {
  margin: 0;
  font-family: var(--font-family-base);
  background-image: url('/src/assets/images/background-pattern.png');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}
```

**Hoặc dùng pattern nhẹ nhàng**:
```css
body {
  background-color: #F0F8FF;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(77, 166, 255, 0.05) 35px, rgba(77, 166, 255, 0.05) 70px);
}
```

---

## 🎨 THAY ĐỔI FONT CHỮ

### 📂 File cần chỉnh sửa
```
📁 client/src/index.css
```

### 🔧 Sử dụng Google Fonts

**Bước 1**: Chọn font tại https://fonts.google.com/
Ví dụ: **Nunito**, **Poppins**, **Quicksand**

**Bước 2**: Mở file `client/index.html`, thêm trong `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

**Bước 3**: Mở `index.css`, tìm:
```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, ...;
}
```

**Bước 4**: Thay bằng:
```css
:root {
  --font-family-base: 'Nunito', -apple-system, sans-serif;
  --font-family-heading: 'Nunito', sans-serif;
}
```

---

## 📊 BẢNG MÀU GỢI Ý

| Theme | Primary | Light | Dark | Accent | Background |
|-------|---------|-------|------|--------|------------|
| 🔵 **Blue (Hiện tại)** | #4DA6FF | #87CEEB | #3182CE | #FFA500 | #F0F8FF |
| 🟣 **Purple** | #9C27B0 | #CE93D8 | #7B1FA2 | #FFD54F | #F3E5F5 |
| 🟢 **Green** | #4CAF50 | #81C784 | #388E3C | #FFC107 | #F1F8E9 |
| 🔴 **Red** | #F44336 | #E57373 | #D32F2F | #FFEB3B | #FFEBEE |
| 🟠 **Orange** | #FF9800 | #FFB74D | #F57C00 | #4CAF50 | #FFF3E0 |
| 🩷 **Pink** | #FF69B4 | #FFB6C1 | #C71585 | #FFD700 | #FFF0F5 |

---

## 🛠️ TROUBLESHOOTING (Khắc Phục Lỗi)

### ❌ Ảnh không hiển thị?

**Nguyên nhân**: Đường dẫn sai

**Giải pháp**:
- Kiểm tra ảnh đã đặt đúng thư mục chưa
- Đường dẫn phải bắt đầu bằng `/src/assets/...`
- Tên file phải khớp chính xác (phân biệt chữ hoa/thường)

### ❌ Màu sắc không thay đổi?

**Giải pháp**:
1. **Hard Refresh**: Ctrl + Shift + R
2. **Clear Cache**: F12 → Application → Clear site data
3. **Restart Server**: Stop (Ctrl+C) rồi chạy lại `npm run dev`

### ❌ Website bị lỗi sau khi sửa?

**Giải pháp**:
1. Mở Console (F12) → tab Console
2. Xem lỗi màu đỏ
3. Quay lại code, kiểm tra:
   - Có đóng thẻ đủ chưa: `</div>`, `</span>`
   - Có thiếu dấu `,` giữa các object không
   - Có sai cú pháp CSS không (thiếu `;` hoặc `}`)

---

## 📚 TÀI NGUYÊN MIỄN PHÍ

### 🖼️ Tải ảnh miễn phí
- **Unsplash**: https://unsplash.com/ (Ảnh chất lượng cao)
- **Pexels**: https://pexels.com/ (Ảnh & Video)
- **Freepik**: https://freepik.com/ (Vector, Icons)
- **Flaticon**: https://flaticon.com/ (Icons SVG/PNG)

### 🎨 Công cụ màu sắc
- **Coolors**: https://coolors.co/ (Tạo bảng màu)
- **Adobe Color**: https://color.adobe.com/
- **ColorHunt**: https://colorhunt.co/ (Palettes hot trend)

### ✏️ Font chữ
- **Google Fonts**: https://fonts.google.com/
- **DaFont**: https://dafont.com/

### 🎭 Minh họa & Icons
- **unDraw**: https://undraw.co/ (Minh họa SVG)
- **DrawKit**: https://drawkit.com/
- **Icons8**: https://icons8.com/

---

## ✅ CHECKLIST SAU KHI CHỈNH SỬA

- [ ] Đã lưu tất cả file (Ctrl + S)
- [ ] Đã refresh trình duyệt (Ctrl + Shift + R)
- [ ] Kiểm tra responsive (F12 → Toggle device toolbar)
- [ ] Test trên mobile view
- [ ] Kiểm tra tất cả link/button có hoạt động không
- [ ] Xem Console không có lỗi đỏ (F12 → Console)

---

## 🆘 CẦN TRỢ GIÚP?

Nếu gặp khó khăn, hãy:
1. Chụp ảnh màn hình lỗi
2. Copy đoạn code bị lỗi
3. Mô tả bạn đã làm gì trước khi bị lỗi

---

## 🎉 KẾT LUẬN

Với hướng dẫn này, bạn đã có thể:
- ✅ Thay đổi logo, màu sắc, font chữ
- ✅ Thêm/sửa hình ảnh, icons
- ✅ Tùy chỉnh kích thước banner
- ✅ Thêm game cards mới
- ✅ Thay đổi theme màu sắc toàn trang

**💡 Mẹo**: Mỗi lần sửa, hãy sửa từng chút một và test ngay để dễ tìm lỗi!

**Chúc bạn thành công! 🚀**

---

_Tài liệu này được tạo cho dự án **Vượt Vũ Môn** - Nền tảng học tập trực tuyến cho học sinh tiểu học._

_Cập nhật lần cuối: 29/11/2025_
