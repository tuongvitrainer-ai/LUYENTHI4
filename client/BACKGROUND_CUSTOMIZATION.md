# Hướng Dẫn Tùy Chỉnh Background "Đại Dương và Sóng Biển"

## Tổng Quan

Background của ứng dụng được thiết kế với chủ đề đại dương và sóng biển - tạo không gian học tập vui vẻ, tươi sáng và thân thiện cho học sinh tiểu học.

### Các Thành Phần

1. **Hình ảnh SVG**: `/client/public/assets/ocean-waves.svg`
   - Các lớp sóng chồng lên nhau (4 lớp)
   - Mây trắng dễ thương
   - Bọt sóng và bong bóng
   - Cá nhỏ trang trí (tùy chọn)
   - Mặt trời sáng
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
  rgba(77, 208, 225, 0.25) 0%,    /* #4DD0E1 - cyan-400 */
  rgba(0, 188, 212, 0.2) 50%,     /* #00BCD4 - cyan-500 */
  rgba(0, 172, 193, 0.15) 100%    /* #00ACC1 - cyan-600 */
);
```

**Ví dụ thay đổi:**

- **Overlay đậm hơn**: Tăng opacity từ `0.25` lên `0.35` hoặc `0.4`
- **Overlay xanh lục tươi sáng**:
  ```css
  rgba(74, 222, 128, 0.25)  /* green-400 */
  rgba(34, 197, 94, 0.2)    /* green-500 */
  ```
- **Overlay màu tím nhạt**:
  ```css
  rgba(192, 132, 252, 0.25)  /* purple-400 */
  rgba(168, 85, 247, 0.2)    /* purple-500 */
  ```

### 3. Thay Đổi Hình Ảnh

#### Cách 1: Chỉnh sửa SVG hiện tại

Chỉnh sửa file `/client/public/assets/ocean-waves.svg`:
- Thay đổi màu sóng trong các gradient
- Thêm/bớt lớp sóng
- Điều chỉnh vị trí mây, bong bóng
- Thay đổi màu bầu trời

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

## Màu Sắc Tham Khảo Cho Theme Đại Dương

### Xanh Da Trời / Xanh Ngọc (Cyan - Theme hiện tại)
- `rgba(224, 247, 250, 0.3)` - #E0F7FA - cyan-50 (rất nhạt)
- `rgba(179, 229, 252, 0.3)` - #B3E5FC - cyan-100
- `rgba(77, 208, 225, 0.3)` - #4DD0E1 - cyan-400
- `rgba(0, 188, 212, 0.25)` - #00BCD4 - cyan-500
- `rgba(0, 172, 193, 0.2)` - #00ACC1 - cyan-600

### Xanh Dương (Blue)
- `rgba(96, 165, 250, 0.3)` - blue-400
- `rgba(59, 130, 246, 0.3)` - blue-500
- `rgba(37, 99, 235, 0.25)` - blue-600

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

1. Kiểm tra đường dẫn hình ảnh trong `BackgroundWrapper.jsx` (phải là `/assets/ocean-waves.svg`)
2. Xóa cache browser (Ctrl+Shift+R hoặc Cmd+Shift+R)
3. Kiểm tra file SVG có tồn tại tại `/client/public/assets/ocean-waves.svg`
4. Khởi động lại dev server

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

### Theme Biển Nhiệt Đới (Hiện tại)

```css
background: linear-gradient(
  135deg,
  rgba(77, 208, 225, 0.25) 0%,    /* cyan-400 */
  rgba(0, 188, 212, 0.2) 50%,     /* cyan-500 */
  rgba(0, 172, 193, 0.15) 100%    /* cyan-600 */
);
```

### Theme Biển Sâu

```css
background: linear-gradient(
  135deg,
  rgba(0, 151, 167, 0.3) 0%,     /* cyan-700 */
  rgba(0, 121, 107, 0.25) 50%,   /* teal-700 */
  rgba(0, 96, 100, 0.2) 100%     /* cyan-800 */
);
```

### Theme Bình Minh Biển Cả

```css
background: linear-gradient(
  135deg,
  rgba(251, 207, 232, 0.2) 0%,   /* pink-200 */
  rgba(254, 215, 170, 0.2) 50%,  /* orange-200 */
  rgba(165, 243, 252, 0.2) 100%  /* cyan-200 */
);
```

### Theme Rạn San Hô

```css
background: linear-gradient(
  135deg,
  rgba(252, 231, 243, 0.25) 0%,  /* pink-100 */
  rgba(186, 230, 253, 0.25) 50%, /* sky-200 */
  rgba(167, 243, 208, 0.25) 100% /* emerald-200 */
);
```

## Liên Hệ

Nếu cần hỗ trợ thêm, vui lòng tạo issue trên GitHub repository.
