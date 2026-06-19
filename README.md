# 🌟 Tự Lạn Smart - Zalo Mini App Dịch Vụ Công Thông Minh

Tự Lạn Smart là một hệ thống **Dịch vụ công trực tuyến** được thiết kế dưới dạng **Zalo Mini App**. Dự án mang đến trải nghiệm làm thủ tục hành chính mượt mà, tiện lợi cho người dân, kết hợp với sức mạnh của **Trí tuệ nhân tạo (AI)** để giải đáp thắc mắc tự động, nhanh chóng và chính xác.

---

## 🎯 Mục Tiêu & Yêu Cầu Dự Án

### Mục Tiêu
- **Đưa dịch vụ công đến gần người dân:** Tận dụng hệ sinh thái Zalo (nền tảng chat phổ biến nhất Việt Nam) để người dân không phải tải thêm ứng dụng mới.
- **Tự động hóa bằng AI:** Giảm tải cho cán bộ tư vấn bằng cách sử dụng AI Agent để tự động phân tích câu hỏi, tìm kiếm quy định pháp luật và hướng dẫn người dân làm thủ tục.
- **Tối ưu tốc độ & Hiệu năng:** Hệ thống phải phản hồi AI tức thì (dưới 1 giây) và có trải nghiệm mượt mà như ChatGPT.

### Tính Năng Cốt Lõi
1. **Chatbot AI Thông Minh (RAG & Tool Calling):**
   - Người dân có thể hỏi tự do bằng tiếng Việt.
   - AI tự động phân tích ý định, tra cứu cơ sở dữ liệu pháp luật (RAG) và trả về câu trả lời chính xác.
   - Trả lời theo luồng (Streaming) tạo hiệu ứng gõ chữ thời gian thực.
   - Trích xuất hành động thông minh (Gợi ý nút bấm chuyển thẳng đến màn hình nộp hồ sơ).
2. **Quản lý Thủ Tục Hành Chính:** Tra cứu quy trình, thành phần hồ sơ và nộp hồ sơ trực tuyến.
3. **Đặt Lịch Hẹn:** Đặt lịch làm việc trực tiếp tại Ủy ban/Trung tâm Hành chính công.
4. **Góp Ý & Phản Ánh:** Người dân gửi phản ánh kiến nghị, tra cứu trạng thái xử lý.
5. **Hệ Quản Trị (Admin Panel):** Quản lý hồ sơ, lịch hẹn, phản ánh.

---

## 🏗 Kiến Trúc Hệ Thống (Architecture)

Dự án sử dụng kiến trúc Microservices kết hợp với Local LLM để đảm bảo bảo mật dữ liệu và hiệu năng tối đa.

### 1. Frontend: Zalo Mini App
- **Công nghệ:** React 18, Vite, TypeScript, TailwindCSS.
- **Vai trò:** Cung cấp giao diện tương tác (UI) mượt mà, tích hợp Zalo UI Components. Gọi trực tiếp API đến Backend và AI Service (qua SSE).

### 2. Backend API: NestJS Core
- **Công nghệ:** NestJS, TypeScript, Prisma ORM.
- **Cơ sở dữ liệu:** PostgreSQL.
- **Vai trò:** Quản lý logic nghiệp vụ cốt lõi (User, Đặt lịch hẹn, Phản ánh, Tài liệu quy định). Cung cấp API cho Frontend và Admin Panel.

### 3. AI Service: FastAPI & Local LLM
- **Công nghệ:** FastAPI (Python), Ollama (Local LLM), Redis Stack (Vector DB), `sse-starlette`.
- **Vai trò:** 
  - Đóng vai trò là Não bộ AI của hệ thống.
  - Sử dụng **Ollama (Model Qwen 2.5)** để chạy AI cục bộ, không tốn phí API, bảo mật dữ liệu tuyệt đối.
  - Tích hợp **RAG (Retrieval-Augmented Generation)**: Chuyển đổi tài liệu của địa phương thành Vector và tìm kiếm khi người dân đặt câu hỏi.
  - **Tool Calling (ReAct Agent):** AI có khả năng tự động quyết định khi nào cần tra cứu Database, khi nào chỉ cần chat thông thường.

### 4. Hạ Tầng Tối Ưu Tốc Độ: Redis Semantic Caching
- Để khắc phục nhược điểm AI Local chạy chậm, dự án sử dụng **Redis Vector Search**.
- Mọi câu hỏi của người dùng đều được nhúng thành Vector (bằng `nomic-embed-text`) và lưu vào Redis kèm theo câu trả lời.
- Khi một người dùng khác hỏi một câu mang **ý nghĩa tương tự** (ví dụ: *"Làm giấy khai sinh thế nào"* vs *"Thủ tục làm giấy khai sinh"*), Redis sẽ đánh giá độ tương đồng (>95%) và trả về câu trả lời cũ ngay lập tức trong **0.1 giây**, giúp tiết kiệm 100% tài nguyên GPU/CPU.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu môi trường
- NodeJS (v18+)
- Python (v3.11+)
- Docker & Docker Compose
- Ollama (cài đặt trên máy host)

