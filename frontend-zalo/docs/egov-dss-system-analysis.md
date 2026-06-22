# Phân tích chức năng và kế hoạch xây dựng hệ thống eGov DSS / Resident Group

## 1. Mục đích tài liệu

Tài liệu này được bóc tách từ các file trong thư mục:

`D:\projects\egoverment\HDSD eGov DSS`

Mục tiêu:

- Tổng hợp các phân hệ, vai trò, chức năng và luồng giao diện từ tài liệu hướng dẫn, slide tập huấn và video thao tác.
- Chuyển nội dung hướng dẫn sử dụng thành tài liệu yêu cầu xây dựng hệ thống.
- Xác định các màn hình cần thiết kế/xây dựng cho web quản trị, web DSS và app cư dân/tổ trưởng.
- Đề xuất kiến trúc module, dữ liệu, API, backlog triển khai và tiêu chí nghiệm thu.

## 2. Nguồn tài liệu đã đọc

### 2.1. PDF hướng dẫn sử dụng

| File | Nội dung | Số trang |
| --- | --- | --- |
| `HDSD_eGovDSS_LanhDao_ChuyenVien.pdf` | Hướng dẫn hệ thống eGov DSS cho vai trò lãnh đạo, chuyên viên phường | 80 |
| `HDSD_PhanheQLCuDan_BanDieuHanhKhuPho.pdf` | Hướng dẫn phân hệ quản lý địa bàn cho Ban điều hành khu phố | 37 |
| `HDSD_PhanHeQLCuDan_CuDan.pdf` | Hướng dẫn phân hệ quản lý địa bàn cho cư dân | 24 |

### 2.2. PowerPoint tập huấn

| File | Nội dung | Slide | Media |
| --- | --- | ---: | ---: |
| `APP_eGov_ResidentGroup_TapHuan_20260126.pptx` | Tập huấn hệ thống quản lý tổ dân phố trên app/mobile | 27 | 64 ảnh |
| `eGovDSS_TapHuan_DaoTao_20260108.pptx` | Tập huấn hệ thống dữ liệu điều hành và ứng dụng quản lý tổ dân phố | 36 | 62 ảnh |

### 2.3. Video thao tác

| File video | Luồng chức năng |
| --- | --- |
| `PhanHeDSS_1_Nhập liệu thủ công.mp4` | DSS - nhập liệu báo cáo thủ công |
| `PhanHeDSS_2_Nhập liệu báo cáo_Import excel.mp4` | DSS - nhập liệu báo cáo bằng Excel |
| `PhanHeQLCuDan_APP_1_Cư dân đăng ký tài khoản.mp4` | App - cư dân đăng ký tài khoản |
| `PhanHeQLCuDan_APP_2_Thêm thành viên vào hộ dân.mp4` | App - thêm thành viên hộ dân |
| `PhanHeQLCuDan_APP_3_Cập nhật thông tin cư dân.mp4` | App - cập nhật thông tin cư dân |
| `PhanHeQLCuDan_APP_4_Tham gia cuộc thi.mp4` | App - tham gia cuộc thi |
| `PhanHeQLCuDan_APP_5_Tham gia khảo sát.mp4` | App - tham gia khảo sát |
| `PhanHeQLCuDan_APP_6_Cư dân tạo góp ý phản ánh.mp4` | App - cư dân tạo góp ý/phản ánh |
| `PhanHeQLCuDan_APP_7_Tổ trưởng duyệt cư dân.mp4` | App - tổ trưởng duyệt cư dân |
| `PhanHeQLCuDan_APP_8_Tổ trưởng duyệt hộ dân.mp4` | App - tổ trưởng duyệt hộ dân |
| `PhanHeQLCuDan_APP_9_Tổ trưởng xử lý phản ánh.mp4` | App - tổ trưởng xử lý phản ánh |
| `PhanHeQLCuDan_APP_10_Tổ trưởng tạo cuộc họp.mp4` | App - tổ trưởng tạo cuộc họp |
| `PhanHeQLCuDan_APP_11_Tổ trưởng xem kết quả cuộc thi.mp4` | App - tổ trưởng xem kết quả cuộc thi |
| `PhanHeQLCuDan_WEB_1_Quản lý cuộc thi.mp4` | Web - quản lý cuộc thi |
| `PhanHeQLCuDan_WEB_2_Quản lý khảo sát.mp4` | Web - quản lý khảo sát |
| `QTHT_Quản lý người dùng.mp4` | Web - quản trị hệ thống, quản lý người dùng |

## 3. Bức tranh tổng thể hệ thống

Từ tài liệu, hệ thống eGov DSS không chỉ là Mini App dịch vụ công đơn giản. Hệ thống đầy đủ gồm hai nhóm nền tảng:

1. **Website eGov DSS cho lãnh đạo/cán bộ phường**
   - Điều hành nóng.
   - Dashboard dữ liệu.
   - Nhập liệu báo cáo.
   - Quản trị người dùng.
   - Quản lý khu phố.
   - Phòng họp số.
   - Camera giám sát.
   - IoT.

2. **Ứng dụng quản lý tổ dân phố / Resident Group cho cư dân và ban điều hành khu phố**
   - Dùng trên mobile/app.
   - Cư dân đăng ký, cập nhật thông tin hộ/cư dân.
   - Tổ trưởng duyệt cư dân/hộ dân.
   - Phản ánh, khảo sát, cuộc họp, cuộc thi, tin tức, văn kiện.
   - Quản lý thu/chi và nhóm cộng đồng.

Nếu tích hợp vào khung Zalo Mini App hiện có, nên hiểu đây là một sản phẩm có 3 lớp:

- **Mini App cư dân**: phần người dân sử dụng trên Zalo.
- **App/portal tổ trưởng**: phần Ban điều hành khu phố sử dụng, có thể là Zalo Mini App phân quyền hoặc web mobile.
- **Web Admin/DSS**: phần lãnh đạo, chuyên viên, cán bộ phường sử dụng trên trình duyệt.

## 4. Vai trò người dùng

