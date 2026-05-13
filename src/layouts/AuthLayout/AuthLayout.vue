<script setup>
// AuthLayout: layout dùng chung cho Login / Register / Forgot password.
// Layout pattern: cố định 100vh, cột trái fixed, cột phải tự scroll bên trong nếu form dài.
import heroImage from '@/assets/hero.png'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <!-- h-screen + overflow-hidden: container = đúng 100vh, không co giãn theo nội dung
       → ảnh hero bên trái KHÔNG bao giờ thay đổi kích thước khi đổi route. -->
  <div class="relative h-screen flex bg-[#0B0B2C] text-white overflow-hidden">

    <!-- ============ HEADER (absolute, neo theo viewport) ============ -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-3xl">
      <AppHeader />
    </div>

    <!-- ============ CỘT TRÁI 60% — FIXED HEIGHT ============ -->
    <aside class="hidden md:flex md:w-[60%] flex-shrink-0 relative items-center justify-center overflow-hidden">
      <img
        :src="heroImage"
        alt="Vision UI Hero"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-black/30 to-[#0B0B2C]/60"></div>

      <div class="relative z-10 text-center px-8">
        <p class="text-xs md:text-sm tracking-[0.3em] text-gray-200 mb-3">
          INSPIRED BY THE FUTURE:
        </p>
        <h1 class="text-2xl lg:text-4xl font-bold tracking-wider">
          THE VISION UI DASHBOARD
        </h1>
      </div>
    </aside>

    <!-- ============ CỘT PHẢI 40% — TỰ SCROLL bên trong ============ -->
    <!-- overflow-y-auto: nếu form dài hơn 100vh, chỉ cột này scroll
         → cột trái và header không bị ảnh hưởng. -->
    <section class="w-full md:w-[40%] flex-shrink-0 flex flex-col min-w-0 overflow-y-auto">
      <main class="flex-1 flex items-start px-[103px] pt-[279px] pb-10">
        <div class="w-full max-w-[452px]">
          <slot />
        </div>
      </main>

      <footer class="px-6 py-4 text-center text-xs text-gray-400 flex-shrink-0">
        <p>@ 2026, Made with ♥ by you for a better web</p>
        <div class="flex justify-center gap-6 mt-2">
          <a href="#" class="hover:text-white transition">Marketplace</a>
          <a href="#" class="hover:text-white transition">Blog</a>
          <a href="#" class="hover:text-white transition">License</a>
        </div>
      </footer>
    </section>
  </div>
</template>
