# Procedures (Thủ tục hành chính) Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Xây dựng tính năng Danh mục thủ tục hành chính thiết yếu, cho phép người dân tìm kiếm, tra cứu danh sách và xem chi tiết thông tin thủ tục (hồ sơ, lệ phí, thời hạn...).

**Architecture:** Cập nhật API `GET /procedures` trên NestJS để hỗ trợ query param `?q=...` (tìm kiếm không phân biệt hoa thường bằng Prisma `mode: 'insensitive'`). Xây dựng 2 trang trên React (Vite): `Procedures` (Danh sách & Tìm kiếm) và `ProcedureDetail` (Chi tiết thủ tục).

**Tech Stack:** NestJS, Prisma (PostgreSQL), React Router, TailwindCSS.

## User Review Required

- Giao diện tra cứu thủ tục sẽ được thiết kế dạng danh sách (List view) với thanh tìm kiếm (Search bar) dính ở trên cùng (Sticky). Bạn có đồng ý với thiết kế này không?
- Chi tiết thủ tục sẽ hiển thị theo dạng các khối thông tin (Mã thủ tục, Thời hạn, Lệ phí, Các bước thực hiện).

---

### Task 1: Cập nhật API Tìm kiếm Thủ tục (Backend)

**Files:**
- Modify: `src/procedures/procedures.service.ts`
- Modify: `src/procedures/procedures.controller.ts`

**Step 1: Update Controller**
Thêm query param `@Query('q') q?: string` vào hàm `findAll`.

**Step 2: Update Service**
Sử dụng `q` để lọc trong Prisma:
```typescript
findAll(q?: string) {
  if (!q) return this.prisma.administrativeProcedure.findMany({ orderBy: { title: 'asc' } });
  
  return this.prisma.administrativeProcedure.findMany({
    where: {
      title: { contains: q, mode: 'insensitive' }
    },
    orderBy: { title: 'asc' }
  });
}
```

---

### Task 2: Frontend - Xây dựng trang Danh sách Thủ tục (`Procedures.tsx`)

**Files:**
- Create: `src/pages/Procedures.tsx`

**Step 1: Write UI & Logic**
- Sử dụng `useState` cho `searchQuery` và `procedures` list.
- Gọi `api.get('/procedures?q=' + searchQuery)`. Cập nhật list khi gõ tìm kiếm (có thể dùng debounce hoặc bấm nút tìm kiếm).
- Hiển thị danh sách dạng Card (Tên thủ tục, Mã thủ tục), bấm vào sẽ chuyển hướng sang `/procedures/:id`.

---

### Task 3: Frontend - Xây dựng trang Chi tiết Thủ tục (`ProcedureDetail.tsx`)

**Files:**
- Create: `src/pages/ProcedureDetail.tsx`

**Step 1: Write UI & Logic**
- Lấy `id` từ URL parameter (`useParams`).
- Gọi `api.get('/procedures/' + id)` để lấy thông tin.
- Giao diện hiển thị: Tiêu đề lớn, các badges (Lệ phí, Thời gian), và phần nội dung chi tiết (Các bước, Thành phần hồ sơ).
- Nút Action: "Hỏi đáp AI về thủ tục này" (chuyển sang `/chatbot` kèm context) và "Tải biểu mẫu".

---

### Task 4: Frontend - Cập nhật Router

**Files:**
- Modify: `src/App.tsx`

**Step 1: Thêm routes**
Đăng ký `<Route path="procedures" element={<Procedures />} />` và `<Route path="procedures/:id" element={<ProcedureDetail />} />` vào trong `MainLayout`.
