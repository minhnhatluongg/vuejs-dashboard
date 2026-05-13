<script setup>
// Trang Sign Up — gọi supabase.auth.signUp()
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout/AuthLayout.vue'
import { supabase } from '@/services/supabase'

const router = useRouter()

// === Form state (data người dùng nhập) ===
const fullName = ref('')
const email = ref('')
const password = ref('')
const rememberMe = ref(true)

// === UI state (trạng thái của UI khi submit) ===
const loading = ref(false)       // true khi đang gọi API → disable nút, hiện spinner
const errorMsg = ref('')         // chứa lỗi để hiển thị cho user
const successMsg = ref('')       // hiển thị thông báo thành công

const handleSubmit = async () => {
  // Reset state trước mỗi lần submit (xóa lỗi cũ)
  errorMsg.value = ''
  successMsg.value = ''

  // Validate cơ bản phía client trước (tiết kiệm request)
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters'
    return
  }
  //Check email format đơn giản
  const emailRegex = /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  if (!emailRegex.test(email.value)) {
    errorMsg.value = 'Please enter a valid email address'
    return
  }

  loading.value = true   // BẬT loading

  try {
    // === Gọi Supabase signUp ===
    // - email, password: bắt buộc
    // - options.data: metadata custom → sẽ vào auth.users.raw_user_meta_data
    //   → trigger handle_new_user() đọc full_name từ đây để tạo profile
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        },
      },
    })

    // Supabase trả về { data, error } — KHÔNG throw exception
    // → phải tự check error và xử lý
    if (error) {
      errorMsg.value = error.message
      return
    }

    // === Thành công ===
    // Nếu project Supabase BẬT email confirmation (mặc định):
    //   data.user có, nhưng data.session = null (chưa login được, đợi xác thực email)
    // Nếu TẮT email confirmation:
    //   data.user + data.session đều có → đã login tự động
    if (data.session) {
      // Đã auto login → vào thẳng dashboard
      successMsg.value = 'Account created! Redirecting...'
      setTimeout(() => router.push('/dashboard'), 1000)
    } else {
      // Cần xác thực email
      successMsg.value = 'Check your email to confirm your account!'
    }
  } catch (err) {
    // catch những lỗi bất ngờ (network, JS error...)
    errorMsg.value = 'Unexpected error: ' + err.message
    console.error(err)
  } finally {
    // finally LUÔN chạy dù try/catch ra sao → đảm bảo tắt loading
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <!-- Heading -->
    <h2 class="text-3xl font-bold text-center mb-2">Welcome!</h2>
    <p class="text-gray-400 text-center text-sm mb-8 px-4">
      Use these awesome forms to login or create new account in your project for free.
    </p>

    <!-- Card chính chứa form — radius 30, border gradient, blur (theo Figma) -->
    <div class="card-form p-6 md:p-8">
      <!-- Register with social -->
      <p class="text-center font-semibold mb-4">Register with</p>
      <div class="flex justify-center gap-4 mb-5">
        <button class="social-btn" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
          </svg>
        </button>
        <button class="social-btn" aria-label="Apple">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </button>
        <button class="social-btn" aria-label="Google">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M21.35 11.1h-9.17v2.92h5.23c-.49 2.45-2.5 3.85-5.23 3.85-3.18 0-5.75-2.57-5.75-5.75s2.57-5.75 5.75-5.75c1.37 0 2.6.49 3.57 1.29l2.21-2.21C16.46 4.06 14.43 3.25 12.18 3.25c-4.83 0-8.75 3.92-8.75 8.75s3.92 8.75 8.75 8.75c4.4 0 8.4-3.21 8.4-8.75 0-.5-.05-.97-.13-1.45z"/>
          </svg>
        </button>
      </div>

      <p class="text-center text-gray-400 text-sm mb-5">or</p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Name</label>
          <input
            v-model="fullName"
            type="text"
            placeholder="Your full name"
            class="form-input"
            :disabled="loading"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Your email address"
            class="form-input"
            :disabled="loading"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Your password"
            class="form-input"
            :disabled="loading"
            required
          />
        </div>

        <!-- Remember me toggle -->
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <span class="relative">
            <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
            <span
              class="block w-10 h-6 bg-gray-600 rounded-full
                     peer-checked:bg-blue-500 transition-colors"
            ></span>
            <span
              class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                     transition-transform peer-checked:translate-x-4"
            ></span>
          </span>
          <span class="text-sm">Remember me</span>
        </label>

        <!-- Error message: chỉ hiển thị khi có lỗi -->
        <p v-if="errorMsg" class="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {{ errorMsg }}
        </p>

        <!-- Success message: chỉ hiển thị khi thành công -->
        <p v-if="successMsg" class="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
          {{ successMsg }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 mt-2 bg-blue-500 hover:bg-blue-600 rounded-lg
                 font-semibold tracking-wider text-sm transition
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <!-- Spinner SVG hiện khi loading -->
          <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          {{ loading ? 'CREATING ACCOUNT...' : 'SIGN UP' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-400 mt-5">
        Already have an account?
        <RouterLink to="/login" class="text-white font-semibold hover:underline">
          Sign in
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<style scoped>
/* Card form: radius 30, blur, border gradient (Figma: Stroke Radial 100%, Width 2) */
.card-form {
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  position: relative;
}

.card-form::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 30px;
  padding: 2px;
  background: radial-gradient(circle at top left,
    rgba(168, 85, 247, 0.5),
    rgba(59, 130, 246, 0.3),
    rgba(255, 255, 255, 0.05));
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.social-btn {
  @apply w-14 h-14 flex items-center justify-center rounded-xl
         border border-white/10 bg-white/5 text-white
         hover:bg-white/10 transition;
}

.form-input {
  @apply w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10
         text-sm placeholder-gray-500
         focus:outline-none focus:border-blue-500 transition;
}
</style>
