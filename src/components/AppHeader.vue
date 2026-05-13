<script setup>
// AppHeader: header dùng chung cho các trang auth (và sau này cả dashboard).
// Dùng RouterLink thay <a href> để Vue Router xử lý navigation, không reload trang.
import iconDashboard from '@/assets/Icon-dashboard.png'
import iconProfile from '@/assets/Icon-profile.png'
import iconSignup from '@/assets/Icon-signup.png'
import iconSignin from '@/assets/Icon-signin.png'
</script>

<template>
  <!-- w-full để header chiếm toàn bộ container cha (đã fix max-w từ AuthLayout)
       → state active không thể làm header dài/ngắn ra. -->
  <header class="header-bubble w-full flex items-center gap-4 px-6 py-3
                 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
    <span class="text-xs md:text-sm tracking-[0.2em] font-semibold whitespace-nowrap">
      VISION UI FREE
    </span>

    <!-- Nav căn giữa, chiếm flex-1 để VISION UI FREE và Free Download neo 2 đầu -->
    <nav class="hidden lg:flex flex-1 justify-center gap-2 text-[11px] text-gray-300">
      <RouterLink to="/dashboard" class="bubble-link">
        <img :src="iconDashboard" alt="Dashboard" class="w-3 h-3 mr-1.5 object-contain" />
        DASHBOARD
      </RouterLink>
      <RouterLink to="/profile" class="bubble-link">
        <img :src="iconProfile" alt="Profile" class="w-3 h-3 mr-1.5 object-contain" />
        PROFILE
      </RouterLink>
      <RouterLink to="/register" class="bubble-link">
        <img :src="iconSignup" alt="Sign Up" class="w-3 h-3 mr-1.5 object-contain" />
        SIGN UP
      </RouterLink>
      <RouterLink to="/login" class="bubble-link">
        <img :src="iconSignin" alt="Sign In" class="w-3 h-3 mr-1.5 object-contain" />
        SIGN IN
      </RouterLink>
    </nav>

    <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[11px]
                   font-semibold rounded-lg transition whitespace-nowrap">
      Free Download
    </button>
  </header>
</template>

<style scoped>
/* === Bubble glow cho cả header === */
.header-bubble {
  position: relative;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15),
              0 0 60px rgba(59, 130, 246, 0.1);
}

.header-bubble::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(135deg,
    rgba(168, 85, 247, 0.4),
    rgba(59, 130, 246, 0.4),
    transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.5;
  pointer-events: none;
}

.header-bubble:hover {
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.3),
              0 0 80px rgba(59, 130, 246, 0.2);
}

/* === Bubble glow cho từng link nav ===
   QUAN TRỌNG: padding + border phải GIỐNG NHAU ở mọi state
   để link không thay đổi kích thước khi hover / active. */
.bubble-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  letter-spacing: 0.05em;
  white-space: nowrap;          /* không xuống dòng */
  /* Chỉ transition màu/shadow, KHÔNG transition all
     (transition: all dễ gây reflow khi đổi padding/border) */
  transition: color 0.3s ease, text-shadow 0.3s ease, background-color 0.3s ease;
}

.bubble-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(circle,
    rgba(168, 85, 247, 0.25) 0%,
    rgba(59, 130, 246, 0.15) 60%,
    transparent 100%);
  opacity: 0;
  transform: scale(0.6);
  transition: all 0.3s ease;
  pointer-events: none;
}

.bubble-link:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.bubble-link:hover::before {
  opacity: 1;
  transform: scale(1.1);
}

/* RouterLink active state */
.bubble-link.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.bubble-link.router-link-active::before {
  opacity: 0;
}
</style>
