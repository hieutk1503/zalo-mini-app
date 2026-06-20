# Feature Expansion Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Hoàn thiện 3 nhóm chức năng cốt lõi chưa hoạt động: Quản lý Nội dung (CMS), Quản lý Biểu mẫu (Forms), và Xác thực tự động qua Zalo (Zalo Auth).

**Architecture:** Sử dụng React/Tailwind cho giao diện Admin CRUD (tương tự như AdminFeedbacks hiện có). Tận dụng các REST API đã có sẵn trong NestJS backend (`/news`, `/planning`, `/investment`, `/bidding`, `/form-template`). Với Zalo Auth, sử dụng `zmp-sdk` ở frontend để lấy access token và truyền xuống backend xác thực.

**Tech Stack:** React (Zalo Mini App), NestJS, Prisma, Tailwind CSS.

---

## Task Structure (Phase 1) - Hoàn thành
(Đã làm CMS Content Management: AdminNews, AdminPlanning, AdminInvestment, AdminBidding, AdminDocuments).

---

## Task Structure (Phase 2) - Form & Procedures Management

**Mục tiêu:** Cho phép Admin quản lý các Thủ tục hành chính, Kho mẫu đơn và Lịch công tác.

### Task 6: Giao diện Quản lý Thủ tục hành chính (AdminProcedures)
**Files:**
- Create: `frontend-zalo/src/pages/AdminProcedures.tsx`
- Modify: `frontend-zalo/src/layouts/AdminLayout.tsx` (Add menu item)
- Modify: `frontend-zalo/src/App.tsx` (Add route)
- Modify: `backend-nestjs/src/procedures/procedures.controller.ts` & `service` (Add CRUD if missing)

**Step 1:** Kiểm tra và bổ sung API CRUD cho `AdministrativeProcedure`.
**Step 2:** Tạo giao diện bảng danh sách Thủ tục hành chính (Tên, Mã, Lệ phí, Thời gian xử lý).
**Step 3:** Tạo Modal Thêm/Sửa thủ tục.

### Task 7: Giao diện Quản lý Kho Mẫu Đơn (AdminFormTemplates)
**Files:**
- Create: `frontend-zalo/src/pages/AdminFormTemplates.tsx`
- Modify: `frontend-zalo/src/layouts/AdminLayout.tsx`
- Modify: `frontend-zalo/src/App.tsx`
- Modify: `backend-nestjs/src/form-template/form-template.controller.ts` & `service`

**Step 1:** Bổ sung API CRUD cho `FormTemplate`.
**Step 2:** Thêm trang Admin quản lý Mẫu đơn (Tên mẫu đơn, link tải file, liên kết với Thủ tục nào).

### Task 8: Giao diện Quản lý Lịch Công Tác (AdminWorkSchedule)
**Files:**
- Create: `frontend-zalo/src/pages/AdminWorkSchedule.tsx`
- Modify: `frontend-zalo/src/layouts/AdminLayout.tsx`
- Modify: `frontend-zalo/src/App.tsx`
- Modify: `backend-nestjs/src/work-schedule/work-schedule.controller.ts` & `service`

**Step 1:** Bổ sung API CRUD cho `WorkSchedule`.
**Step 2:** Thêm trang Admin quản lý Lịch công tác của Lãnh đạo phường.

### Task 9: Cập nhật giao diện người dùng (User Pages)
**Files:**
- Modify: `frontend-zalo/src/pages/Procedures.tsx`
- Modify: `frontend-zalo/src/pages/Forms.tsx` (nếu có) hoặc `ProcedureDetail.tsx`
- Modify: `frontend-zalo/src/pages/WorkSchedule.tsx`

**Step 1:** Fetch dữ liệu thật từ API để hiển thị cho các màn hình người dân.

---

## Task Structure (Phase 3) - Zalo Auth & Appointments

**Mục tiêu:** Hoàn thiện Xác thực Zalo và Quản lý Lịch hẹn.

### Task 10: Quản lý Lịch Hẹn (AdminAppointments)
**Files:**
- Modify: `backend-nestjs/src/appointments/appointments.controller.ts` & `service`

**Step 1:** Bổ sung API `GET /admin/appointments` để lấy toàn bộ lịch hẹn.
**Step 2:** Bổ sung API `PATCH /admin/appointments/:id/status` để duyệt/hủy lịch hẹn.

### Task 11: Zalo Auth Integration & Appointments UI
**Files:**
- Modify: `frontend-zalo/src/pages/Appointments.tsx`

**Step 1:** Đảm bảo `Appointments.tsx` của người dân gửi đúng thông tin khi đặt lịch (token Auth, chọn lịch).
**Step 2:** Hiển thị danh sách lịch hẹn cá nhân (Lịch sử hẹn) trên giao diện.

---
*(End of Plan)*
