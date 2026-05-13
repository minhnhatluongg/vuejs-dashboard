# TASKS — Vue Supabase Dashboard (Project/Task Manager)

> Mục tiêu: Build dashboard quản lý **Projects + Tasks** theo phong cách Vision UI.
> Stack: Vue 3 + Vite + Pinia + Vue Router + Tailwind + Supabase + Chart.js.
> Quy ước: Mỗi task có **Mục tiêu** và **Done khi**. Tự tư duy cách làm, chỉ Google/đọc docs khi bí.

---

## PHASE 0 — Khởi tạo cấu trúc dự án

### [ ] 0.1 Dọn dẹp boilerplate
- Mục tiêu: Xóa `HelloWorld.vue`, làm sạch `App.vue`.
- Done khi: `App.vue` chỉ còn `<router-view />`, không còn import HelloWorld.

### [ ] 0.2 Tạo cấu trúc thư mục chuẩn
- Mục tiêu: Tổ chức code theo feature.
- Done khi: Có đủ các folder dưới `src/`:
  ```
  src/
  ├── assets/
  ├── components/   (UI components dùng chung: Button, Card, Input...)
  ├── layouts/      (DefaultLayout, AuthLayout)
  ├── views/        (DashboardView, LoginView, ProjectsView...)
  ├── router/       (index.js)
  ├── stores/       (auth, projects, tasks - Pinia)
  ├── services/     (supabase.js, projectService.js, taskService.js)
  ├── composables/  (useAuth, useProjects...)
  └── utils/
  ```