| Vai trò | Kênh sử dụng | Quyền/chức năng chính |
| --- | --- | --- |
| Cư dân | App/Mini App | Đăng ký tài khoản, quản lý hộ mình, cập nhật thông tin cư dân, gửi phản ánh, tham gia khảo sát/cuộc thi/cuộc họp, xem tin tức/văn kiện/thông báo |
| Ban điều hành khu phố / Tổ trưởng | App/Mobile/Web mobile | Quản lý cư dân trong tổ, quản lý hộ dân, duyệt/từ chối cư dân và hộ dân, xử lý/chuyển tiếp phản ánh, tạo cuộc họp, quản lý thu/chi, tạo nhóm cộng đồng |
| Lãnh đạo phường | Web DSS | Xem dashboard, số liệu điều hành, báo cáo, phản ánh, dữ liệu khu phố, biểu đồ phân tích, thông tin nóng |
| Chuyên viên/phòng ban | Web DSS/Admin | Nhập liệu báo cáo, quản lý nội dung, xử lý phản ánh, quản lý khảo sát/tin tức/văn bản/cuộc thi |
| Quản trị hệ thống | Web Admin | Quản lý người dùng, đơn vị, chức vụ, tài khoản, phân quyền |
| Cán bộ phòng họp số | Web DSS | Quản lý nhân sự họp, cuộc họp, tài liệu, đại biểu, biểu quyết và nội dung họp |

## 5. Danh mục phân hệ cần xây dựng

### 5.1. Phân hệ xác thực và tài khoản

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên.

Chức năng:

- Đăng ký tài khoản.
- Đăng nhập/đăng xuất.
- Đổi mật khẩu.
- Quên mật khẩu.
- Xác thực bằng họ tên, số điện thoại, CCCD.
- Chờ duyệt tài khoản sau đăng ký.
- Quản lý tài khoản người dùng.
- Reset mật khẩu.
- Cập nhật tên đăng nhập.
- Phân quyền người dùng theo nhóm quyền.

Màn hình cần xây:

- Màn hình đăng ký tài khoản.
- Màn hình đăng nhập.
- Màn hình đổi mật khẩu.
- Màn hình quên mật khẩu.
- Màn hình xác thực tài khoản.
- Màn hình đặt mật khẩu mới.
- Admin: danh sách người dùng.
- Admin: thêm/sửa/xóa người dùng.
- Admin: cập nhật đơn vị/chức vụ.
- Admin: cập nhật tài khoản và phân quyền.

Yêu cầu dữ liệu:

- Người dùng.
- Tài khoản đăng nhập.
- Vai trò/nhóm quyền.
- Đơn vị/phòng ban.
- Chức vụ.
- Trạng thái tài khoản.

### 5.2. Dashboard / Điều hành DSS

Nguồn: `eGovDSS_TapHuan_DaoTao_20260108.pptx`, `HDSD_eGovDSS_LanhDao_ChuyenVien.pdf`.

Chức năng:

- Màn hình chính hiển thị thông tin chung về phường.
- Hiển thị các phân hệ chính:
  - Điều hành nóng.
  - Quản lý và điều hành DSS.
  - Quản lý địa bàn.
  - Phòng họp không giấy.
  - Camera giám sát.
  - IoT.
- Dashboard dữ liệu theo khối:
  - Xây dựng Đảng.
  - Văn phòng HĐND và UBND.
  - Kinh tế / hạ tầng / đô thị.
  - Văn hóa - xã hội.
  - Hành chính công.
  - Đơn vị phối quản và sự nghiệp.
- Biểu đồ, bảng số liệu, cảnh báo chỉ tiêu nóng.
- Liên kết nhanh sang hệ thống văn bản điện tử, cổng thông tin, phần mềm liên quan.

Màn hình cần xây:

- Web dashboard tổng quan.
- Dashboard theo khối dữ liệu.
- Trang chi tiết chỉ tiêu.
- Trang cảnh báo/chỉ tiêu nóng.
- Trang liên kết hệ thống ngoài.

### 5.3. Nhập liệu báo cáo DSS

Nguồn: PDF lãnh đạo/chuyên viên, video `PhanHeDSS_1`, `PhanHeDSS_2`.

Chức năng:

- Nhập liệu báo cáo theo kỳ.
- Thêm mới dữ liệu báo cáo.
- Nhập dữ liệu thủ công.
- Import dữ liệu từ Excel.
- Lấy dữ liệu từ kỳ trước.
- Sửa dữ liệu báo cáo.
- Xem và sử dụng dữ liệu lịch sử.
- Đính kèm tài liệu.
- Cập nhật vị trí trên bản đồ.
- Tuân thủ khung dữ liệu và tần suất báo cáo.

Màn hình cần xây:

- Danh sách kỳ báo cáo.
- Form nhập liệu báo cáo.
- Màn hình import Excel.
- Màn hình preview dữ liệu import.
- Màn hình lịch sử báo cáo.
- Màn hình chi tiết báo cáo.
- Màn hình đính kèm tài liệu.

Yêu cầu kỹ thuật:

- Template Excel chuẩn.
- Validate dữ liệu import.
- Lưu lịch sử thay đổi.
- Ghi nhận người nhập/sửa.
- Tần suất báo cáo: ngày, tuần, tháng, quý, năm hoặc đột xuất.

### 5.4. Quản lý cư dân

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide Resident Group.

Chức năng theo vai trò:

| Vai trò | Chức năng |
| --- | --- |
| Cư dân | Xem thành viên hộ gia đình, cập nhật/gửi xác nhận thông tin cư dân |
| Tổ trưởng | Xem cư dân trong tổ, thêm cư dân, sửa thông tin, gửi/duyệt thông tin |
| Cán bộ phường | Xem toàn bộ cư dân, thêm/sửa/xóa, import/export Excel, tìm kiếm nâng cao |

Thông tin cư dân:

- Thông tin chung.
- Thông tin đoàn thể.
- Khen thưởng.
- Kỷ luật.
- Tiền án, tiền sự.
- Trạng thái duyệt/từ chối.
- Lý do từ chối.

Màn hình cần xây:

- Danh sách cư dân.
- Tab Đã duyệt.
- Tab Từ chối.
- Tab Chờ duyệt.
- Chi tiết cư dân.
- Form thêm/sửa cư dân.
- Form cập nhật thông tin đoàn thể.
- Form khen thưởng/kỷ luật/tiền án tiền sự.
- Import Excel.
- Export Excel.
- Tìm kiếm nâng cao.
- Duyệt/từ chối cư dân.

