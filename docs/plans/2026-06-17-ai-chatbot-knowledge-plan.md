# Kế hoạch Nâng cấp AI Chatbot: Bảng KnowledgeVector & Auto-Sync

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Chuyển đổi bảng dữ liệu học của AI từ việc chỉ hỗ trợ Thủ tục hành chính (`ProcedureVector`) sang hỗ trợ mọi loại dữ liệu (Tin tức, Văn bản, v.v...) bằng một bảng tổng quát `KnowledgeVector`. Sau đó, xây dựng cơ chế tự động đồng bộ (Auto-Sync) bên Backend NestJS.

## User Review Required

- **Xoá bảng cũ**: Việc xoá bảng `ProcedureVector` sẽ làm mất dữ liệu học hiện tại của Chatbot (cần phải tự động sync lại). Tuy nhiên, vì đây là môi trường dev nên không có vấn đề lớn.
- **Auto-Sync Trigger**: Hiện tại ứng dụng chưa có API POST/PUT cho News và Documents (chỉ có API đọc). Do đó, để minh hoạ tính năng Auto-Sync, chúng ta sẽ tạo một Service `AiSyncService` trong NestJS với 1 hàm `syncAllKnowledge()` để duyệt toàn bộ dữ liệu có trong DB và gửi sang AI Service.

---

### Task 1: Cập nhật Schema Database (NestJS & Prisma)

**Files:**
- Modify: `backend-nestjs/prisma/schema.prisma`

**Steps:**
- Định nghĩa model `KnowledgeVector`:
  ```prisma
  model KnowledgeVector {
    id            Int      @id @default(autoincrement())
    source_type   String   // Ví dụ: 'PROCEDURE', 'NEWS', 'DOCUMENT'
    source_id     Int
    content_chunk String
    embedding     Unsupported("vector")?
    created_at    DateTime @default(now())
  }
  ```
- Xoá bỏ model `ProcedureVector` và xoá relation tương ứng trong `AdministrativeProcedure`.
- Chạy lệnh `npx prisma format` và `npx prisma migrate dev --name init_knowledge_vector`.

---

### Task 2: Cập nhật AI Service (FastAPI)

**Files:**
- Modify: `ai-service/routers/embeddings.py`
- Modify: `ai-service/routers/chat.py`

**Steps:**
- Sửa API `/sync` trong `embeddings.py`:
  - Request body nhận vào: `source_type`, `source_id`, `content_chunk`.
  - Thay đổi câu lệnh SQL INSERT vào bảng `KnowledgeVector` thay vì `ProcedureVector`.
- Sửa API `/query` trong `chat.py`:
  - Đổi câu lệnh `SELECT` để search từ bảng `KnowledgeVector`.
  - Cập nhật câu Prompt cho Qwen để chung chung hơn (ví dụ: "Dựa vào các dữ liệu về văn bản, thủ tục và tin tức sau đây...").

---

### Task 3: Xây dựng AI Sync Service trong NestJS

**Files:**
- Create: `backend-nestjs/src/ai-sync/ai-sync.module.ts`
- Create: `backend-nestjs/src/ai-sync/ai-sync.service.ts`
- Create: `backend-nestjs/src/ai-sync/ai-sync.controller.ts`
- Modify: `backend-nestjs/src/app.module.ts`

**Steps:**
- Thêm module `AiSyncModule` có sử dụng `HttpModule` (để gọi API sang port của `ai-service`).
- Viết `AiSyncService` với logic:
  1. Gọi lệnh Prisma để `DELETE FROM "KnowledgeVector"` (xoá toàn bộ data cũ).
  2. Lấy toàn bộ News từ DB, format lại thành string `[Tin tức: {title}] {content}`, gửi tới `ai-service/api/embeddings/sync`.
  3. Lấy toàn bộ Documents, format: `[Văn bản: {document_no}] {abstract}`.
  4. Lấy toàn bộ Procedures, format: `[Thủ tục: {code}] {title} - {description} - Phí: {fee} - T/gian: {duration}`.
- Tạo 1 endpoint `POST /ai-sync/trigger-all` để có thể bấm chạy đồng bộ lại toàn bộ dữ liệu.
