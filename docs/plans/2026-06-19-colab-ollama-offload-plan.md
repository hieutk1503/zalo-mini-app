# Triển khai Ollama lên Google Colab Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Chuyển đổi mã nguồn `ai-service` để hỗ trợ gọi Ollama qua URL bên ngoài (Google Colab) thông qua biến môi trường.

**Architecture:** Sử dụng `ollama.Client(host=OLLAMA_HOST)` thay vì gọi trực tiếp thư viện `ollama` để linh hoạt thay đổi endpoint giữa localhost và Ngrok. Tạo file Jupyter Notebook `.ipynb` chứa script cài đặt Ollama và Ngrok để chạy trên Colab.

**Tech Stack:** Python, FastAPI, Ngrok, Google Colab.

---

### Task 1: Refactor `ai-service` để nhận `OLLAMA_HOST`

**Files:**
- Modify: `ai-service/routers/chat.py`
- Modify: `ai-service/.env.example`

**Step 1: Viết mã nguồn linh hoạt kết nối Ollama**

Trong `ai-service/routers/chat.py`, thêm import `from ollama import Client` và `import os`.
Khởi tạo `ollama_client = Client(host=os.getenv('OLLAMA_HOST', 'http://localhost:11434'))`.
Thay thế toàn bộ `ollama.chat` bằng `ollama_client.chat` và `ollama.embeddings` bằng `ollama_client.embeddings`.

**Step 2: Cập nhật biến môi trường**

Thêm `OLLAMA_HOST=http://localhost:11434` vào `ai-service/.env.example` để làm mẫu.

**Step 3: Chạy test kiểm tra (Verify it works locally)**

Chạy `python -m py_compile routers/chat.py` để đảm bảo không có lỗi cú pháp.

**Step 4: Commit**

```bash
git add ai-service/routers/chat.py ai-service/.env.example
git commit -m "refactor(ai): use ollama client with configurable host for colab support"
```

---

### Task 2: Cung cấp script chạy trên Google Colab

**Files:**
- Create: `ai-service/scripts/colab_ollama_ngrok.ipynb`

**Step 1: Viết file Notebook cài đặt**

Tạo một file `.ipynb` (hoặc `.py` hướng dẫn) chứa các đoạn mã Bash để cài đặt Ollama, tải model `qwen2.5:7b`, `nomic-embed-text` và khởi chạy pyngrok để lấy đường dẫn Public URL. 

**Step 2: Commit**

```bash
git add ai-service/scripts/colab_ollama_ngrok.ipynb
git commit -m "feat(ai): add google colab notebook for offloading ollama"
```
