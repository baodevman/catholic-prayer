import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker automatically
registerSW({
  onNeedRefresh() {
    if (confirm('Ứng dụng đã có phiên bản mới. Bạn có muốn cập nhật ngay không?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('Ứng dụng đã sẵn sàng hoạt động ngoại tuyến!');
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
