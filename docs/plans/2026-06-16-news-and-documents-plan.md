# Tin tức & Kho văn bản (News & Documents) Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Hiện thực hoá Nhóm 1 các chức năng tĩnh: "Tin tức - sự kiện" và "Kho văn bản điện tử" bằng cách lấy dữ liệu động từ Backend thay vì dùng mock UI.

**Architecture:** 
- **Backend:** Tạo 2 modules NestJS mới là `news` và `documents`. Cung cấp API `GET /news` và `GET /documents`.
- **Frontend:** Cập nhật trang `Home` để lấy tin tức mới nhất. Thêm trang `Documents` với cấu trúc tab (Nghị quyết Đảng uỷ / HĐND) và chức năng tìm kiếm cơ bản.

**Tech Stack:** NestJS, Prisma (PostgreSQL), React Router, TailwindCSS.

## User Review Required

- Giao diện "Kho văn bản điện tử" sẽ chia 2 tab: Nghị quyết Đảng uỷ / Nghị quyết HĐND và hỗ trợ thanh tìm kiếm (Tìm theo số hiệu, trích yếu). Thiết kế này có đúng với mong muốn của bạn không?
- Tin tức ở trang chủ hiện tại chỉ có 1 tin nổi bật. Mình sẽ làm API trả về list và map ra danh sách. Bấm vào tin tức sẽ mở trang Chi tiết (`/news/:id`).

---

### Task 1: Backend - News & Documents APIs

**Files:**
- Create: `src/news/news.module.ts`, `src/news/news.controller.ts`, `src/news/news.service.ts`
- Create: `src/documents/documents.module.ts`, `src/documents/documents.controller.ts`, `src/documents/documents.service.ts`
- Modify: `src/app.module.ts` (Import NewsModule, DocumentsModule)

**Step 1: Write News Service & Controller**
- `NewsService` có hàm `findAll(take?: number)` để lấy list bài mới nhất, và `findOne(id)`.
- `NewsController` có `@Get()` và `@Get(':id')`.

**Step 2: Write Documents Service & Controller**
- `DocumentsService` có hàm `findAll(type?: string, q?: string)` để tìm kiếm văn bản theo loại và từ khóa.
- `DocumentsController` nhận query param `@Query('type')` và `@Query('q')`.

---

### Task 2: Frontend - Cập nhật Tin tức trên Trang chủ (`Home.tsx`) và Chi tiết (`NewsDetail.tsx`)

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/pages/NewsDetail.tsx`
- Modify: `src/App.tsx` (Add `/news/:id` route)

**Step 1: Fetch News ở Home**
- Dùng `useEffect` gọi `api.get('/news')`. Thay thế phần hiển thị mock tĩnh bằng `map()` dữ liệu thật.

**Step 2: Viết NewsDetail**
- Nhận `:id` từ URL, lấy nội dung tin tức, hiển thị Title, Date, Thumbnail (nếu có) và Content.

---

### Task 3: Frontend - Xây dựng trang Kho văn bản (`Documents.tsx`)

**Files:**
- Create: `src/pages/Documents.tsx`
- Modify: `src/pages/Home.tsx` (Add link tới Kho văn bản)
- Modify: `src/App.tsx` (Add `/documents` route)

**Step 1: Giao diện & Logic Documents.tsx**
- Tạo header "Kho văn bản điện tử".
- Tạo Tabs chuyển đổi giữa `DANG_UY` và `HDND`.
- Tạo Search bar cập nhật keyword tìm kiếm.
- Dùng `useEffect` fetch `api.get('/documents?type=...&q=...')`.
- Hiển thị danh sách các văn bản (Số hiệu, Trích yếu, Ngày đăng) với nút Tải xuống.

**Step 2: Cập nhật Home menu**
- Thêm icon/menu dẫn đến route `/documents`.