### [ ] 0.3 Cấu hình biến môi trường
- Mục tiêu: Tách Supabase URL/Key ra `.env`.
- Done khi: Có file `.env.local` chứa `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, đã thêm `.env.local` vào `.gitignore`.

### [ ] 0.4 Khởi tạo Supabase client
- Mục tiêu: Tạo singleton client.
- Done khi: File `src/services/supabase.js` export 1 instance `createClient()` đọc từ `import.meta.env`.

---

## PHASE 1 — Database Schema (Supabase)

### [ ] 1.1 Tạo bảng `profiles`
- Cột: `id (uuid, FK auth.users)`, `full_name`, `avatar_url`, `created_at`.
- Done khi: Có trigger tự tạo profile khi user đăng ký.

### [ ] 1.2 Tạo bảng `projects`
- Cột: `id`, `name`, `description`, `color`, `owner_id (FK profiles)`, `created_at`.
- Done khi: Bật RLS, policy "owner only".

### [ ] 1.3 Tạo bảng `tasks`
- Cột: `id`, `project_id (FK)`, `title`, `description`, `status` (todo/in_progress/done), `priority` (low/medium/high), `due_date`, `assignee_id`, `created_at`.
- Done khi: Bật RLS, policy theo `project.owner_id`.

### [ ] 1.4 Seed data thử
- Mục tiêu: Có sẵn data để test UI.
- Done khi: Insert tay 2 projects + 5–10 tasks mẫu trên Supabase Dashboard.

---

## PHASE 2 — Authentication (Email + Password)

### [ ] 2.1 Tạo Auth Layout
- Mục tiêu: Layout chia 2 cột (hero bên trái, form bên phải) như ảnh Vision UI.
- Done khi: `layouts/AuthLayout.vue` dùng slot, áp dụng cho login/register.

### [ ] 2.2 Trang Sign Up
- Done khi: Form name/email/password → gọi `supabase.auth.signUp()` → redirect về `/dashboard` nếu thành công, hiển thị lỗi nếu fail.

### [ ] 2.3 Trang Sign In
- Done khi: Form email/password → `signInWithPassword()` → lưu session, redirect dashboard.

### [ ] 2.4 Pinia store `useAuthStore`
- Mục tiêu: Quản lý `user`, `session`, các action `login/logout/register`.
- Done khi: Store lắng nghe `supabase.auth.onAuthStateChange`, tự sync khi reload trang.

### [ ] 2.5 Route guard
- Mục tiêu: Chặn truy cập dashboard khi chưa login.
- Done khi: `router.beforeEach` redirect về `/login` nếu chưa có session.

### [ ] 2.6 Logout
- Done khi: Bấm nút logout → clear session → quay về `/login`.

---

## PHASE 3 — Layout chính (Dashboard)

### [ ] 3.1 DefaultLayout
- Mục tiêu: Sidebar trái + Topbar + content area.
- Done khi: `layouts/DefaultLayout.vue` có `<router-view />`, áp dụng cho mọi route protected.

### [ ] 3.2 Sidebar
- Done khi: Có menu Dashboard / Projects / Tasks / Profile, link active đổi màu, theme dark tím (gradient).

### [ ] 3.3 Topbar
- Done khi: Hiển thị tên user, avatar, nút logout, breadcrumb đơn giản.

---

## PHASE 4 — Projects CRUD

### [ ] 4.1 List projects
- Done khi: View `/projects` fetch từ Supabase, render dạng grid card (tên, màu, số task).

### [ ] 4.2 Pinia store `useProjectsStore`
- Done khi: Có `state: projects[]`, actions `fetchAll`, `create`, `update`, `remove`.

### [ ] 4.3 Tạo project mới
- Done khi: Modal form (name, description, color) → insert vào DB → list update realtime (hoặc refetch).

### [ ] 4.4 Sửa / xóa project
- Done khi: Mỗi card có menu Edit/Delete, có confirm trước khi xóa.

### [ ] 4.5 Trang chi tiết project
- Done khi: `/projects/:id` hiển thị thông tin project + danh sách tasks thuộc project đó.

---

## PHASE 5 — Tasks CRUD

### [ ] 5.1 List tasks theo project
- Done khi: Trong trang chi tiết project, hiển thị tasks dạng bảng hoặc Kanban (3 cột todo/in_progress/done).

### [ ] 5.2 Tạo task mới
- Done khi: Form title/description/priority/due_date/status → insert DB.

### [ ] 5.3 Cập nhật trạng thái task
- Done khi: Đổi status (dropdown hoặc drag-drop nếu Kanban) → update DB.

### [ ] 5.4 Xóa task + filter
- Done khi: Xóa được task; có filter theo priority/status.

---

## PHASE 6 — Dashboard tổng quan + Charts

### [ ] 6.1 Stats cards
- Mục tiêu: Hiển thị số liệu tổng (Tổng projects, tổng tasks, task done %, task quá hạn).
- Done khi: Trang `/dashboard` có 4 card số liệu, fetch bằng count query Supabase.

### [ ] 6.2 Chart phân bố task theo status
- Done khi: Dùng Chart.js (Doughnut) hiển thị tỉ lệ todo/in_progress/done.

### [ ] 6.3 Chart task tạo theo thời gian
- Done khi: Line chart 7 ngày gần nhất số task được tạo.

### [ ] 6.4 Recent tasks widget
- Done khi: Bảng 5 task mới nhất với link tới project.

---

## PHASE 7 — Profile

### [ ] 7.1 Trang profile
- Done khi: User xem/sửa được full_name, avatar (upload lên Supabase Storage).

### [ ] 7.2 Đổi mật khẩu
- Done khi: Có form đổi password gọi `supabase.auth.updateUser`.

---

## PHASE 8 — Polish & Deploy

### [ ] 8.1 Loading & Error states
- Done khi: Mọi fetch có spinner + xử lý lỗi (toast hoặc alert).

### [ ] 8.2 Responsive
- Done khi: Layout chạy tốt trên mobile (sidebar collapse).

### [ ] 8.3 Deploy
- Done khi: Deploy lên Vercel/Netlify, demo URL hoạt động với env vars production.

### [ ] 8.4 README cho CV
- Done khi: README có mô tả, screenshot, tech stack, hướng dẫn chạy local, link demo.

---

## Tips học hiệu quả

1. **Làm từng Phase, đừng nhảy cóc** — phase sau phụ thuộc phase trước.
2. **Sau mỗi task, tự hỏi**: "Tại sao mình làm thế này? Có cách khác không?"
3. **Bí ở đâu** → đọc docs (Vue 3, Pinia, Supabase JS) trước khi tìm Stack Overflow.
4. **Commit git** sau mỗi task xong, message rõ ràng (vd: `feat(auth): add login form`).
5. **Đừng copy-paste** — gõ tay từng dòng để não nhớ.
