# Production Deployment Design

## 1. Overview
Hệ thống Tự Lạn Smart (Zalo Mini App + NestJS Backend + AI Service) đã hoàn thiện giai đoạn Testing cục bộ (Local + Ngrok). Tài liệu này xác định các thay đổi kiến trúc và cấu hình bắt buộc để chuyển đổi hệ thống sang môi trường Production, đảm bảo bảo mật, hiệu năng, và khả năng mở rộng.

## 2. Infrastructure Architecture
Hệ thống sẽ được triển khai trên máy chủ vật lý (On-premise) của cơ quan.
Mô hình đóng gói: **Docker Compose**
*   **Nginx Reverse Proxy**: Chịu trách nhiệm nhận luồng traffic từ Internet (port 80/443), xác thực chứng chỉ SSL (Let's Encrypt hoặc chứng chỉ do cơ quan cấp) và định tuyến request đến Backend hoặc AI Service.
*   **NestJS Backend Container**: Được gỡ bỏ hoàn toàn chế độ `ZALO_AUTH_DEV_MODE`, kết nối trực tiếp với Zalo Official Account (OA) thực tế.
*   **FastAPI AI Service Container**: Cung cấp API RAG (Truy xuất và Sinh văn bản), kết nối với Backend.
*   **Database Containers**: 
    *   `PostgreSQL`: Quản lý dữ liệu công dân, thủ tục, tin tức. Dữ liệu (Volume) được lưu trữ trên host để đảm bảo toàn vẹn.
    *   `Qdrant`: Vector Database để tìm kiếm ngữ nghĩa. Volume gắn trên host.
*   **Ollama GPU Container**: Triển khai kèm `Nvidia Container Toolkit` để sử dụng trực tiếp GPU vật lý, chạy mô hình ngôn ngữ (Qwen 3B) tối ưu tốc độ xử lý câu hỏi.

## 3. Zalo Mini App (Frontend) Changes
*   Không triển khai trên máy chủ cơ quan. Ứng dụng sẽ được biên dịch (build production) và triển khai trên hạ tầng máy chủ của Zalo (Zalo Infrastructure).
*   URL API (`VITE_BASE_URL`) sẽ được cấu hình trỏ về domain chính thức của cơ quan (Ví dụ: `https://api.domain.gov.vn`).
*   Tiến hành liên kết Zalo Official Account thật, bật các quyền truy cập cần thiết và đệ trình hồ sơ Zalo Review.

## 4. Security & Configuration Fixes
*   **Authentication**: Loại bỏ đoạn mã Bypass (`fake-token-for-testing`) trong `soft-auth.guard.ts`. Cập nhật `ZALO_APP_ID` và `ZALO_APP_SECRET` trên Backend.
*   **CORS**: Thắt chặt hoặc duy trì chính sách CORS an toàn, chỉ chấp nhận request đến từ `https://zalo.me` hoặc Origin hợp lệ của Zalo.
*   **Ngrok Removal**: Xóa bỏ các tùy biến ngrok header (`ngrok-skip-browser-warning`) khỏi Frontend (`axios.ts` và `request.ts`) vì không còn cần thiết.

## 5. Success Criteria
*   Tất cả các dịch vụ (NestJS, AI, DBs, Ollama) có thể được khởi động bằng lệnh `docker-compose up -d`.
*   Zalo Mini App truy cập thành công dữ liệu thông qua Domain HTTPS công khai mà không gặp lỗi CORS hay xác thực.
*   AI Chatbot trả lời câu hỏi dưới 3 giây nhờ tận dụng GPU.
