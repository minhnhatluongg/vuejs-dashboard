import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './stores/authStore'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Khởi tạo auth store TRƯỚC khi mount app:
// - Đọc session từ localStorage (nếu có) → biết user đã login chưa.
// - Đăng ký listener onAuthStateChange.
// LƯU Ý: useAuthStore phải gọi SAU createPinia()
const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
