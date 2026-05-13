// src/services/supabase.js
// Singleton Supabase client — dùng chung toàn app.
// Tại sao singleton? Vì Supabase client tự quản lý session, realtime, cache...
// Nếu tạo nhiều instance sẽ bị conflict session.

import { createClient } from '@supabase/supabase-js'

// Đọc config từ biến môi trường (Vite tự inject vào import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate sớm — nếu thiếu env, fail nhanh, đỡ debug mò
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Check .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Tự động lưu session vào localStorage → user không bị logout khi reload
    persistSession: true,
    // Tự refresh access token trước khi hết hạn
    autoRefreshToken: true,
    // Lắng nghe URL có ?access_token=... (cho OAuth callback - sau này dùng)
    detectSessionInUrl: true,
  },
})