### Bước 1: Khởi động Hạ tầng Docker (PostgreSQL & Redis Stack)
```bash
docker-compose up -d
```
Lệnh này sẽ khởi động cơ sở dữ liệu PostgreSQL (cổng 5432) và Redis Stack (cổng 6379, kèm giao diện Web quản lý tại cổng 8001).

### Bước 2: Khởi chạy Ollama
Cài đặt [Ollama](https://ollama.com/) và tải các Model AI cần thiết:
```bash
ollama pull qwen2.5
ollama pull nomic-embed-text
```

### Bước 3: Khởi động Backend (NestJS)
```bash
cd backend-nestjs
npm install
npx prisma db push # Tạo bảng trong Database
npm run start:dev
```
Backend sẽ chạy ở địa chỉ `http://localhost:3000`.

### Bước 4: Khởi động AI Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
AI Service sẽ chạy ở địa chỉ `http://localhost:8000`. Bạn có thể truy cập `http://localhost:8000/docs` để xem Swagger UI.

### Bước 5: Khởi động Frontend (Zalo Mini App)
```bash
cd frontend-zalo
npm install
npm run dev
```
Mở trình duyệt ở địa chỉ `http://localhost:5173` để trải nghiệm Zalo Mini App.

---

## 💡 Điểm Nổi Bật Của Việc Lập Trình Dự Án Này
1. **Trải nghiệm Streaming chuẩn ChatGPT:** Sử dụng Server-Sent Events (SSE) để bắn từng ký tự từ AI về Frontend, loại bỏ hoàn toàn cảm giác "chờ đợi loading" khó chịu.
2. **Khắc phục triệt để lỗi React Strict Mode:** Xử lý luồng Streaming cẩn thận để không bị duplicate chunks hoặc lỗi render khi React re-render.
3. **Agentic Workflow:** AI không chỉ là RAG thông thường mà là một Agent. Nó có các công cụ (Tools) và tự quyết định quy trình hành động (Reasoning -> Action -> Observation -> Final Answer).
4. **Caching bằng Toán học (Vector):** Thay vì cache theo Text thông thường (phải gõ đúng từng dấu câu mới hit cache), Semantic Cache dùng không gian Vector để hiểu "nghĩa" của câu. Giúp ứng dụng tiết kiệm cực nhiều tài nguyên và phản hồi siêu tốc.

---

> *Dự án này là minh chứng cho việc áp dụng AI thế hệ mới (Agentic Workflow, Local LLM, Vector Search) vào các bài toán thiết thực của chính phủ số, tối ưu hóa cả về chi phí lẫn trải nghiệm người dùng.*

## 📂 Cấu Trúc Thư Mục (Directory Structure)

\\	ext
mini-app/
├── ai-service/                # Dịch vụ AI (FastAPI + Ollama)
│   ├── cache_manager.py       # Xử lý nhúng Vector và Redis Semantic Cache
│   ├── database.py            # Kết nối PostgreSQL để lấy Knowledge Base
│   ├── main.py                # Điểm vào (Entry point) của FastAPI
│   └── routers/
│       ├── chat.py            # API Chatbot (SSE Streaming & RAG Agent)
│       └── embeddings.py      # API Embeddings tài liệu
│
├── backend-nestjs/            # Hệ thống Backend Core (NestJS)
│   ├── prisma/                # Schema Database & Migration
│   ├── src/
│   │   ├── admin/             # Quản lý Admin Panel
│   │   ├── appointments/      # Quản lý Đặt lịch hẹn
│   │   ├── chat/              # Chuyển tiếp (Proxy) Chatbot (Cũ)
│   │   ├── documents/         # Quản lý Tài liệu & Đồng bộ Vector
│   │   └── feedbacks/         # Quản lý Góp ý & Phản ánh
│   └── ...
│
├── frontend-zalo/             # Giao diện Zalo Mini App (React)
│   ├── src/
│   │   ├── components/        # UI Components dùng chung (Header, Modal)
│   │   ├── pages/             # Các màn hình chính (Chatbot, Thủ tục, Phản ánh)
│   │   │   ├── Chatbot.tsx    # Giao diện Chatbot (Fetch API Streaming trực tiếp)
│   │   │   └── ...
│   │   └── lib/               # Cấu hình API, Utility Functions
│   └── ...
│
└── docker-compose.yml         # Cấu hình khởi chạy Database (Postgres & Redis Stack)
\