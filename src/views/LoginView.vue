<script setup>
// Trang Sign In — gọi authStore.login() → supabase.auth.signInWithPassword()
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout/AuthLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// === Form state ===
const email = ref('')
const password = ref('')
const rememberMe = ref(true)

// === UI state ===
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)   // toggle hiển thị password

const handleSubmit = async () => {
  errorMsg.value = ''
  loading.value = true

  try {
    // Gọi store action — store gọi supabase + tự sync state user/session
    const { error } = await authStore.login(email.value, password.value)

    if (error) {
      // Lỗi business: sai mật khẩu, email chưa confirm, user không tồn tại...
      errorMsg.value = error.message
      return
    }

    // Thành công → chuyển dashboard.
    // router.replace (KHÔNG push) để user không back về login bằng nút Back trình duyệt.
    router.replace('/dashboard')
  } catch (err) {
    errorMsg.value = 'Unexpected error: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <h2 class="text-3xl font-bold mb-2 uppercase">Nice to see you!</h2>
    <p class="text-gray-400 text-sm mb-8">
      Enter your email and password to sign in
    </p>

    <div class="p-0">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2 ml-1">Email</label>
          <div class="input-wrapper">
            <input v-model="email" type="email" placeholder="Your email address"
                   class="form-input-v2" :disabled="loading" required />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 ml-1">Password</label>
          <div class="input-wrapper">
            <input v-model="password" type="password" placeholder="Your password"
                   class="form-input-v2" :disabled="loading" required />
          </div>
        </div>

        <label class="flex items-center gap-3 cursor-pointer select-none">
          <span class="relative">
            <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
            <span class="block w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-blue-500 transition-colors"></span>
            <span
              class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
          </span>
          <span class="text-xs text-gray-300">Remember me</span>
        </label>

        <!-- Error message -->
        <p v-if="errorMsg"
           class="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {{ errorMsg }}
        </p>

        <button type="submit" :disabled="loading"
                class="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 rounded-2xl
                       font-bold tracking-wider text-xs transition uppercase
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-400 mt-8">
        Don't have an account?
        <RouterLink to="/register" class="text-white font-bold hover:underline">
          Sign up
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>
/* Loại bỏ class card-form cũ nếu không dùng tới */

/* Wrapper để tạo viền Gradient cho Input */
.input-wrapper {
  position: relative;
  border-radius: 15px;
  /* Bo cong nhiều hơn giống Email/Pass */
  padding: 1px;
  /* Khoảng cách tạo viền */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
}

.form-input-v2 {
  width: 100%;
  padding: 12px 16px;

  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: white;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: #3b82f6;
  /* Viền xanh khi focus */
  background-color: rgba(255, 255, 255, 0.02);
  /* Sáng nhẹ lên một chút để nhận biết */
}

.form-input-v2::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Hiệu ứng khi click vào input */
.input-wrapper:focus-within {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}

/* Nút Sign In bo cong mạnh */
button {
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}
</style>