### 5.5. Quản lý hộ dân

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video thêm thành viên hộ dân.

Chức năng theo vai trò:

| Vai trò | Chức năng |
| --- | --- |
| Cư dân | Xem hộ của mình, thêm thành viên vào hộ, gửi xác nhận |
| Tổ trưởng | Xem hộ dân trong tổ, bổ sung hộ dân, duyệt/từ chối hộ |
| Cán bộ phường | Quản lý toàn bộ hộ dân, thêm/sửa/xóa, import/export Excel, tìm kiếm nâng cao |

Màn hình cần xây:

- Danh sách hộ dân.
- Chi tiết hộ dân.
- Form thêm/sửa hộ dân.
- Thêm thành viên hộ.
- Duyệt/từ chối hộ dân.
- Import Excel.
- Export Excel.
- Tìm kiếm nâng cao.

Yêu cầu dữ liệu:

- Hộ dân.
- Chủ hộ.
- Thành viên hộ.
- Địa chỉ.
- Tổ dân phố.
- Trạng thái duyệt.
- Lý do từ chối.

### 5.6. Duyệt/từ chối thông tin cư dân - hộ dân

Nguồn: PDF ban điều hành, PDF lãnh đạo/chuyên viên, video tổ trưởng duyệt cư dân/hộ dân.

Chức năng:

- Danh sách yêu cầu chờ duyệt.
- Xem chi tiết thay đổi.
- Duyệt thông tin cư dân.
- Từ chối thông tin cư dân.
- Duyệt thông tin hộ dân.
- Từ chối thông tin hộ dân.
- Ghi lý do từ chối.
- Lưu lịch sử phê duyệt.

Màn hình cần xây:

- Hàng đợi duyệt cư dân.
- Hàng đợi duyệt hộ dân.
- Màn hình so sánh thông tin cũ/mới.
- Form nhập lý do từ chối.

### 5.7. Góp ý, phản ánh

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video cư dân tạo phản ánh, video tổ trưởng xử lý phản ánh.

Chức năng theo vai trò:

| Vai trò | Chức năng |
| --- | --- |
| Cư dân | Tạo góp ý/phản ánh, xem lịch sử, theo dõi trạng thái |
| Tổ trưởng | Xem phản ánh trong địa bàn, xử lý hoặc chuyển tiếp |
| Cán bộ phường | Xem toàn bộ phản ánh, xử lý phản ánh được chuyển tiếp |

Luồng xử lý:

1. Cư dân tạo phản ánh.
2. Phản ánh vào trạng thái chờ xử lý.
3. Tổ trưởng tiếp nhận.
4. Tổ trưởng xử lý trực tiếp hoặc chuyển tiếp UBND phường.
5. Cán bộ phường xử lý nếu được chuyển tiếp.
6. Cư dân xem kết quả/lịch sử.

Màn hình cần xây:

- Danh sách phản ánh.
- Tạo phản ánh.
- Chi tiết phản ánh.
- Lịch sử xử lý.
- Màn hình xử lý phản ánh.
- Màn hình chuyển tiếp phản ánh.
- Bộ lọc theo trạng thái, địa bàn, loại phản ánh.

Trạng thái đề xuất:

- `new`
- `pending`
- `processing`
- `forwarded`
- `resolved`
- `rejected`
- `closed`

### 5.8. Văn kiện / Văn bản / Tài liệu

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide văn bản tài liệu.

Chức năng:

- Cư dân/tổ trưởng xem văn kiện, văn bản, tài liệu.
- Cán bộ phường thiết lập và quản lý nội dung văn bản.
- Xem nhanh nội dung văn bản.
- Tải về.
- Chia sẻ.
- Phân loại theo chủ đề, lĩnh vực, thời gian.
- Quản lý tài liệu trong phòng họp số.
- Phân quyền tài liệu theo vai trò.

Màn hình cần xây:

- Danh sách văn bản.
- Chi tiết văn bản.
- Xem file.
- Tải file.
- Admin: thêm/sửa/xóa văn bản.
- Admin: upload file.
- Admin: phân quyền tài liệu.

### 5.9. Khảo sát

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video quản lý khảo sát, video tham gia khảo sát.

Chức năng:

- Cán bộ phường tạo khảo sát.
- Cán bộ phường thêm/sửa/xóa câu hỏi khảo sát.
- Cán bộ phường xem danh sách câu hỏi.
- Cán bộ phường xem kết quả khảo sát.
- Tổ trưởng/cư dân tham gia khảo sát.
- Tổng hợp kết quả và người tham gia.

Màn hình cần xây:

- Danh sách khảo sát.
- Chi tiết khảo sát.
- Form tham gia khảo sát.
- Kết quả sau khi gửi.
- Admin: danh sách khảo sát.
- Admin: tạo/sửa/xóa khảo sát.
- Admin: quản lý câu hỏi.
- Admin: kết quả khảo sát.

Loại câu hỏi đề xuất:

- Một lựa chọn.
- Nhiều lựa chọn.
- Thang điểm/rating.
- Câu hỏi nhập text.

### 5.10. Tin tức và bình luận

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide tin tức.

Chức năng:

- Cư dân/tổ trưởng xem tin tức, thông báo, hoạt động mới nhất từ địa phương.
- Bình luận/trao đổi dưới bài viết.
- Cán bộ phường tạo và quản lý tin tức.
- Cán bộ phường quản lý bình luận, ẩn bình luận không hợp lệ.

Màn hình cần xây:

- Danh sách tin tức.
- Chi tiết tin tức.
- Bình luận bài viết.
- Admin: danh sách tin.
- Admin: tạo/sửa/xóa tin.
- Admin: kiểm duyệt bình luận.

### 5.11. Thông báo nhanh

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên.

Chức năng:

- Gửi thông báo nhanh đến cư dân/tổ dân phố.
- Xem danh sách thông báo.
- Xem chi tiết thông báo.
- Phân nhóm nhận thông báo.
- Thông báo quan trọng trên trang chủ.

Màn hình cần xây:

