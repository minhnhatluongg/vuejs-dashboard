<script setup>
// DashboardView — tạm thời chỉ hiển thị user info để test login.
// Sau này sẽ làm thành dashboard thật ở Phase 6.
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  const { error } = await authStore.logout()
  if (error) {
    alert('Logout failed: ' + error.message)
    return
  }
  router.replace('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0B2C] text-white p-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
        <h2 class="text-lg font-semibold mb-3">Welcome 👋</h2>
        <p class="text-gray-300">Full name: <span class="text-white">{{ authStore.userFullName || '(none)' }}</span></p>
        <p class="text-gray-300">Email: <span class="text-white">{{ authStore.userEmail }}</span></p>
        <p class="text-gray-300">User ID: <span class="text-xs font-mono text-purple-400">{{ authStore.user?.id }}</span></p>
      </div>

      <button @click="handleLogout"
              class="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-sm transition">
        Logout
      </button>
    </div>
  </div>
</template>
