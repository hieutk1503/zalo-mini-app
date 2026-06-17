# Tự Lạn Smart App - Kế hoạch Nhóm 2 (Tính năng tĩnh)

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Dứt điểm Nhóm 2 các tính năng bao gồm Đường dây nóng, Bản đồ chỉ đường, và Liên kết Cổng Dịch vụ công trực tuyến ngay trên Frontend. Các tính năng này không yêu cầu thêm Database Models phức tạp, hoàn toàn tĩnh.

## User Review Required

- Giao diện "Đường dây nóng" sẽ hiển thị các block thông tin với nút gọi điện thoại. Khi bấm vào sẽ tự động mở app Gọi điện của điện thoại (`tel:số_điện_thoại`).
- Giao diện "Bản đồ" sẽ nhúng 1 iframe của Google Maps hướng trực tiếp tới UBND Phường Tự Lạn.
- "Cổng DVC" sẽ dẫn thẳng sang `dichvucong.gov.vn`.

---

### Task 1: Cập nhật Cổng Dịch vụ công & Menu ở `Home.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`

**Steps:**
- Thêm icon "Cổng DVC" vào grid menu `menuItems` ở trang chủ.
- Khác với các link nội bộ sử dụng `react-router-dom` `<Link>`, icon này sẽ sử dụng thẻ `<a>` thông thường với thuộc tính `target="_blank"` để mở link external `dichvucong.gov.vn`.
- Thêm 2 icon "Đường dây nóng" và "Bản đồ" vào danh sách menu. (Grid menu sẽ chuyển từ `grid-cols-4` hoặc `grid-cols-3` sang cách chia grid hợp lý, ví dụ 2 hàng).

---

### Task 2: Xây dựng trang Đường dây nóng (`Hotline.tsx`)

**Files:**
- Create: `src/pages/Hotline.tsx`
- Modify: `src/App.tsx` (Add `/hotline` route)

**Steps:**
- Tạo layout cơ bản với Header "Đường dây nóng" và nút Back.
- Xây dựng danh sách các số điện thoại khẩn cấp: 
  - Cảnh sát 113, Cứu hỏa 114, Cấp cứu 115.
  - Số điện thoại Trực ban Công an phường.
  - Số điện thoại Bộ phận Một cửa.
- Sử dụng thẻ `<a>` với `href="tel:..."` để kích hoạt chức năng gọi.

---

### Task 3: Xây dựng trang Bản đồ & Định vị (`MapLocation.tsx`)

**Files:**
- Create: `src/pages/MapLocation.tsx`
- Modify: `src/App.tsx` (Add `/map` route)

**Steps:**
- Tạo layout cơ bản với Header "Bản đồ & Định vị" và nút Back.
- Lấy mã nhúng HTML iframe từ Google Maps (tìm kiếm toạ độ / địa chỉ UBND Phường Tự Lạn, Việt Yên, Bắc Giang).
- Nhúng iframe vào giao diện, chiều cao full height phần còn lại của màn hình.
- Thêm một block hiển thị Địa chỉ cụ thể text và nút "Mở trong Google Maps" để chuyển hướng ra app ngoài nếu người dùng cần dẫn đường chi tiết.