- Danh sách thông báo.
- Chi tiết thông báo.
- Admin: tạo thông báo.
- Admin: chọn đối tượng nhận.
- Admin: lịch sử gửi.

### 5.12. Cuộc thi

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide quản lý cuộc thi, video tham gia cuộc thi, video quản lý cuộc thi, video xem kết quả cuộc thi.

Chức năng:

- Cán bộ phường khởi tạo cuộc thi.
- Thêm/sửa/xóa cuộc thi.
- Thêm/sửa/xóa câu hỏi.
- Sắp xếp câu hỏi/câu trả lời.
- Tổ trưởng/cư dân tham gia cuộc thi.
- Xem lại bài đã thi.
- Xem kết quả, người thắng cuộc.
- Tổng hợp thông tin người tham gia.

Màn hình cần xây:

- Danh sách cuộc thi.
- Chi tiết cuộc thi.
- Màn hình làm bài.
- Kết quả bài thi.
- Bảng xếp hạng/người thắng.
- Admin: quản lý cuộc thi.
- Admin: quản lý câu hỏi/câu trả lời.
- Admin: kết quả cuộc thi.

### 5.13. Cuộc họp

Nguồn: PDF cư dân, PDF ban điều hành, slide quản lý cuộc họp, video tổ trưởng tạo cuộc họp.

Chức năng:

- Tổ trưởng tạo cuộc họp.
- Thiết lập nội dung, thời gian, địa điểm.
- Gán cư dân tham gia.
- Hệ thống gửi thông báo tự động.
- Cư dân xác nhận hoặc từ chối tham gia.
- Tra cứu kết luận và lịch sử cuộc họp.

Màn hình cần xây:

- Danh sách cuộc họp.
- Tạo cuộc họp.
- Chi tiết cuộc họp.
- Gán người tham gia.
- Xác nhận/từ chối tham gia.
- Kết luận cuộc họp.
- Lịch sử cuộc họp.

### 5.14. Nhóm cộng đồng

Nguồn: PDF ban điều hành, slide quản lý nhóm cộng đồng.

Chức năng:

- Tổ trưởng tạo nhóm cộng đồng.
- Quản lý nhóm theo chủ đề/tổ đội/nhu cầu sinh hoạt.
- Gán cư dân vào nhóm.
- Quản lý thành viên nhóm.
- Tạo không gian kết nối, trao đổi và phối hợp hoạt động.

Màn hình cần xây:

- Danh sách nhóm cộng đồng.
- Tạo/sửa nhóm.
- Chi tiết nhóm.
- Quản lý thành viên nhóm.

### 5.15. Quản lý thu

Nguồn: PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide quản lý thu.

Chức năng:

- Tổ trưởng tạo đợt thu.
- Khai báo khoản phí/quỹ/đóng góp.
- Cập nhật danh sách hộ đã đóng/chưa đóng.
- Theo dõi tình trạng thu.
- Tổng hợp, báo cáo.
- Minh bạch tài chính khu dân cư.

Màn hình cần xây:

- Danh sách đợt thu.
- Tạo đợt thu.
- Chi tiết đợt thu.
- Danh sách hộ cần thu.
- Cập nhật trạng thái đóng.
- Báo cáo thu.

### 5.16. Quản lý chi

Nguồn: PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide quản lý chi.

Chức năng:

- Tổ trưởng tạo khoản chi.
- Ghi mục đích, số tiền, thời gian.
- Đính kèm chứng từ.
- Theo dõi, cập nhật khoản chi.
- Tổng hợp báo cáo chi tiêu.
- Công khai/minh bạch quỹ khu dân cư.

Màn hình cần xây:

- Danh sách khoản chi.
- Tạo khoản chi.
- Chi tiết khoản chi.
- Upload chứng từ.
- Báo cáo chi.

### 5.17. Cơ sở hạ tầng xã hội, văn hóa - giải trí

Nguồn: PDF cư dân, PDF ban điều hành.

Chức năng:

- Xem thông tin cơ sở hạ tầng xã hội.
- Xem thông tin văn hóa, lưu trú, giải trí.
- Có thể mở bản đồ/liên kết nếu có.

Màn hình cần xây:

- Danh sách địa điểm/tiện ích.
- Chi tiết địa điểm.
- Bộ lọc theo loại.
- Mở bản đồ/chỉ đường.

### 5.18. Tiện ích khác

Nguồn: PDF cư dân, PDF ban điều hành.

Chức năng:

- Liên kết nhanh.
- Tra cứu phạt nguội.
- Hotline.
- Thông báo.
- Trợ lý.

Màn hình cần xây:

- Trang tiện ích.
- Danh sách liên kết.
- Webview tra cứu phạt nguội.
- Hotline gọi nhanh.
- Trợ lý ảo/chatbot.

### 5.19. Phòng họp số

Nguồn: PDF lãnh đạo/chuyên viên, slide eGov DSS.

Chức năng:

- Quản lý nhân sự tham gia họp Đảng ủy/UBND/MTTQ.
- Quản lý cuộc họp.
- Quản lý tài liệu cuộc họp.
- Gán đại biểu họp.
- Phân quyền tài liệu.
- Quản lý biểu quyết.
- Xem kết quả biểu quyết.
- Gán nội dung họp.

Màn hình cần xây:

- Danh sách nhân sự họp.
- Danh sách cuộc họp.
- Tạo/sửa/xóa cuộc họp.
- Danh sách tài liệu họp.
- Upload tài liệu.
- Gán đại biểu.
- Phân quyền tài liệu.
- Tạo biểu quyết.
- Kết quả biểu quyết.
- Gán nội dung họp.

## 6. Danh mục hình ảnh/màn hình giao diện từ slide và PDF

Tài liệu nguồn có nhiều ảnh giao diện trong PDF/PPTX. Phần này bóc tách thành danh mục màn hình cần thiết kế lại/xây dựng.

### 6.1. Từ `APP_eGov_ResidentGroup_TapHuan_20260126.pptx`

