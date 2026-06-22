# Đánh giá Admin CMS so với tài liệu yêu cầu

Tài liệu này rà soát mức độ Admin CMS (project `api/`) đã quản lý đầy đủ các chức
năng theo `requirements-analysis.md` (mục 4.3 — 16 nhóm chức năng; mục 7.2 — module
admin bắt buộc; mục 7.3 — phân quyền) và liệt kê việc cần làm để hoàn thiện production.

Cập nhật: 13/06/2026.

## 1. Trả lời nhanh

> **CẬP NHẬT 13/06/2026 — đã bổ sung và verify (33/33 test pg-mem PASS):** Admin CMS
> nay đã quản lý thêm **Trụ sở/Bản đồ, Lịch công tác, Hỏi đáp/FAQ, Loại phản ánh,
> Thông tin địa phương, Khảo sát + báo cáo tổng hợp, và Quản lý tài khoản admin +
> phân quyền** (super_admin). Các phần đánh dấu ❌ bên dưới phần lớn đã chuyển thành ✅.
> Còn lại: cấu hình menu tiện ích trang chủ từ backend, banner, trang Giới thiệu địa
> phương, và vai trò Organization Admin (đa địa phương).

Trước cập nhật: **chưa đầy đủ** — Admin CMS quản lý tốt phần lớn nội dung và xử lý
nghiệp vụ chính nhưng thiếu nhiều màn hình. Sau cập nhật: **đã đầy đủ phần lớn module
bắt buộc** (mục 7.2), chỉ còn vài hạng mục nâng cao và phần production.

## 2. Hiện trạng Admin CMS

### 2.1. Đang quản lý qua giao diện (`/admin.html`)

| Mục | Thao tác | Trạng thái |
| --- | --- | --- |
| Tin tức | Thêm/sửa/xoá, trạng thái xuất bản | ✅ Đầy đủ |
| Thủ tục hành chính | Thêm/sửa/xoá | ✅ Đầy đủ |
| Văn bản & mẫu đơn | Thêm/sửa/xoá (gồm cả mẫu đơn qua `type`) | ✅ Đầy đủ |
| Đường dây nóng | Thêm/sửa/xoá | ✅ Đầy đủ |
| Dự án đầu tư | Thêm/sửa/xoá | ✅ Đầy đủ |
| Đấu thầu | Thêm/sửa/xoá | ✅ Đầy đủ |
| Lịch hẹn | Duyệt / từ chối | ✅ Đầy đủ |
| Phản ánh | Trả lời | ✅ Đầy đủ |
| Nhật ký thao tác | Xem | ✅ Đầy đủ |

### 2.2. Có API nhưng CHƯA có giao diện

| Mục | Hiện trạng |
| --- | --- |
| Trụ sở / Bản đồ (`office_locations`) | API CRUD đã sẵn (`/admin/officeLocations`), thiếu màn hình admin |
| Lịch công tác (`work_schedules`) | API CRUD đã sẵn (`/admin/workSchedules`), thiếu màn hình admin |

### 2.3. Có dữ liệu/bảng nhưng CHƯA quản lý được

| Mục | Hiện trạng |
| --- | --- |
| Khảo sát hài lòng | Bảng `surveys`, `survey_responses` đã có; **chưa** có CRUD khảo sát và **chưa** có báo cáo tổng hợp kết quả |
| Hỏi đáp / FAQ (`guidelines`) | Dùng cho Chatbot + màn hình "Thông tin - hướng dẫn"; **chưa** quản lý được |
| Thông tin địa phương (`organizations`) | Chỉ seed sẵn; **chưa** sửa được tên/mô tả/logo/OA |
| Loại phản ánh (`feedback_types`) | Chỉ seed sẵn; **chưa** quản lý danh mục |
| Tài khoản admin + phân quyền (`admin_users`) | Seed sẵn 5 tài khoản; **chưa** thêm/sửa/khoá tài khoản qua giao diện |
| Menu tiện ích trang chủ | Đang **hardcode** trong frontend; tài liệu (mục 6.1) yêu cầu cấu hình từ backend |

## 3. Đối chiếu 16 nhóm chức năng (mục 4.3) — admin có quản lý không?

