# Frontend Migration & Integration Design

## 1. Mục tiêu (Objective)
Đẩy toàn bộ mã nguồn frontend từ Zalo E-Gov Sample (`ward-mini-app-zalo/mna-zaui-egov-sample`) sang dự án hiện tại (`frontend-zalo`), đồng thời tích hợp thành công hai tính năng cốt lõi đã phát triển trước đó:
- Hệ thống AI Chatbot (nhúng vào giao diện app).
- Hệ thống Admin quản trị tin tức.

## 2. Chiến lược Cấu trúc Thư mục
- **Xóa ruột:** Dọn dẹp toàn bộ code hiện tại trong `frontend-zalo`.
- **Chuyển giao:** Copy toàn bộ thư mục, tệp tin từ `ward-mini-app-zalo/mna-zaui-egov-sample` vào `frontend-zalo`.
- **Lợi ích:** Giữ nguyên tên thư mục gốc của dự án, không làm hỏng các terminal đang chạy `npm run dev` ở ngoài cùng, đảm bảo tính nhất quán của repo.

## 3. Tích hợp AI Chatbot
- **Từ bỏ Floating Widget:** Trên mobile, nút chat lơ lửng che mất nội dung và gây vướng víu.
- **Trang Chatbot chuyên dụng:** Zalo E-Gov Sample đã có sẵn trang `src/pages/Chatbot`. Ta sẽ tái sử dụng giao diện này nhưng thay đổi logic phía sau:
  - Gỡ bỏ logic gọi API/Mock data cũ của template.
  - Tích hợp gọi tới endpoint `http://127.0.0.1:8000/api/chat/query` (AI Service).
  - Tích hợp logic xử lý Server-Sent Events (Streaming) và hiển thị markdown giống như widget cũ đã làm.

## 4. Tích hợp Màn hình Quản trị (Admin)
- **Tạo thư mục con:** Tạo thư mục `src/pages/Admin/` để chứa các trang quản trị.
- **Copy component cũ:** Chép `AdminLogin.tsx` và `AdminNews.tsx` từ code cũ sang.
- **Routing:** Khai báo route ẩn `/admin` và `/admin/news` trong `src/app.ts` (hoặc nơi quản lý routing của ZMP). Các route này không hiển thị trên thanh điều hướng chính, chỉ dành cho cán bộ quản trị truy cập trực tiếp.

## 5. Kết nối Backend (NestJS)
- Trang Tin tức (`src/pages/News/`): Sửa lại logic fetch dữ liệu từ Mock sang gọi API `http://localhost:3000/news` của NestJS.
- Đảm bảo hiển thị đúng Thumbnail, Title, Content và xử lý HTML an toàn.

## 6. Xử lý UI framework & Dependencies
- ZMP UI (Zalo Mini App UI) sẽ đóng vai trò là framework chính.
- Cài đặt thêm các thư viện cần thiết đã dùng cho AI Chat/Admin (nếu có) như `axios`, thư viện render Markdown, `react-router` (nếu dùng khác chuẩn ZMP).
- TailwindCSS đã được cài sẵn trong ZMP sample, cần đảm bảo config tương thích với các class tiện ích ta đã viết cho Admin.