| Slide | Màn hình/chủ đề | Ghi chú triển khai |
| ---: | --- | --- |
| 8 | Trang chủ app | Chức năng nổi bật, tìm kiếm, thông báo quan trọng/lễ hội, cơ sở hạ tầng, văn hóa, tin tức |
| 9 | Dashboard quản lý thông tin chung của phường | Theo dõi tổng quan dân cư, TDP, độ tuổi, phản ánh, khảo sát |
| 10 | Đăng ký cư dân | Mobile app, thu thập dữ liệu cư dân/hộ dân |
| 11 | Thống kê | Tổ trưởng theo dõi số liệu hộ dân/cư dân/tạm trú/thường trú |
| 12 | Quản lý hộ dân/cư dân - cán bộ phường | Web quản lý toàn địa bàn |
| 13 | Quản lý hộ dân/cư dân - tổ trưởng/cư dân | App phân quyền theo tổ/hộ |
| 14 | Khảo sát - cán bộ phường | Web tạo khảo sát, tổng hợp kết quả |
| 15 | Khảo sát - tổ trưởng/cư dân | App tham gia khảo sát |
| 16 | Văn bản, tài liệu | Xem, tải, chia sẻ, phân loại |
| 17 | Góp ý, phản ánh | Cư dân tạo, tổ trưởng xử lý/chuyển tiếp, cán bộ phường xử lý |
| 18 | Tin tức | Xem tin, bình luận, admin kiểm duyệt |
| 19 | Quản lý cuộc thi | Tạo cuộc thi, tham gia, xem kết quả |
| 20 | Quản lý cuộc họp | Tạo họp, gán cư dân, xác nhận/từ chối, kết luận |
| 21 | Nhóm cộng đồng | Tạo nhóm, gán thành viên |
| 22 | Quản lý thu | Tạo đợt thu, theo dõi hộ đóng/chưa đóng |
| 23 | Quản lý chi | Tạo khoản chi, chứng từ, báo cáo |

### 6.2. Từ `eGovDSS_TapHuan_DaoTao_20260108.pptx`

| Slide | Màn hình/chủ đề | Ghi chú triển khai |
| ---: | --- | --- |
| 4 | Tổng quan eGov DSS | Điều hành nóng, DSS, quản lý địa bàn |
| 5 | Lợi ích theo vai trò | Lãnh đạo, chuyên viên, ban điều hành khu phố, người dân |
| 6 | Các phân hệ chính | Website eGov DSS và app Resident Group |
| 8-11 | Tính năng theo vai trò | Mapping quyền theo người dân, ban điều hành, chuyên viên, lãnh đạo |
| 13-16 | Quy chế vận hành | Trách nhiệm cập nhật dữ liệu, quản trị, chia sẻ dữ liệu |
| 19-24 | Dashboard | Dashboard quy hoạch, ngân sách, khối Đảng, HĐND/UBND, kinh tế, văn hóa xã hội, hành chính công |
| 25-27 | Nhập liệu báo cáo DSS | Nhập thủ công, Excel, kỳ trước, tài liệu đính kèm, vị trí bản đồ |
| 28-31 | Quản lý khu phố | Cư dân, hộ dân, văn bản, khảo sát, phản ánh, tin tức, cuộc thi, thu/chi |
| 32-35 | Phòng họp số | Nhân sự, tài liệu, biểu quyết, phân quyền, đại biểu, nội dung họp |

### 6.3. Từ PDF hướng dẫn

| PDF | Nhóm màn hình |
| --- | --- |
| Lãnh đạo/chuyên viên | Đăng nhập, đổi mật khẩu, quản lý người dùng, nhập liệu báo cáo, quản lý cư dân/hộ dân, duyệt thông tin, văn bản, khảo sát, tin tức, phản ánh, thông báo nhanh, cuộc thi, thu/chi, phòng họp số |
| Ban điều hành khu phố | Đăng ký/đăng nhập, cư dân, phản ánh, văn kiện, hộ dân, duyệt cư dân/hộ dân, khảo sát, cuộc họp, cuộc thi, nhóm cộng đồng, thu/chi, tin tức, thông báo, hotline, trợ lý |
| Cư dân | Đăng ký/đăng nhập, cư dân trong hộ, phản ánh, văn kiện, hộ dân, tham gia khảo sát, cuộc họp, cuộc thi, tin tức, thông báo, tiện ích, hotline, trợ lý |

## 7. Định hướng tích hợp với Zalo Mini App hiện tại

Code hiện tại trong `mna-zaui-egov-sample` đã có một số nền tảng:

- Trang chủ.
- Tin tức.
- Đặt lịch.
- Góp ý/phản ánh.
- Tra cứu hồ sơ.
- Thông tin hướng dẫn.
- Upload ảnh.
- Zalo SDK: user info, token, follow OA, webview, media picker.

Tuy nhiên, bộ yêu cầu eGov DSS/Resident Group cần mở rộng thêm nhiều module:

- Đăng ký/duyệt tài khoản cư dân.
- Quản lý hộ dân/cư dân.
- Duyệt thông tin hộ/cư dân.
- Khảo sát.
- Cuộc thi.
- Cuộc họp.
- Văn kiện/tài liệu.
- Thông báo nhanh.
- Nhóm cộng đồng.
- Thu/chi.
- Trợ lý ảo/chatbot.
- Dashboard/DSS web.
- Admin CMS.

Khuyến nghị:

- **Mini App Zalo** nên ưu tiên vai trò cư dân trước.
- **Tổ trưởng/Ban điều hành khu phố** có thể dùng Mini App phân quyền hoặc web mobile riêng.
- **Lãnh đạo/chuyên viên/admin** nên dùng web quản trị/DSS riêng, không nhồi toàn bộ vào Mini App.

## 8. Kiến trúc module đề xuất

### 8.1. Frontend Mini App

Các module app:

- `auth`
- `home`
- `resident-profile`
- `household`
- `approval`
- `feedback`
- `documents`
- `surveys`
- `meetings`
- `contests`
- `news`
- `notifications`
- `community-groups`
- `finance-income`
- `finance-expense`
- `utilities`
- `assistant`

### 8.2. Web Admin / DSS

Các module web:

- `dashboard`
- `report-data-entry`
- `user-management`
- `organization-management`
- `resident-management`
- `household-management`
- `approval-management`
- `document-management`
- `survey-management`
- `news-management`
- `feedback-management`
- `notification-management`
- `contest-management`
- `income-expense-management`
- `meeting-room`
- `permission-management`
- `audit-log`