| # | Nhóm chức năng | Admin quản lý? |
| --- | --- | --- |
| 1 | Trung tâm thông tin (tin tức/sự kiện) | ✅ Có (banner/carousel: chưa) |
| 2 | Chatbot AI dịch vụ công | ◐ Gián tiếp (dựa trên thủ tục + FAQ; FAQ chưa quản lý) |
| 3 | Danh mục thủ tục hành chính | ✅ Có |
| 4 | Đặt lịch làm việc | ✅ Có (duyệt/từ chối) |
| 5 | Kho mẫu đơn, tờ khai | ✅ Có (qua Văn bản) |
| 6 | Cổng dịch vụ công trực tuyến | ◐ Gán link theo thủ tục (qua quản lý thủ tục) |
| 7 | Thông tin quy hoạch | ◐ Qua Văn bản (type quy hoạch); chưa có mục riêng |
| 8 | Thông tin dự án đầu tư | ✅ Có |
| 9 | Thông tin đấu thầu | ✅ Có |
| 10 | Phản ánh, kiến nghị | ✅ Có (trả lời) |
| 11 | Lịch công tác điện tử | ❌ Thiếu giao diện (đã có API) |
| 12 | Khảo sát sự hài lòng | ❌ Chưa quản lý + chưa báo cáo |
| 13 | Đường dây nóng | ✅ Có |
| 14 | Bản đồ và định vị trụ sở | ❌ Thiếu giao diện (đã có API) |
| 15 | Kho văn bản điện tử | ✅ Có |
| 16 | Giới thiệu địa phương | ❌ Chưa có (cả frontend lẫn admin) |

## 4. Đối chiếu module Admin bắt buộc (mục 7.2)

| Module yêu cầu | Trạng thái |
| --- | --- |
| Quản lý thông tin địa phương | ❌ Chưa |
| Quản lý banner/tin tức | ✅ Tin tức (banner: chưa) |
| Quản lý thủ tục hành chính | ✅ |
| Quản lý mẫu đơn/tờ khai | ✅ |
| Quản lý văn bản/nghị quyết | ✅ |
| Quản lý lịch hẹn | ✅ |
| Quản lý phản ánh | ✅ |
| Quản lý hotline | ✅ |
| Quản lý lịch công tác | ❌ Thiếu giao diện |
| Quản lý khảo sát | ❌ Chưa |
| Quản lý tài khoản admin + phân quyền | ❌ Chưa (đang seed cứng) |
| Cấu hình nguồn dữ liệu chatbot | ◐ Tự dùng thủ tục + FAQ; chưa có màn hình cấu hình |

## 5. Phân quyền (RBAC) — đối chiếu mục 7.3

Đã có **5/6** vai trò: `super_admin`, `content_editor`, `appointment_officer`,
`feedback_officer`, `viewer`. Thiếu **Organization Admin** (quản trị theo từng địa
phương — cần khi triển khai đa địa phương/đa tổ chức, hiện hệ thống đang đơn tổ chức).

Cơ chế: kiểm tra quyền theo vai trò ở mọi endpoint admin (đã verify chặn 403 đúng).
Hạn chế: chưa có giao diện gán/đổi vai trò; chưa khoá/mở tài khoản; chưa nhật ký đăng nhập riêng.

## 6. Khoảng trống cần bổ sung để Admin "quản lý đầy đủ"

Ưu tiên theo công sức/giá trị:

1. **Trụ sở/Bản đồ + Lịch công tác** — chỉ cần thêm 2 mục giao diện (API đã có). *(nhanh)*
2. **Hỏi đáp/FAQ (`guidelines`)** — thêm CRUD + giao diện (liên quan Chatbot & màn hình hướng dẫn). *(nhanh)*
3. **Loại phản ánh (`feedback_types`)** — thêm CRUD danh mục. *(nhanh)*
4. **Thông tin địa phương** — sửa tên/mô tả/logo/OA. *(trung bình)*
5. **Khảo sát** — tạo/sửa khảo sát + câu hỏi và **báo cáo tổng hợp** kết quả. *(trung bình)*
6. **Tài khoản admin + phân quyền** — thêm/sửa/khoá tài khoản, đổi vai trò, đổi mật khẩu. *(trung bình)*
7. **Cấu hình menu tiện ích trang chủ** từ backend (frontend đọc menu động). *(trung bình–lớn)*
8. **Giới thiệu địa phương** — bảng nội dung + trang Mini App. *(trung bình)*

