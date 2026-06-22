# BẢN THIẾT KẾ: NÂNG CẤP GIAO DIỆN TRANG CHỦ (HOME PAGE UPGRADE)

## 1. Mục tiêu (Objective)
Nâng cấp giao diện trang chủ (`Home.tsx`) của dự án `frontend-zalo` (Tự Lạn Smart) dựa trên cảm hứng từ dự án mẫu `mna-zaui-egov-sample` của Zalo. 
Tuyệt đối không sao chép nguyên bản kiến trúc phức tạp của bản mẫu, mà sẽ code lại (rewrite) bằng **TailwindCSS v4** và **Lucide Icons** để đảm bảo ứng dụng siêu nhẹ, tối ưu hiệu năng và đồng nhất với kiến trúc codebase hiện tại.

## 2. Các khối giao diện (Design Sections)

Trang chủ sẽ được chia làm 4 khối theo chiều dọc:

### 2.1. Hero Header (Banner Chào mừng & Thời tiết)
- **Visuals:** Khối Gradient đỏ đô/xanh dương mang tính chất cơ quan hành chính nhà nước.
- **Content:** Tiêu đề "CHÍNH QUYỀN SỐ" - Phường Tự Lạn.
- **Dynamic Elements:** Đồng hồ thời gian thực (`HH:MM DD/MM/YYYY`) và Widget thời tiết cơ bản (sử dụng icon tĩnh hoặc logic đơn giản).

### 2.2. Stat Cards (Thẻ Thống kê)
- **Visuals:** Nằm đè một nửa lên khối Hero Header (negative margin) để tạo chiều sâu 3D.
- **Content:** Hiển thị Dân số (VD: 14.390) và Diện tích (VD: 67,68 km²).

### 2.3. Tile Grid (Lưới Menu Thông minh)
- Phân nhóm chức năng thay vì gom chung:
    - **Nhóm "Dành cho công dân":** Đặt lịch hẹn, Phản ánh, Thủ tục, Kho văn bản, Đường dây nóng, Bản đồ, Cổng Dịch vụ công QG.
    - **Nhóm "Quản lý khu phố / Doanh nghiệp":** Quy hoạch, Dự án, Đấu thầu, Kho mẫu đơn, Lịch công tác.
- **Visuals:** Bo góc (rounded-2xl), bóng đổ nhẹ (shadow-sm), màu nền pastel cho các icon.

### 2.4. Featured News (Tin tức & Sự kiện)
- Hiển thị danh sách tin tức lấy từ API (`/news`).
- **Visuals:** Thẻ tin tức có Icon chuông nổi bật, ngày tháng, hiển thị dạng danh sách tinh gọn.

## 3. Kiến trúc kỹ thuật
- **File:** `d:\Nam3-Ky2\VissSoft\mini-app\frontend-zalo\src\pages\Home.tsx`
- **Component Model:** Tạo các functional sub-components trực tiếp trong cùng file `Home.tsx` (như `HeroHeader`, `StatCards`, `TileGrid`, `NewsSection`) để dễ quản lý, hoặc tách file nếu file quá dài. (Ưu tiên gộp file nếu dưới 300 dòng để đơn giản hóa).
- **Styling:** Thuần Tailwind v4 (`@tailwindcss/postcss`). Không cài thêm thư viện CSS/UI nào khác.

## 4. Rủi ro & Cách xử lý
- **Lỗi tràn màn hình (Overflow):** Đảm bảo padding-bottom đầy đủ để không bị thanh Bottom Navigation của Zalo đè lên chữ.
- **Call API:** Đảm bảo vẫn giữ lại hook `useEffect` gọi `/news` từ backend NestJS hiện tại.
