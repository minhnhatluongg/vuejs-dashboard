// src/stores/authStore.js
// Auth store — single source of truth cho user/session toàn app.
// Mọi component đọc user từ đây, không gọi supabase.auth.getUser() trực tiếp.

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', () => {
  // ============ STATE ============
  const user = ref(null)           // object user từ Supabase, null nếu chưa login
  const session = ref(null)        // session token (access_token, refresh_token...)
  const loading = ref(true)        // true khi đang khởi tạo (check session từ localStorage)

  // ============ GETTERS (computed) ============
  // Computed: tự động re-compute khi user thay đổi → các component dùng sẽ tự re-render
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email ?? '')
  const userFullName = computed(() => user.value?.user_metadata?.full_name ?? '')

  // ============ ACTIONS ============

  // Khởi tạo: gọi khi app start để check xem có session sẵn không
  // (Supabase tự lưu session trong localStorage, persistSession: true ở supabase.js)
  async function init() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null
    } finally {
      loading.value = false
    }

    // Lắng nghe mọi thay đổi auth (login, logout, token refresh, từ tab khác...)
    // Đăng ký 1 lần duy nhất, sống suốt life của app
    supabase.auth.onAuthStateChange((event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
      // event có thể là: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY
      console.log('[auth event]', event)
    })
  }

  // Đăng nhập với email + password
  // Trả về { error } để component biết success/fail
  async function login(email, password) {
    // Trim email — Supabase nhạy với khoảng trắng
    const cleanEmail = email.trim().toLowerCase()

    console.log('[login] attempt with email:', cleanEmail)
    console.log('[login] password length:', password.length)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })

    if (error) {
      console.error('[login] error:', error)
      return { error }
    }
    console.log('[login] success:', data.user?.email)

    // Không cần set user thủ công — onAuthStateChange ở init() sẽ tự sync
    return { data }
  }

  // Đăng xuất
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) return { error }
    return {}
  }

  // Expose ra ngoài (chỉ những gì component cần)
  return {
    // state
    user,
    session,
    loading,
    // getters
    isAuthenticated,
    userEmail,
    userFullName,
    // actions
    init,
    login,
    logout,
  }
})