### 8.3. Backend/API

Các domain service:

- Auth service.
- User/role service.
- Organization service.
- Resident service.
- Household service.
- Approval workflow service.
- Feedback service.
- Document service.
- Survey service.
- News service.
- Notification service.
- Contest service.
- Meeting service.
- Finance service.
- DSS report service.
- Dashboard aggregation service.
- File storage service.
- Assistant/chatbot service.

## 9. Data model đề xuất

### 9.1. Nhóm người dùng và phân quyền

- `users`
- `accounts`
- `roles`
- `permissions`
- `user_roles`
- `organizations`
- `departments`
- `positions`
- `neighborhood_groups`

### 9.2. Nhóm cư dân/hộ dân

- `residents`
- `households`
- `household_members`
- `resident_union_infos`
- `resident_rewards`
- `resident_disciplines`
- `resident_criminal_records`
- `resident_change_requests`
- `household_change_requests`
- `approval_logs`

### 9.3. Nhóm phản ánh/thông báo/tin tức

- `feedbacks`
- `feedback_types`
- `feedback_process_logs`
- `news_articles`
- `news_comments`
- `quick_notifications`
- `notification_recipients`

### 9.4. Nhóm văn bản/khảo sát/cuộc thi

- `documents`
- `document_categories`
- `document_permissions`
- `surveys`
- `survey_questions`
- `survey_answers`
- `survey_submissions`
- `contests`
- `contest_questions`
- `contest_answers`
- `contest_submissions`
- `contest_results`

### 9.5. Nhóm cuộc họp/phòng họp số

- `meetings`
- `meeting_participants`
- `meeting_documents`
- `meeting_agenda_items`
- `meeting_votes`
- `meeting_vote_options`
- `meeting_vote_results`
- `meeting_conclusions`

### 9.6. Nhóm thu/chi

- `income_campaigns`
- `income_items`
- `household_income_statuses`
- `expense_records`
- `expense_attachments`

### 9.7. Nhóm DSS/báo cáo

- `report_templates`
- `report_periods`
- `report_entries`
- `report_entry_values`
- `report_import_batches`
- `report_attachments`
- `dashboard_indicators`
- `indicator_values`
- `hot_alerts`

## 10. API nhóm chức năng

### 10.1. Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/change-password`
- `POST /auth/forgot-password/verify`
- `POST /auth/forgot-password/reset`
- `GET /auth/me`

### 10.2. Cư dân/hộ dân

- `GET /residents`
- `POST /residents`
- `GET /residents/:id`
- `PATCH /residents/:id`
- `DELETE /residents/:id`
- `POST /residents/import`
- `GET /residents/export`
- `GET /households`
- `POST /households`
- `GET /households/:id`
- `PATCH /households/:id`
- `DELETE /households/:id`
- `POST /households/:id/members`

### 10.3. Duyệt thông tin

- `GET /approvals/residents`
- `POST /approvals/residents/:id/approve`
- `POST /approvals/residents/:id/reject`
- `GET /approvals/households`
- `POST /approvals/households/:id/approve`
- `POST /approvals/households/:id/reject`

### 10.4. Phản ánh

- `GET /feedbacks`
- `POST /feedbacks`
- `GET /feedbacks/:id`
- `PATCH /feedbacks/:id/status`
- `POST /feedbacks/:id/forward`
- `POST /feedbacks/:id/respond`
- `GET /feedback-types`

### 10.5. Văn bản/tài liệu

- `GET /documents`
- `POST /documents`
- `GET /documents/:id`
- `PATCH /documents/:id`
- `DELETE /documents/:id`
- `POST /documents/:id/permissions`

### 10.6. Khảo sát

- `GET /surveys`
- `POST /surveys`
- `GET /surveys/:id`
- `PATCH /surveys/:id`
- `DELETE /surveys/:id`
- `POST /surveys/:id/questions`
- `POST /surveys/:id/submit`
- `GET /surveys/:id/results`

### 10.7. Cuộc thi

- `GET /contests`
- `POST /contests`
- `GET /contests/:id`
- `PATCH /contests/:id`
- `DELETE /contests/:id`
- `POST /contests/:id/questions`
- `POST /contests/:id/submit`
- `GET /contests/:id/results`

### 10.8. Cuộc họp

- `GET /meetings`
- `POST /meetings`
- `GET /meetings/:id`
- `PATCH /meetings/:id`
- `DELETE /meetings/:id`
- `POST /meetings/:id/participants`
- `POST /meetings/:id/confirm`
- `POST /meetings/:id/reject`
- `POST /meetings/:id/conclusion`

### 10.9. Thu/chi

- `GET /income-campaigns`
- `POST /income-campaigns`
- `GET /income-campaigns/:id`
- `PATCH /income-campaigns/:id`
- `POST /income-campaigns/:id/payment-status`
- `GET /expenses`
- `POST /expenses`
- `GET /expenses/:id`
- `PATCH /expenses/:id`

### 10.10. DSS báo cáo/dashboard

- `GET /report-templates`
- `GET /report-periods`
- `POST /report-periods/:id/entries`
- `POST /report-periods/:id/import`
- `GET /report-periods/:id/history`
- `GET /dashboards/overview`
- `GET /dashboards/:block`
- `GET /alerts/hot`

## 11. Backlog triển khai theo ưu tiên

### P0 - Bắt buộc để hình thành hệ thống

- Xác thực, đăng nhập, đăng ký, đổi/quên mật khẩu.
- Quản lý người dùng, vai trò, phân quyền.
- Quản lý tổ dân phố/đơn vị.
- Quản lý cư dân.
- Quản lý hộ dân.
- Duyệt/từ chối thông tin cư dân/hộ dân.
- Góp ý/phản ánh.
- Tin tức/thông báo.
- Văn kiện/tài liệu.
- Backend API và database.
- Admin CMS tối thiểu.

### P1 - Chức năng vận hành khu phố

- Khảo sát.
- Cuộc họp.
- Cuộc thi.
- Thông báo nhanh.
- Nhóm cộng đồng.
- Quản lý thu.
- Quản lý chi.
- Hotline.
- Tiện ích/liên kết.

