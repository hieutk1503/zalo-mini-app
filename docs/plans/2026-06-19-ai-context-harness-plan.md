# Thiết kế Nâng cấp Kiến trúc AI: Context Harness & Distillation Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Triển khai Context Harness cơ bản và Dataset Distillation Script để tối ưu AI Chatbot.

**Architecture:** Tạo thư mục `core/` trong `ai-service`, bao gồm `context_harness.py` để nén tài liệu bằng thuật toán NLP (TF-IDF/BM25) và `distillation.py` để sinh Q&A offline. Sửa `chat.py` để tích hợp.

**Tech Stack:** FastAPI, Python, scikit-learn (cho TF-IDF), Ollama.

---

### Task 1: Thiết lập thư mục và công cụ NLP cơ bản

**Files:**
- Create: `ai-service/core/__init__.py`
- Create: `ai-service/core/context_harness.py`
- Modify: `ai-service/requirements.txt`

**Step 1: Cập nhật thư viện**
Thêm `scikit-learn` vào `requirements.txt` để hỗ trợ nén văn bản bằng TF-IDF.

**Step 2: Viết hàm nén văn bản (Context Compression)**
Trong `core/context_harness.py`, viết hàm `compress_context(query: str, documents: list[str], max_sentences: int = 5)`. 
Sử dụng TfidfVectorizer để chấm điểm từng câu trong documents so với query. Trả về top `max_sentences` câu có điểm cao nhất.

**Step 3: Viết hàm Guardrails cơ bản**
Trong `core/context_harness.py`, viết hàm `check_guardrails(query: str)`. Nếu query chứa từ nhạy cảm (hack, chửi bậy, chính trị...), trả về lỗi.

**Step 4: Commit**
```bash
git add ai-service/requirements.txt ai-service/core/context_harness.py
git commit -m "feat(ai): add context harness compression and guardrails"
```

---

### Task 2: Tích hợp Context Harness vào API Chat

**Files:**
- Modify: `ai-service/routers/chat.py`

**Step 1: Áp dụng Guardrails**
Thêm lệnh gọi `check_guardrails(req.query)` ngay đầu hàm `chat_with_rag`. Nếu vi phạm, `yield` chuỗi lỗi và kết thúc sớm.

**Step 2: Áp dụng Context Compression**
Sửa đoạn nối chuỗi `context = "\n".join([row["content_chunk"] for row in rows])` trong hàm `search_database`. Truyền `context` và `standard_query` vào `compress_context()` để lấy đoạn tóm tắt ngắn gọn.

**Step 3: Kiểm thử luồng chạy**
Gọi thử API bằng `curl` hoặc chạy app Frontend để đảm bảo hệ thống RAG không bị lỗi và trả về dữ liệu chuẩn.

**Step 4: Commit**
```bash
git add ai-service/routers/chat.py
git commit -m "feat(ai): integrate context harness into chat flow"
```

---

### Task 3: Script tạo Dataset Distillation Offline

**Files:**
- Create: `ai-service/scripts/distill_dataset.py`

**Step 1: Viết kịch bản tổng hợp Q&A**
Viết một script Python độc lập. Script này kết nối Postgres, lấy 5 `AdministrativeProcedure` đầu tiên. Với mỗi thủ tục, gọi model `qwen2.5` qua thư viện `ollama` với prompt yêu cầu sinh ra 3 câu hỏi và câu trả lời (Q&A) tương ứng.

**Step 2: Chạy script và in kết quả**
Chạy `python scripts/distill_dataset.py` để chứng minh script sinh được dữ liệu chuẩn.

**Step 3: Commit**
```bash
git add ai-service/scripts/distill_dataset.py
git commit -m "feat(ai): add dataset distillation script for offline usage"
```
