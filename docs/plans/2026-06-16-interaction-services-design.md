# Design: Nhóm Tính năng Tương tác & Lịch hẹn (Appointments & Feedbacks)

## 1. Tổng quan
Thiết kế này nhằm mục đích phát triển nhóm dịch vụ tương tác:
- **Đặt lịch làm việc**: Người dân đặt lịch hẹn với UBND phường và được cấp vé điện tử.
- **Phản ánh hiện trường**: Người dân gửi thông tin/hình ảnh về các vấn đề trên địa bàn phường.

## 2. Authentication Flow (Soft Auth)
Do hạn chế việc tích hợp Zalo API thật cần chờ cấp phép Zalo App ID, chúng ta sẽ triển khai cơ chế **Soft Auth** để prototype:
- Giao diện (Zalo Mini App) sẽ hỏi Tên & SĐT khi lần đầu sử dụng tính năng yêu cầu định danh.
- Khi người dân nhập, Frontend sinh ra/lấy `zalo_id` lưu vào `localStorage`.
- Trên mỗi request gửi xuống Backend NestJS, Frontend sẽ truyền Header `x-zalo-id` và `x-full-name`, `x-phone`.
- Backend (NestJS) nhận request:
  - Kiểm tra xem `zalo_id` đã tồn tại trong bảng `Citizen` hay chưa.
  - Nếu chưa có, tạo mới `Citizen` với các thông tin này.
  - Gắn thông tin người dùng đó vào các Request tạo Lịch hẹn hoặc Phản ánh.

## 3. API Endpoints
### Lịch hẹn (Appointments)
- **POST `/api/appointments`**: Tạo lịch hẹn. Sinh random `ticket_number` có tiền tố `TL-`. Trạng thái đặt là `PENDING`.
- **GET `/api/appointments`**: Trả về danh sách lịch hẹn của user đang request.

### Phản ánh (Feedbacks)
- **POST `/api/feedbacks`**: Nhận `content` và `image_urls`. Trạng thái đặt là `NEW`.
- **GET `/api/feedbacks`**: Lấy danh sách phản ánh của user. Trả về danh sách có sẵn lời phản hồi của cán bộ (nếu có).

## 4. Frontend Components & UI
- **Modal Nhập Thông tin**: Trigger khi `localStorage` chưa có dữ liệu.
- **Trang `/appointments`**: Gồm form chọn Ngày (Datepicker), Giờ (Time slot), Lý do. Khi thành công, hiện popup vé điện tử.
- **Trang `/feedbacks`**: Textarea lớn để nhập phản ánh, kèm input đường dẫn ảnh mock.
- **Trang `/profile`**: Hiện thị thông tin cá nhân, lịch sử hẹn (Lịch sắp tới, Đã qua) và lịch sử phản ánh (Chờ xử lý, Đã phản hồi).