### P2 - DSS điều hành

- Dashboard tổng quan.
- Dashboard theo khối dữ liệu.
- Nhập liệu báo cáo thủ công.
- Import báo cáo Excel.
- Lịch sử báo cáo.
- Chỉ tiêu nóng/cảnh báo.

### P3 - Nâng cao

- Trợ lý ảo/chatbot Gen AI.
- Camera giám sát.
- IoT.
- Tích hợp Zalo OA nhắc việc.
- Kết nối hệ thống văn bản điện tử/cổng thông tin.
- Phân tích dữ liệu nâng cao.

## 12. Roadmap đề xuất

### Giai đoạn 1 - Chuẩn hóa nền tảng và lõi cư dân

Mục tiêu:

- Có app cư dân/tổ trưởng chạy được.
- Có backend cơ bản.
- Có admin quản lý dữ liệu lõi.

Phạm vi:

- Auth.
- User/role.
- Organization/neighborhood group.
- Resident.
- Household.
- Approval workflow.
- Feedback.
- News.
- Documents.

### Giai đoạn 2 - Hoàn thiện vận hành khu phố

Mục tiêu:

- Ban điều hành khu phố có đủ công cụ quản lý.
- Cư dân có đủ luồng tương tác cộng đồng.

Phạm vi:

- Survey.
- Meeting.
- Contest.
- Quick notification.
- Community group.
- Income.
- Expense.
- Hotline.
- Utilities.

### Giai đoạn 3 - Xây DSS web cho lãnh đạo/chuyên viên

Mục tiêu:

- Cán bộ phường có công cụ nhập liệu, báo cáo và dashboard.

Phạm vi:

- Report template.
- Report data entry.
- Excel import.
- Report history.
- Dashboard overview.
- Dashboard by data block.
- Hot alert.

### Giai đoạn 4 - Phòng họp số

Mục tiêu:

- Quản lý họp không giấy.

Phạm vi:

- Meeting personnel.
- Meeting documents.
- Participant assignment.
- Document permission.
- Voting.
- Agenda assignment.
- Meeting conclusions.

### Giai đoạn 5 - Trợ lý ảo và tích hợp nâng cao

Mục tiêu:

- Có trợ lý hỗ trợ tra cứu nhanh và nhắc việc.

Phạm vi:

- Chatbot Gen AI.
- Knowledge base.
- Zalo OA notification/reminder.
- External system links.
- Camera/IoT nếu có nguồn dữ liệu.

## 13. Tiêu chí nghiệm thu theo vai trò

### 13.1. Cư dân

- Đăng ký tài khoản thành công.
- Đăng nhập/đăng xuất thành công.
- Đổi/quên mật khẩu hoạt động.
- Xem được hộ gia đình của mình.
- Thêm/cập nhật thành viên hộ và gửi duyệt.
- Tạo phản ánh và xem lịch sử phản ánh.
- Xem văn kiện/tài liệu.
- Tham gia khảo sát.
- Tham gia cuộc thi.
- Xem tin tức và thông báo.
- Xác nhận/từ chối tham gia cuộc họp.
- Gọi hotline hoặc mở tiện ích liên kết.

### 13.2. Tổ trưởng/Ban điều hành khu phố

- Xem thống kê hộ dân/cư dân trong tổ.
- Thêm/sửa cư dân/hộ dân trong phạm vi tổ.
- Duyệt/từ chối thông tin cư dân/hộ dân.
- Xử lý hoặc chuyển tiếp phản ánh.
- Tạo cuộc họp và gán cư dân tham gia.
- Tạo nhóm cộng đồng.
- Quản lý thu.
- Quản lý chi.
- Xem kết quả khảo sát/cuộc thi.

### 13.3. Cán bộ/chuyên viên phường

- Đăng nhập web DSS.
- Nhập liệu báo cáo thủ công.
- Import báo cáo Excel.
- Xem lịch sử báo cáo.
- Quản lý cư dân/hộ dân toàn địa bàn.
- Quản lý văn bản, khảo sát, tin tức, phản ánh.
- Quản lý cuộc thi.
- Quản lý thu/chi nếu được phân quyền.
- Xử lý phản ánh chuyển tiếp.

### 13.4. Lãnh đạo phường

- Xem dashboard tổng quan.
- Xem dữ liệu theo khối.
- Xem chỉ tiêu nóng/cảnh báo.
- Xem phản ánh và tiến độ xử lý.
- Xem tình hình cư dân/hộ dân theo tổ.
- Xem báo cáo nhanh theo tháng/quý/năm.

### 13.5. Quản trị hệ thống

- Thêm/sửa/xóa người dùng.
- Cập nhật đơn vị/chức vụ.
- Reset mật khẩu.
- Gán vai trò/quyền.
- Quản lý cấu hình hệ thống.
- Xem audit log.

## 14. Yêu cầu phi chức năng

### 14.1. Bảo mật

- Phân quyền theo vai trò và địa bàn.
- Người dân chỉ xem/sửa dữ liệu hộ của mình.
- Tổ trưởng chỉ xem dữ liệu tổ/khu phố của mình.
- Cán bộ phường xem theo phân quyền.
- Lưu audit log cho thao tác duyệt, xóa, phân quyền, xử lý phản ánh.
- Không log CCCD, mật khẩu, token.
- Mật khẩu phải có chính sách tối thiểu:
  - Tối thiểu 8 ký tự.
  - Có chữ hoa.
  - Có chữ thường.
  - Có số.
  - Có ký tự đặc biệt.

### 14.2. Dữ liệu cá nhân

- Dữ liệu cư dân/hộ dân là dữ liệu nhạy cảm.
- Cần giới hạn quyền truy cập.
- Cần lịch sử thay đổi và phê duyệt.
- Import/export Excel phải kiểm soát quyền.
- File đính kèm phải giới hạn loại file và dung lượng.

### 14.3. Hiệu năng

- Danh sách cư dân/hộ dân phải có phân trang.
- Tìm kiếm nâng cao cần index dữ liệu.
- Dashboard cần cache hoặc pre-aggregate.
- Import Excel cần xử lý bất đồng bộ nếu dữ liệu lớn.

### 14.4. Khả dụng

