# Thiết kế Hệ thống Đăng nhập & Phân quyền Quản trị (Admin RBAC)

## 1. Mục tiêu
Cung cấp một cơ chế bảo mật (Authentication & Authorization) độc lập để bảo vệ các chức năng quản trị hệ thống (như Nhập dữ liệu Excel, quản lý thủ tục, duyệt hồ sơ) dành riêng cho Cán bộ/Quản trị viên. Đảm bảo tính tách biệt hoàn toàn giữa tài khoản người dân (Citizen qua Zalo) và tài khoản làm việc của cán bộ.

## 2. Kiến trúc Xác thực (JWT Authentication)
Hệ thống sử dụng tiêu chuẩn JSON Web Token (JWT) để xác thực.
- **Backend (NestJS)**: Cung cấp API cấp phát Token và kiểm tra Token.
- **Frontend (React)**: Quản lý Form đăng nhập, lưu trữ Token và đính kèm vào các Request gọi API quản trị.

## 3. Các thành phần chi tiết

### 3.1. Database (Prisma)
Sử dụng bảng `Admin` đã có sẵn:
- `email`: Tên đăng nhập.
- `password_hash`: Lưu trữ mật khẩu đã được mã hóa một chiều (bcrypt). Không lưu mật khẩu gốc.
- `role`: Vai trò (Mặc định: `CAN_BO`, có thể mở rộng `SUPER_ADMIN`).

### 3.2. Backend (NestJS)
Tạo mới module `AdminAuthModule`:
- **API `POST /admin-auth/login`**: Nhận `email` và `password`. Kiểm tra với CSDL. Nếu đúng, sử dụng `@nestjs/jwt` để sinh ra một chuỗi Access Token và trả về cho Client.
- **Guard `AdminAuthGuard`**: Một lớp bảo vệ cho các API. Khi gắn Guard này vào API (vd: API Nhập Excel), nó sẽ giải mã token từ Header `Authorization: Bearer <token>`. Nếu token hợp lệ và có `role` hợp lệ thì mới cho qua.

### 3.3. Frontend (React/Vite)
- **Trang Đăng nhập (`/admin/login`)**: Form nhập Email & Password đơn giản, chuyên nghiệp.
- **Quản lý trạng thái (Zustand/Local Storage)**: Lưu trữ chuỗi JWT Token sau khi đăng nhập thành công.
- **Axios Interceptor**: Cấu hình Axios tự động bắt mọi request có URL bắt đầu bằng `/admin/*` hoặc các API quản trị và nhét Token vào Header trước khi gửi đi. Nếu Backend trả về lỗi 401 (Hết hạn Token), tự động văng ra trang `/admin/login`.

## 4. Bảo mật
- Mật khẩu được băm bằng `bcrypt` với 10 vòng salt.
- Token có thời hạn (ví dụ: 1 ngày) để tránh bị lộ lọt vĩnh viễn.
- Chỉ các API được bảo vệ bởi `AdminAuthGuard` mới yêu cầu token, không làm ảnh hưởng đến các API tra cứu tự do của người dân.
