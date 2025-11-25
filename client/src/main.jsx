import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker với tính năng tự động cập nhật
const updateSW = registerSW({
  onNeedRefresh() {
    // Khi có phiên bản mới, tự động reload trang
    console.log('🔄 Phát hiện phiên bản mới! Đang cập nhật...')
    updateSW(true)
  },
  onOfflineReady() {
    console.log('✅ App đã sẵn sàng hoạt động offline!')
    // Có thể hiển thị thông báo cho user
  },
  onRegistered(registration) {
    console.log('✅ Service Worker đã được đăng ký thành công!')

    // Kiểm tra cập nhật mỗi giờ
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // 1 hour
    }
  },
  onRegisterError(error) {
    console.error('❌ Lỗi khi đăng ký Service Worker:', error)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