- App mobile cần có loading/empty/error state.
- Các thao tác gửi dữ liệu cần có xác nhận thành công/thất bại.
- Hỗ trợ mất mạng/chập chờn ở mức thông báo rõ lỗi.

## 15. Mapping với code hiện tại

| Yêu cầu eGov DSS | Code hiện tại | Cần làm |
| --- | --- | --- |
| Trang chủ app | Có `HomePage` | Mở rộng menu, dashboard mini, thông báo, tin tức |
| Phản ánh | Có module Feedback | Bổ sung workflow xử lý/chuyển tiếp/trạng thái |
| Tin tức | Có NewsSection | Bổ sung chi tiết tin, bình luận, admin |
| Văn bản/tài liệu | Chưa có đầy đủ | Xây module documents |
| Cư dân/hộ dân | Chưa có | Xây module resident/household |
| Duyệt cư dân/hộ dân | Chưa có | Xây approval workflow |
| Khảo sát | Chưa có | Xây survey module |
| Cuộc thi | Chưa có | Xây contest module |
| Cuộc họp | Chưa có | Xây meeting module |
| Thu/chi | Chưa có | Xây finance module |
| Dashboard DSS | Chưa có | Xây web DSS riêng |
| Nhập liệu báo cáo | Chưa có | Xây report data entry |
| Phòng họp số | Chưa có | Xây module meeting-room trên web |
| Trợ lý ảo | Chưa có | Xây assistant/chatbot |

## 16. Kế hoạch thực hiện chi tiết

### Sprint 1 - Nền tảng hệ thống

- Thiết kế database lõi.
- Thiết kế API contract.
- Xây auth/register/login/change password/forgot password.
- Xây user/role/permission.
- Xây organization/neighborhood group.
- Kết nối Mini App với auth cơ bản.

### Sprint 2 - Cư dân và hộ dân

- Xây resident API.
- Xây household API.
- Xây màn hình danh sách/chi tiết/form cư dân.
- Xây màn hình danh sách/chi tiết/form hộ dân.
- Xây thêm thành viên hộ.
- Xây import/export Excel cho web admin.

### Sprint 3 - Duyệt thông tin

- Xây change request.
- Xây approval queue.
- Xây so sánh thông tin cũ/mới.
- Xây duyệt/từ chối cư dân.
- Xây duyệt/từ chối hộ dân.
- Ghi approval log.

### Sprint 4 - Phản ánh, tin tức, văn bản

- Xây feedback workflow.
- Xây xử lý/chuyển tiếp phản ánh.
- Xây news + comments.
- Xây documents + file upload/download.
- Xây admin quản lý các module trên.

### Sprint 5 - Khảo sát và cuộc thi

- Xây survey builder.
- Xây survey submit.
- Xây survey results.
- Xây contest builder.
- Xây contest submit.
- Xây contest results/ranking.

### Sprint 6 - Cuộc họp, nhóm cộng đồng, thu/chi

- Xây meeting module.
- Xây participant confirmation.
- Xây community group.
- Xây income campaign.
- Xây expense records.
- Xây báo cáo thu/chi.

### Sprint 7 - DSS report và dashboard

- Xây report template.
- Xây nhập liệu thủ công.
- Xây import Excel.
- Xây lịch sử báo cáo.
- Xây dashboard overview.
- Xây dashboard theo khối dữ liệu.
- Xây cảnh báo nóng.

### Sprint 8 - Phòng họp số

- Xây meeting-room personnel.
- Xây meeting-room documents.
- Xây document permission.
- Xây delegate assignment.
- Xây voting.
- Xây agenda assignment.
- Xây meeting conclusion.

### Sprint 9 - Trợ lý ảo và tích hợp

- Xây assistant UI.
- Xây chatbot backend.
- Tạo knowledge base từ thủ tục, tài liệu, FAQ.
- Tích hợp Zalo OA notification nếu có.
- Tạo liên kết hệ thống ngoài.

### Sprint 10 - Kiểm thử, bảo mật, production

- Test trên Zalo Mini App.
- Test web admin/DSS.
- Test phân quyền.
- Test dữ liệu nhạy cảm.
- Test import/export.
- Security review.
- UAT theo từng vai trò.
- Deploy staging/production.
- Viết tài liệu vận hành.

## 17. Checklist triển khai

- [ ] Có danh sách vai trò và phân quyền chi tiết.
- [ ] Có database schema được duyệt.
- [ ] Có API contract cho từng module.
- [ ] Có wireframe/màn hình cho từng chức năng.
- [ ] Có luồng cư dân đăng ký và chờ duyệt.
- [ ] Có luồng tổ trưởng duyệt cư dân/hộ dân.
- [ ] Có luồng phản ánh từ cư dân đến tổ trưởng/phường.
- [ ] Có import/export Excel cho dữ liệu lớn.
- [ ] Có dashboard DSS tối thiểu.
- [ ] Có admin CMS cho dữ liệu động.
- [ ] Có audit log.
- [ ] Có test phân quyền theo địa bàn.
- [ ] Có tài liệu hướng dẫn vận hành.

## 18. Kết luận

Bộ tài liệu `HDSD eGov DSS` mô tả một hệ thống chính quyền số cấp cơ sở tương đối đầy đủ, gồm cả web điều hành, web/admin quản trị và app cư dân/tổ trưởng. So với code Zalo Mini App hiện tại, phần đã có mới chỉ tương ứng một phần nhỏ của các module cư dân như trang chủ, tin tức và phản ánh.

Để xây dựng đúng theo nội dung tài liệu, cần triển khai theo hướng:

1. Xây lõi tài khoản, phân quyền, tổ dân phố, cư dân, hộ dân.
2. Xây workflow duyệt thông tin và phản ánh.
3. Bổ sung các module cộng đồng: khảo sát, cuộc thi, cuộc họp, văn bản, tin tức, thu/chi.
4. Xây web DSS cho lãnh đạo/chuyên viên với nhập liệu báo cáo và dashboard.
5. Bổ sung phòng họp số và trợ lý ảo sau khi dữ liệu lõi ổn định.

Tài liệu này có thể dùng làm đầu vào để viết PRD chi tiết, thiết kế database/API, wireframe và kế hoạch sprint triển khai.
