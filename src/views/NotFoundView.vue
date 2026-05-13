<script setup>
// NotFoundView: trang 404 cho mọi route không tồn tại.
// Lấy URL hiện tại để hiển thị giúp user hiểu họ vừa gõ gì.
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Lấy path mà user đang truy cập (param 'pathMatch' từ catch-all route)
const goBack = () => {
  // Nếu có history trước đó thì back, không thì về login
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0B0B2C] text-white px-6 overflow-hidden relative">

    <!-- Background gradient + blobs trang trí -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blob tím trên trái -->
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30"
           style="background: radial-gradient(circle, #a855f7, transparent 70%)"></div>
      <!-- Blob xanh dưới phải -->
      <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30"
           style="background: radial-gradient(circle, #3b82f6, transparent 70%)"></div>
    </div>

    <!-- Nội dung chính -->
    <div class="relative z-10 text-center max-w-xl">
      <!-- 404 lớn với gradient text -->
      <h1 class="text-[180px] md:text-[240px] font-black leading-none tracking-tighter
                 bg-gradient-to-br from-purple-400 via-blue-400 to-purple-600
                 bg-clip-text text-transparent select-none">
        404
      </h1>

      <h2 class="text-2xl md:text-3xl font-bold mb-3 -mt-4">
        Page not found
      </h2>

      <p class="text-gray-400 text-sm md:text-base mb-2">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Hiển thị URL user vừa gõ (để debug + cảnh báo) -->
      <p class="text-xs text-gray-500 mb-8 font-mono">
        Requested: <span class="text-purple-400">{{ route.fullPath }}</span>
      </p>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="goBack"
          class="px-6 py-3 bg-white/5 border border-white/10 rounded-lg
                 hover:bg-white/10 transition text-sm font-semibold"
        >
          ← Go Back
        </button>
        <RouterLink
          to="/login"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg
                 transition text-sm font-semibold"
        >
          Back to Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