## 7. Checklist hoàn thiện cho PRODUCTION

### 7.1. Bảo mật (mục 10 tài liệu)
- [ ] HTTPS (TLS) cho API và Admin.
- [ ] Nâng token admin lên **JWT chuẩn + refresh token**; đổi `JWT_SECRET` mạnh, lưu qua secrets.
- [ ] **Xác thực token Zalo cho API public** (hiện API public đang mở — cần ràng buộc người dùng Zalo).
- [ ] Phân quyền/giới hạn API public theo Mini App ID/tổ chức.
- [ ] **Upload file** (ảnh phản ánh) có giới hạn loại/dung lượng + quét cơ bản.
- [ ] Rate limit phân tán (Redis) thay in-memory; chống brute-force đăng nhập (khoá tạm).
- [ ] Chính sách lưu trữ/xoá **dữ liệu cá nhân (CCCD, SĐT)**; cân nhắc mã hoá at-rest.
- [ ] Rà soát không log dữ liệu nhạy cảm (đã đạt cơ bản) + CORS giới hạn domain.

### 7.2. Dữ liệu & hạ tầng
- [ ] **Migrations có phiên bản** (vd node-pg-migrate) thay vì `CREATE TABLE IF NOT EXISTS`.
- [ ] Thêm **index** (vd theo trạng thái, ngày) và cân nhắc chuẩn hoá bảng nóng (feedbacks, appointments).
- [ ] **Backup/restore** định kỳ + quy trình phục hồi.
- [ ] Healthcheck, **logging tập trung**, monitoring/cảnh báo (uptime, lỗi 5xx).
- [ ] Biến môi trường qua secrets manager; tách cấu hình theo môi trường (dev/staging/prod).
- [ ] CI/CD (build image, test, deploy); image production tối ưu.

### 7.3. Nghiệp vụ & vận hành
- [ ] Hoàn thiện các module admin còn thiếu ở mục 6.
- [ ] **Báo cáo/dashboard**: thống kê lịch hẹn, phản ánh, khảo sát theo thời gian.
- [ ] **Thông báo đẩy qua Zalo OA** (nhắc lịch hẹn, phản hồi phản ánh).
- [ ] Quy trình duyệt nội dung (draft → publish) + nhật ký đăng nhập admin.
- [ ] Đa địa phương (Organization Admin) nếu triển khai nhiều phường/xã.

### 7.4. Kiểm thử & phát hành
- [ ] Mở rộng test (store/UI, integration trên Postgres thật, e2e admin).
- [ ] **UAT trên Zalo** (Android/iOS), kiểm tra webview/safe-area/back.
- [ ] Cấu hình Mini App ID thật; `zmp deploy` + hồ sơ phát hành Zalo.
- [ ] Tài liệu vận hành: hướng dẫn admin, xử lý lịch hẹn/phản ánh, backup, sự cố.

## 8. Kết luận

Sau cập nhật, Admin CMS **quản lý gần đủ 12/12 module bắt buộc** (mục 7.2) và phần
lớn 16 nhóm chức năng. Các mục mục 6 (Trụ sở, Lịch công tác, FAQ, Loại phản ánh,
Thông tin địa phương, Khảo sát + báo cáo, Quản lý tài khoản + phân quyền) **đã hoàn
thành và kiểm thử (33/33 PASS)**. Còn lại ở mức nâng cao: cấu hình menu tiện ích từ
backend, banner, trang Giới thiệu địa phương, và vai trò Organization Admin (đa địa phương).

Để lên **production**, ưu tiên nhóm **bảo mật** (HTTPS, JWT/refresh, xác thực token
Zalo cho API public, upload an toàn, chính sách PII) và **hạ tầng** (migrations có
phiên bản, backup, monitoring, CI/CD) — chi tiết ở mục 7.
