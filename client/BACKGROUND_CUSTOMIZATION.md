# Hướng Dẫn Tùy Chỉnh Background "Cá Chép Vượt Vũ Môn"

## Tổng Quan

Background của ứng dụng được thiết kế với chủ đề văn hóa "Cá Chép Vượt Vũ Môn" - biểu tượng của sự nỗ lực và thành công trong học tập.

### Các Thành Phần

1. **Hình ảnh SVG**: `/client/public/assets/koi-dragon-gate.svg`
2. **Component React**: `/client/src/components/common/BackgroundWrapper.jsx`
3. **CSS Styling**: `/client/src/components/common/BackgroundWrapper.css`

## Cách Tùy Chỉnh

### 1. Điều Chỉnh Độ Mờ (Blur)

Mở file `BackgroundWrapper.css` và tìm dòng:

```css
filter: blur(60px);
```

- **Tăng giá trị** (ví dụ: `80px`) để làm mờ hơn
- **Giảm giá trị** (ví dụ: `40px`) để hình ảnh rõ hơn
- **Khuyến nghị**: 40px - 80px cho hiệu ứng dreamy tốt nhất

### 2. Thay Đổi Màu Overlay

Mở file `BackgroundWrapper.css` và tìm:

```css
background: linear-gradient(
  135deg,
  rgba(30, 58, 138, 0.4) 0%,    /* blue-900 */
  rgba(37, 99, 235, 0.35) 50%,  /* blue-600 */
  rgba(30, 64, 175, 0.3) 100%   /* blue-700 */
);
```

**Ví dụ thay đổi:**

- **Overlay xanh đậm hơn**: Tăng opacity từ `0.4` lên `0.6`
- **Overlay màu tím**: Thay đổi RGB thành màu tím
  ```css
  rgba(139, 92, 246, 0.4)  /* purple-500 */
  ```
- **Overlay màu xanh lá**:
  ```css
  rgba(34, 197, 94, 0.4)  /* green-500 */
  ```

### 3. Thay Đổi Hình Ảnh

#### Cách 1: Thay thế SVG hiện tại

Chỉnh sửa file `/client/public/assets/koi-dragon-gate.svg` với hình ảnh SVG mới của bạn.

#### Cách 2: Sử dụng hình ảnh khác

1. Thêm hình ảnh mới vào `/client/public/assets/` (ví dụ: `my-background.jpg`)
2. Mở `BackgroundWrapper.jsx` và thay đổi:
   ```jsx
   backgroundImage: 'url(/assets/my-background.jpg)',
   ```

### 4. Tắt Animation

Mở `BackgroundWrapper.css` và comment hoặc xóa:

```css
/* animation: breathe 30s ease-in-out infinite; */
```

### 5. Điều Chỉnh Tốc Độ Animation

Thay đổi giá trị `30s`:

```css
animation: breathe 20s ease-in-out infinite; /* Nhanh hơn */
animation: breathe 45s ease-in-out infinite; /* Chậm hơn */
```

### 6. Điều Chỉnh Độ Trong Suốt Header/Footer

Mở `MainLayout.css` và tìm:

```css
.header {
  background: rgba(255, 255, 255, 0.85); /* Thay đổi 0.85 */
}

.footer {
  background: rgba(255, 255, 255, 0.85); /* Thay đổi 0.85 */
}
```

- **0.9 - 1.0**: Gần như không trong suốt (dễ đọc hơn)
- **0.7 - 0.85**: Bán trong suốt (cân bằng)
- **0.5 - 0.7**: Rất trong suốt (có thể khó đọc)

## Màu Sắc Tailwind CSS Tham Khảo

### Xanh Dương (Blue)
- `rgba(30, 58, 138, 0.4)` - blue-900
- `rgba(37, 99, 235, 0.4)` - blue-600
- `rgba(96, 165, 250, 0.4)` - blue-400

### Xanh Lục (Green)
- `rgba(21, 128, 61, 0.4)` - green-700
- `rgba(34, 197, 94, 0.4)` - green-500
- `rgba(74, 222, 128, 0.4)` - green-400

### Tím (Purple)
- `rgba(107, 33, 168, 0.4)` - purple-700
- `rgba(139, 92, 246, 0.4)` - purple-500
- `rgba(192, 132, 252, 0.4)` - purple-400

### Hồng (Pink)
- `rgba(190, 24, 93, 0.4)` - pink-700
- `rgba(236, 72, 153, 0.4)` - pink-500
- `rgba(249, 168, 212, 0.4)` - pink-400

## Hiệu Suất (Performance)

### Tối Ưu Cho Mobile

File `BackgroundWrapper.css` đã có responsive:

```css
@media (max-width: 768px) {
  .background-image {
    filter: blur(40px); /* Giảm blur trên mobile */
  }
}
```

### Tắt Animation Trên Mobile

Thêm vào media query:

```css
@media (max-width: 768px) {
  .background-image {
    animation: none; /* Tắt animation */
  }
}
```

## Troubleshooting

### Background không hiển thị?

1. Kiểm tra đường dẫn hình ảnh trong `BackgroundWrapper.jsx`
2. Xóa cache browser (Ctrl+Shift+R hoặc Cmd+Shift+R)
3. Kiểm tra file SVG có tồn tại tại `/client/public/assets/`

### Text khó đọc?

1. Tăng opacity của overlay (0.5 → 0.7)
2. Tăng độ blur (60px → 80px)
3. Thêm `backdrop-filter: brightness(0.9)` vào `.background-overlay`

### Background bị lỗi trên Safari?

Thêm vendor prefix:

```css
.background-image {
  -webkit-filter: blur(60px);
  filter: blur(60px);
}

.background-overlay {
  -webkit-backdrop-filter: brightness(0.95);
  backdrop-filter: brightness(0.95);
}
```

## Ví Dụ Themes

### Theme Đêm Huyền Bí

```css
background: linear-gradient(
  135deg,
  rgba(15, 23, 42, 0.6) 0%,     /* slate-900 */
  rgba(30, 58, 138, 0.5) 50%,   /* blue-900 */
  rgba(88, 28, 135, 0.5) 100%   /* purple-900 */
);
```

### Theme Bình Minh Tươi Sáng

```css
background: linear-gradient(
  135deg,
  rgba(252, 165, 165, 0.3) 0%,  /* red-300 */
  rgba(251, 191, 36, 0.3) 50%,  /* amber-400 */
  rgba(34, 211, 238, 0.3) 100%  /* cyan-400 */
);
```

### Theme Rừng Xanh

```css
background: linear-gradient(
  135deg,
  rgba(20, 83, 45, 0.5) 0%,     /* green-800 */
  rgba(34, 197, 94, 0.4) 50%,   /* green-500 */
  rgba(74, 222, 128, 0.4) 100%  /* green-400 */
);
```

## Liên Hệ

Nếu cần hỗ trợ thêm, vui lòng tạo issue trên GitHub repository.
