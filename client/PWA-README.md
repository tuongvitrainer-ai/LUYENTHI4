# 📱 PWA Configuration - Vượt Vũ Môn

Dự án đã được nâng cấp thành **Progressive Web App (PWA)** với đầy đủ tính năng offline support.

## ✨ Tính Năng PWA

### 1. **Offline Support**
- Ứng dụng có thể hoạt động khi mất kết nối internet
- Cache tự động các tài nguyên tĩnh (HTML, CSS, JS, images)
- API calls được cache với chiến lược NetworkFirst

### 2. **Install to Home Screen**
- Người dùng có thể cài đặt app lên màn hình chính (iOS/Android)
- Mở app như một ứng dụng native, không cần trình duyệt
- Icon và splash screen được tùy chỉnh

### 3. **Auto Update**
- Tự động phát hiện phiên bản mới
- Tự động cập nhật khi có version mới
- Kiểm tra cập nhật mỗi 1 giờ

### 4. **Caching Strategies**

#### **NetworkFirst** (HTML, API)
- Luôn thử fetch từ network trước
- Nếu offline, dùng cache
- Timeout: 10 seconds

#### **StaleWhileRevalidate** (CSS, JS)
- Trả về cache ngay lập tức
- Đồng thời fetch phiên bản mới ở background
- Update cache cho lần sau

#### **CacheFirst** (Images)
- Ưu tiên cache trước
- Chỉ fetch khi chưa có trong cache
- Cache lâu dài: 60 ngày

## 📁 File Structure

```
client/
├── public/
│   ├── icon-192x192.svg       # PWA icon (192x192)
│   ├── icon-512x512.svg       # PWA icon (512x512)
│   └── apple-touch-icon.svg   # iOS icon (180x180)
├── src/
│   └── main.jsx               # Service Worker registration
├── vite.config.js             # PWA configuration
└── PWA-README.md              # This file
```

## 🎨 Manifest Configuration

| Property | Value |
|----------|-------|
| Name | Vượt Vũ Môn |
| Short Name | VVM |
| Theme Color | #87CEEB (Sky Blue) |
| Background | #ffffff (White) |
| Display Mode | Standalone |
| Orientation | Portrait |

## 🚀 Development

### Test PWA in Development
```bash
cd client
npm run dev
```

PWA được bật trong development mode để test service worker ngay.

### Build for Production
```bash
cd client
npm run build
npm run preview  # Preview production build
```

## 🧪 Testing PWA

### Chrome DevTools
1. Mở DevTools (F12)
2. Tab **Application**
3. Kiểm tra:
   - **Manifest**: Xem manifest.webmanifest
   - **Service Workers**: Kiểm tra SW status
   - **Cache Storage**: Xem cached resources
   - **Offline**: Tick "Offline" để test offline mode

### Lighthouse Audit
1. Mở DevTools (F12)
2. Tab **Lighthouse**
3. Chọn "Progressive Web App"
4. Click "Analyze page load"
5. Mục tiêu: Score > 90

## 📱 Install on Mobile

### Android (Chrome)
1. Mở website
2. Nhấn menu (⋮)
3. Chọn "Add to Home screen"
4. Xác nhận

### iOS (Safari)
1. Mở website
2. Nhấn Share button
3. Chọn "Add to Home Screen"
4. Xác nhận

## 🔧 Customization

### Update Icons
Thay thế các file trong `/public`:
- `icon-192x192.svg`
- `icon-512x512.svg`
- `apple-touch-icon.svg`

### Update Theme Color
Sửa trong `vite.config.js`:
```js
manifest: {
  theme_color: '#87CEEB', // Your color
}
```

### Update Caching Strategy
Sửa trong `vite.config.js > workbox > runtimeCaching`

## 📊 Cache Information

| Resource Type | Strategy | Max Entries | Max Age |
|--------------|----------|-------------|---------|
| HTML | NetworkFirst | 10 | 7 days |
| CSS/JS | StaleWhileRevalidate | 50 | 30 days |
| Images | CacheFirst | 100 | 60 days |
| API | NetworkFirst | 50 | 5 minutes |

## 🐛 Troubleshooting

### Service Worker không update
```js
// Clear all caches
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

### Cache cũ không xóa
```js
// Clear cache storage
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key))
})
```

### Hard reload
- Chrome: `Ctrl + Shift + R` (Windows/Linux)
- Chrome: `Cmd + Shift + R` (Mac)

## 📚 Resources

- [vite-plugin-pwa Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## ✅ PWA Checklist

- [x] Manifest configured
- [x] Service Worker registered
- [x] Icons provided (192x192, 512x512)
- [x] Offline support enabled
- [x] Auto-update configured
- [x] HTTPS ready (required for production)
- [x] Cache strategies defined
- [x] Installable on mobile devices

---

**Note**: PWA chỉ hoạt động đầy đủ trên **HTTPS**. Trong development, localhost được tính là secure context.
