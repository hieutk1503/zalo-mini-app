# Đặc tả chi tiết form, màn hình và chức năng quản trị eGov DSS / Resident Group

## 1. Mục đích

Tài liệu này bổ sung chi tiết cho `docs/egov-dss-system-analysis.md`, tập trung vào những gì đội dev cần để xây giao diện và backend:

- Mỗi chức năng cần màn hình nào.
- Danh sách hiển thị những cột nào.
- Form nhập liệu gồm những trường nào.
- Bộ lọc/tìm kiếm nào cần có.
- Nút thao tác nào cần hỗ trợ.
- Trạng thái nghiệp vụ và luồng xử lý.
- API/data model tối thiểu để triển khai.

Lưu ý: Một số label form nằm trong ảnh chụp của PDF/PPTX nên text extract không lấy được hết. Các trường có ghi **đề xuất cần xác nhận** là trường được suy luận từ nội dung hướng dẫn và nghiệp vụ quản lý dân cư/khu phố; cần đối chiếu lại với ảnh giao diện hoặc người dùng nghiệp vụ trước khi chốt.

## 2. Phạm vi hệ thống

Hệ thống nên tách thành 3 bề mặt giao diện:

| Bề mặt | Người dùng | Mục tiêu |
| --- | --- | --- |
| Mini App cư dân | Cư dân/hộ dân | Đăng ký, cập nhật hộ/cư dân, phản ánh, khảo sát, cuộc thi, tin tức, văn kiện, thông báo, hotline |
| App/Web mobile tổ trưởng | Ban điều hành khu phố/tổ trưởng | Duyệt cư dân/hộ dân, quản lý cư dân/hộ trong tổ, xử lý phản ánh, tạo cuộc họp, thu/chi, nhóm cộng đồng |
| Web Admin/DSS | Lãnh đạo, chuyên viên, quản trị | Quản trị người dùng, quản lý dữ liệu toàn phường, nhập liệu báo cáo, dashboard, phòng họp số |

## 3. Quy chuẩn UI chung

### 3.1. Danh sách

Mỗi màn hình danh sách nên có:

- Ô tìm kiếm nhanh.
- Bộ lọc trạng thái.
- Bộ lọc địa bàn/tổ dân phố nếu có.
- Bộ lọc thời gian nếu dữ liệu phát sinh theo ngày.
- Phân trang.
- Nút làm mới.
- Nút thêm mới nếu vai trò được phép.
- Menu hành động từng dòng: xem, sửa, xóa, duyệt, từ chối, xử lý, xuất file tùy module.

### 3.2. Form

Mỗi form nên có:

- Đánh dấu trường bắt buộc bằng `*`.
- Validate frontend và backend.
- Nút `Lưu`, `Hủy`.
- Với luồng phê duyệt có thêm `Gửi xác nhận`, `Lưu và duyệt`, `Phê duyệt`, `Từ chối`.
- Nếu có upload file/ảnh: hiển thị tên file, dung lượng, nút xóa file.
- Nếu có dữ liệu nhạy cảm: che/mask một phần CCCD/SĐT theo vai trò.

### 3.3. Trạng thái chung

Các module phê duyệt nên dùng chung nhóm trạng thái:

| Trạng thái | Ý nghĩa |
| --- | --- |
| `draft` | Lưu nháp |
| `pending` | Chờ duyệt/chờ xử lý |
| `approved` | Đã duyệt |
| `rejected` | Từ chối |
| `processing` | Đang xử lý |
| `forwarded` | Đã chuyển tiếp |
| `completed` | Hoàn thành |
| `cancelled` | Đã hủy |
| `deleted` | Đã xóa mềm |

## 4. Module tài khoản và xác thực

Nguồn: PDF cư dân, PDF ban điều hành khu phố, PDF lãnh đạo/chuyên viên.

### 4.1. Màn hình đăng ký tài khoản

Kênh: Mini App cư dân, App/Web mobile tổ trưởng.

Mục tiêu: Người dùng tự đăng ký tài khoản, sau đó chờ Ban điều hành khu phố phê duyệt.

Trường form:

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Họ và tên | Text | Có | Theo giấy tờ tùy thân |
| Số điện thoại | Phone | Có | Dùng xác thực/liên hệ |
| Số CCCD | Text | Có | 12 chữ số |
| Ngày sinh | Date | Đề xuất | Cần xác nhận từ ảnh form |
| Giới tính | Select | Đề xuất | Nam/Nữ/Khác |
| Địa chỉ thường trú | Textarea | Đề xuất | Cần cho xác minh cư dân |
| Địa chỉ hiện tại | Textarea | Đề xuất | Cần cho tổ dân phố |
| Tổ dân phố/khu phố | Select | Có | Để chuyển đúng nơi phê duyệt |
| Hộ dân liên quan | Select/Text | Đề xuất | Nếu đăng ký gắn với hộ đã có |
| Tên đăng nhập | Text | Có | Có thể mặc định là CCCD |
| Mật khẩu | Password | Có | Theo chính sách mật khẩu |
| Nhập lại mật khẩu | Password | Có | Phải trùng mật khẩu |
| Ảnh giấy tờ/ảnh xác minh | Upload | Đề xuất | Nếu cần xác minh |

Hành động:

- `Đăng ký`
- `Hủy`

Validate:

- SĐT đúng định dạng Việt Nam.
- CCCD 12 số.
- Mật khẩu tối thiểu 8 ký tự, có hoa/thường/số/ký tự đặc biệt.
- Tổ dân phố bắt buộc để route phê duyệt.

Trạng thái sau khi gửi:

- Tạo tài khoản ở trạng thái `pending`.
- Chưa cho đăng nhập hoặc cho đăng nhập với quyền hạn chế cho đến khi được duyệt.

API:

- `POST /auth/register`
- `GET /neighborhood-groups`

### 4.2. Màn hình đăng nhập

Trường form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên truy cập | Text | Có |
| Mật khẩu | Password | Có |
| Captcha | Text/Image | Có với web admin |

Hành động:

- `Đăng nhập`
- `Quên mật khẩu`
- `Đăng ký`

API:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### 4.3. Màn hình đổi mật khẩu

Trường form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Mật khẩu hiện tại | Password | Có |
| Mật khẩu mới | Password | Có |
| Xác nhận mật khẩu mới | Password | Có |

Hành động:

- `Đổi mật khẩu`
- `Hủy`

API:

- `POST /auth/change-password`

### 4.4. Màn hình quên mật khẩu

Luồng:

1. Người dùng chọn `Quên mật khẩu`.
2. Nhập thông tin xác thực.
3. Nếu xác thực đúng, hệ thống hiển thị form đặt mật khẩu mới.
4. Người dùng nhập mật khẩu mới và xác nhận.

Form xác thực:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Họ và tên | Text | Có |
| Số điện thoại | Phone | Có |
| Số CCCD | Text | Có |

Form đặt mật khẩu:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Mật khẩu mới | Password | Có |
| Xác nhận mật khẩu mới | Password | Có |

API:

- `POST /auth/forgot-password/verify`
- `POST /auth/forgot-password/reset`

## 5. Module quản trị người dùng

Nguồn: PDF lãnh đạo/chuyên viên, video `QTHT_Quản lý người dùng.mp4`.

Kênh: Web Admin/DSS.

### 5.1. Danh sách người dùng

Cột hiển thị:

| Cột | Ghi chú |
| --- | --- |
| STT | Số thứ tự |
| Họ và tên | Tên người dùng |
| Tên đăng nhập | Có thể là CCCD khi tạo mới |
| Số điện thoại | Mask nếu cần |
| CCCD | Mask theo quyền |
| Đơn vị/phòng ban | Đơn vị trực thuộc |
| Chức vụ | Chức danh |
| Vai trò/nhóm quyền | Admin, chuyên viên, tổ trưởng, cư dân... |
| Trạng thái | Hoạt động/khóa/chờ duyệt |
| Ngày tạo | Audit |
| Thao tác | Xem, sửa, xóa, reset mật khẩu, phân quyền |

Bộ lọc:

- Từ khóa.
- Đơn vị.
- Chức vụ.
- Vai trò.
- Trạng thái.

Hành động:

- `Thêm mới`
- `Sửa`
- `Xóa`
- `Reset mật khẩu`
- `Cập nhật đơn vị - chức vụ`
- `Cập nhật tài khoản`
- `Phân quyền`

### 5.2. Form thêm/sửa người dùng

Trường form:

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Họ và tên | Text | Có |  |
| Ngày sinh | Date | Đề xuất |  |
| Giới tính | Select | Đề xuất |  |
| Số CCCD | Text | Có | Dùng tạo tài khoản mặc định |
| Ngày cấp CCCD | Date | Đề xuất |  |
| Nơi cấp CCCD | Text | Đề xuất |  |
| Số điện thoại | Phone | Có |  |
| Email | Email | Không |  |
| Địa chỉ | Textarea | Không |  |
| Đơn vị/phòng ban | Select | Có |  |
| Chức vụ | Select | Có |  |
| Trạng thái | Select | Có | Hoạt động/khóa |

Tab cần có:

- `Thông tin chung`
- `Đơn vị - Chức danh`
- `Tài khoản người dùng`
- `Phân quyền`

API:

- `GET /admin/users`
- `POST /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`
- `POST /admin/users/:id/reset-password`
- `POST /admin/users/:id/roles`
- `POST /admin/users/:id/departments`

## 6. Module cư dân

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video cập nhật cư dân.

### 6.1. Danh sách cư dân

Kênh:

- Mini App cư dân: chỉ hiển thị thành viên hộ của mình.
- App tổ trưởng: hiển thị cư dân trong tổ.
- Web admin: hiển thị toàn phường.

Tab/trạng thái:

- `Đã duyệt`
- `Từ chối`
- `Chờ duyệt` với vai trò tổ trưởng/admin

Cột hiển thị:

| Cột | Mini App cư dân | Tổ trưởng | Web admin |
| --- | --- | --- | --- |
| Họ và tên | Có | Có | Có |
| Quan hệ với chủ hộ | Có | Có | Có |
| SĐT | Có | Có | Có |
| CCCD | Mask | Mask | Theo quyền |
| Ngày sinh | Có | Có | Có |
| Giới tính | Có | Có | Có |
| Tổ dân phố | Không | Có | Có |
| Hộ dân | Có | Có | Có |
| Trạng thái | Có | Có | Có |
| Lý do từ chối | Có nếu bị từ chối | Có | Có |
| Thao tác | Xem/sửa/gửi xác nhận | Xem/sửa/lưu và duyệt | Xem/sửa/xóa/import/export |

Bộ lọc web/admin:

- Từ khóa.
- Tổ dân phố.
- Trạng thái.
- Giới tính.
- Độ tuổi.
- Tạm trú/thường trú.
- Hộ dân.

### 6.2. Form thông tin chung cư dân

Trường form:

| Nhóm | Trường | Kiểu | Bắt buộc |
| --- | --- | --- | --- |
| Định danh | Họ và tên | Text | Có |
| Định danh | Số CCCD | Text | Có |
| Định danh | Ngày cấp CCCD | Date | Đề xuất |
| Định danh | Nơi cấp CCCD | Text | Đề xuất |
| Cá nhân | Ngày sinh | Date | Có |
| Cá nhân | Giới tính | Select | Có |
| Cá nhân | Dân tộc | Select/Text | Đề xuất |
| Cá nhân | Tôn giáo | Select/Text | Đề xuất |
| Cá nhân | Quốc tịch | Select | Đề xuất |
| Liên hệ | Số điện thoại | Phone | Có |
| Liên hệ | Email | Email | Không |
| Cư trú | Địa chỉ thường trú | Textarea | Đề xuất |
| Cư trú | Địa chỉ hiện tại | Textarea | Có |
| Cư trú | Loại cư trú | Select | Đề xuất: thường trú/tạm trú |
| Hộ dân | Hộ dân | Select | Có |
| Hộ dân | Quan hệ với chủ hộ | Select | Có |
| Địa bàn | Tổ dân phố | Select | Có |
| Trạng thái | Trạng thái phê duyệt | Select | System |
| Ghi chú | Ghi chú | Textarea | Không |

Hành động theo vai trò:

- Cư dân: `Lưu`, `Gửi xác nhận`.
- Tổ trưởng: `Lưu`, `Lưu và duyệt`.
- Admin: `Lưu`, `Xóa`.

### 6.3. Tab đoàn thể

Mục tiêu: quản lý thông tin tham gia tổ chức/đoàn thể.

Cột danh sách:

- Tổ chức/đoàn thể.
- Chức vụ/vai trò.
- Ngày tham gia.
- Ngày kết thúc.
- Trạng thái.
- Ghi chú.

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên tổ chức/đoàn thể | Select/Text | Có |
| Chức vụ/vai trò | Text | Không |
| Ngày tham gia | Date | Không |
| Ngày kết thúc | Date | Không |
| Ghi chú | Textarea | Không |

### 6.4. Tab khen thưởng

Cột danh sách:

- Danh hiệu/hình thức khen thưởng.
- Cấp khen thưởng.
- Số quyết định.
- Ngày quyết định.
- Nội dung.
- File đính kèm.

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên khen thưởng | Text | Có |
| Cấp khen thưởng | Select/Text | Không |
| Số quyết định | Text | Không |
| Ngày quyết định | Date | Không |
| Nội dung | Textarea | Không |
| File đính kèm | Upload | Không |

### 6.5. Tab kỷ luật

Form tương tự khen thưởng, thay bằng:

- Hình thức kỷ luật.
- Cơ quan ra quyết định.
- Số quyết định.
- Ngày quyết định.
- Lý do/nội dung.
- File đính kèm.

### 6.6. Tab tiền án, tiền sự

Form đề xuất:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Loại thông tin | Select | Có: tiền án/tiền sự |
| Nội dung | Textarea | Có |
| Ngày ghi nhận | Date | Không |
| Cơ quan ghi nhận | Text | Không |
| Trạng thái | Select | Không |
| File đính kèm | Upload | Không |

API:

- `GET /residents`
- `POST /residents`
- `GET /residents/:id`
- `PATCH /residents/:id`
- `DELETE /residents/:id`
- `POST /residents/import`
- `GET /residents/export`
- `POST /residents/:id/submit-approval`
- `POST /residents/:id/approve`
- `POST /residents/:id/reject`

## 7. Module hộ dân

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video thêm thành viên hộ dân.

### 7.1. Danh sách hộ dân

Tab/trạng thái:

- `Đã duyệt`
- `Từ chối`
- `Chờ duyệt`

Cột hiển thị:

| Cột | Ghi chú |
| --- | --- |
| Mã hộ | Mã hệ thống |
| Chủ hộ | Tên chủ hộ |
| Số nhân khẩu | Tổng thành viên |
| Địa chỉ | Địa chỉ hộ |
| Tổ dân phố | Địa bàn |
| Loại hộ | Đề xuất: thường trú/tạm trú/nhà trọ |
| Gia đình văn hóa | Có/không/năm |
| Trạng thái | Chờ duyệt/đã duyệt/từ chối |
| Lý do từ chối | Nếu có |
| Thao tác | Xem/sửa/xóa/duyệt/từ chối |

Bộ lọc:

- Từ khóa.
- Tổ dân phố.
- Trạng thái.
- Chủ hộ.
- Loại hộ.
- Gia đình văn hóa.

### 7.2. Form thông tin chung hộ dân

Trường form:

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Mã hộ | Text | System | Tự sinh hoặc nhập theo hệ thống nguồn |
| Chủ hộ | Select resident | Có | Chọn từ cư dân |
| Số nhà/đường | Text | Đề xuất |  |
| Địa chỉ chi tiết | Textarea | Có |  |
| Tổ dân phố | Select | Có |  |
| Loại hộ | Select | Đề xuất | Thường trú/tạm trú/nhà trọ |
| Số nhân khẩu | Number | System | Tính từ thành viên |
| Số hộ khẩu/sổ cư trú | Text | Đề xuất | Nếu nghiệp vụ cần |
| Trạng thái cư trú | Select | Đề xuất | Đang ở/chuyển đi... |
| Ghi chú | Textarea | Không |  |

Hành động:

- Cư dân: `Lưu`, `Gửi xác nhận`.
- Tổ trưởng: `Lưu`, `Lưu và duyệt`.
- Admin: `Lưu`, `Xóa`.

### 7.3. Tab thông tin thành viên

Cột:

- Họ tên.
- CCCD.
- Ngày sinh.
- Giới tính.
- Quan hệ với chủ hộ.
- SĐT.
- Trạng thái.
- Thao tác.

Form thêm thành viên:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Cư dân có sẵn | Select | Không |
| Họ và tên | Text | Có nếu tạo mới |
| CCCD | Text | Có nếu tạo mới |
| Ngày sinh | Date | Có |
| Giới tính | Select | Có |
| Quan hệ với chủ hộ | Select | Có |
| Số điện thoại | Phone | Không |
| Loại cư trú | Select | Đề xuất |

### 7.4. Tab gia đình văn hóa

Cột:

- Năm.
- Danh hiệu.
- Số quyết định.
- Ngày công nhận.
- Ghi chú.

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Năm | Number/Select | Có |
| Danh hiệu | Text/Select | Có |
| Số quyết định | Text | Không |
| Ngày công nhận | Date | Không |
| File đính kèm | Upload | Không |
| Ghi chú | Textarea | Không |

API:

- `GET /households`
- `POST /households`
- `GET /households/:id`
- `PATCH /households/:id`
- `DELETE /households/:id`
- `POST /households/:id/members`
- `PATCH /households/:id/members/:memberId`
- `DELETE /households/:id/members/:memberId`
- `POST /households/import`
- `GET /households/export`
- `POST /households/:id/submit-approval`
- `POST /households/:id/approve`
- `POST /households/:id/reject`

## 8. Module duyệt cư dân/hộ dân

Nguồn: PDF ban điều hành, video tổ trưởng duyệt cư dân/hộ dân.

### 8.1. Danh sách phê duyệt nhanh

Cột:

- Loại yêu cầu: cư dân/hộ dân/tài khoản.
- Người gửi.
- Tổ dân phố.
- Nội dung thay đổi.
- Ngày gửi.
- Trạng thái.
- Thao tác.

Bộ lọc:

- Loại yêu cầu.
- Tổ dân phố.
- Trạng thái.
- Khoảng ngày gửi.

### 8.2. Màn hình chi tiết duyệt

Khu vực hiển thị:

- Thông tin người gửi yêu cầu.
- Thông tin hiện tại.
- Thông tin đề xuất thay đổi.
- Lịch sử duyệt/từ chối.
- File/ảnh đính kèm nếu có.

Hành động:

- `Phê duyệt`
- `Từ chối`
- `Quay lại`

Form từ chối:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Lý do từ chối | Textarea | Có |

API:

- `GET /approval-requests`
- `GET /approval-requests/:id`
- `POST /approval-requests/:id/approve`
- `POST /approval-requests/:id/reject`

## 9. Module phản ánh/góp ý

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video tạo/xử lý phản ánh.

### 9.1. Danh sách phản ánh

Tab/trạng thái:

- `Chờ xử lý`
- `Đang xử lý`
- `Chuyển tiếp`
- `Đã xử lý`
- `Từ chối/Đóng` nếu cần

Cột:

| Cột | Ghi chú |
| --- | --- |
| Mã phản ánh | Tự sinh |
| Tiêu đề |  |
| Loại phản ánh |  |
| Người gửi | Cư dân |
| SĐT | Mask theo vai trò |
| Tổ dân phố |  |
| Ngày gửi |  |
| Trạng thái |  |
| Đơn vị xử lý | Tổ trưởng/phòng ban |
| Thao tác | Xem/sửa/xóa/tiếp nhận/chuyển/hoàn thành/xử lý |

Bộ lọc:

- Từ khóa.
- Loại phản ánh.
- Tổ dân phố.
- Trạng thái.
- Khoảng ngày gửi.
- Đơn vị xử lý.

### 9.2. Form tạo/sửa phản ánh

Trường form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Loại phản ánh | Select | Có |
| Tiêu đề | Text | Có |
| Nội dung | Textarea | Có |
| Địa điểm xảy ra | Text/Map | Đề xuất |
| Ảnh đính kèm | Upload multiple | Không |
| File đính kèm | Upload | Không |
| Người gửi | System | Có |
| Tổ dân phố | System/Select | Có |

Hành động cư dân:

- `Lưu`
- `Gửi phản ánh`
- `Sửa`
- `Xóa` nếu chưa xử lý

### 9.3. Màn hình xử lý phản ánh của tổ trưởng

Hành động từ `Chờ xử lý`:

- `Tiếp nhận`: chuyển sang `Đang xử lý`.
- `Chuyển`: chuyển lên phòng ban chuyên môn, trạng thái `Chuyển tiếp`.
- `Hoàn thành`: đóng phản ánh, trạng thái `Đã xử lý`.

Hành động từ `Đang xử lý`:

- `Chuyển`.
- `Hoàn thành`.

Form xử lý:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Nội dung xử lý | Textarea | Có |
| File/ảnh xử lý | Upload | Không |
| Đơn vị chuyển tiếp | Select | Có nếu chọn Chuyển |

### 9.4. Màn hình xử lý của UBND phường

Điều kiện: chỉ xử lý phản ánh trạng thái `Chuyển tiếp`.

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Nội dung xử lý | Textarea | Có |
| File đính kèm | Upload | Không |
| Trạng thái sau xử lý | Select | Có: đang xử lý/hoàn thành |

API:

- `GET /feedbacks`
- `POST /feedbacks`
- `GET /feedbacks/:id`
- `PATCH /feedbacks/:id`
- `DELETE /feedbacks/:id`
- `POST /feedbacks/:id/receive`
- `POST /feedbacks/:id/forward`
- `POST /feedbacks/:id/complete`
- `POST /feedbacks/:id/respond`

## 10. Module văn kiện/văn bản/tài liệu

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên.

### 10.1. Danh sách văn kiện/tài liệu trên app

Cột/card:

- Tiêu đề.
- Loại văn bản.
- Ngày ban hành/ngày đăng.
- Cơ quan ban hành.
- Tóm tắt.
- File đính kèm.

Bộ lọc:

- Từ khóa.
- Loại văn bản.
- Chủ đề/lĩnh vực.
- Năm.

Hành động:

- `Xem chi tiết`
- `Xem file`
- `Tải tài liệu`
- `Chia sẻ`

### 10.2. Admin quản lý văn bản

Danh sách cột:

- Số/ký hiệu văn bản.
- Tiêu đề/trích yếu.
- Loại văn bản.
- Lĩnh vực.
- Ngày ban hành.
- Ngày đăng.
- Trạng thái.
- File.
- Thao tác.

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Số/ký hiệu văn bản | Text | Đề xuất |
| Tiêu đề/trích yếu | Text | Có |
| Loại văn bản | Select | Có |
| Lĩnh vực/chủ đề | Select | Không |
| Cơ quan ban hành | Text/Select | Không |
| Ngày ban hành | Date | Không |
| Nội dung/tóm tắt | Rich text/Textarea | Không |
| File đính kèm | Upload | Có |
| Phạm vi hiển thị | Select | Có |
| Trạng thái | Select | Có: nháp/xuất bản |

API:

- `GET /documents`
- `POST /documents`
- `GET /documents/:id`
- `PATCH /documents/:id`
- `DELETE /documents/:id`
- `POST /documents/:id/publish`

## 11. Module khảo sát

Nguồn: PDF cư dân, PDF ban điều hành, PDF lãnh đạo/chuyên viên, video quản lý khảo sát.

### 11.1. App tham gia khảo sát

Danh sách khảo sát:

- Tên khảo sát.
- Mô tả.
- Thời gian bắt đầu/kết thúc.
- Trạng thái.
- Đã tham gia/chưa tham gia.
- Nút `Bắt đầu khảo sát`, `Làm lại khảo sát`, `Xem kết quả` nếu được phép.

Form làm khảo sát:

Loại câu hỏi:

- Một lựa chọn.
- Nhiều lựa chọn.
- Nhập nội dung.
- Thang điểm.

Hành động:

- `Hoàn thành`
- `Làm lại khảo sát`

### 11.2. Admin quản lý khảo sát

Danh sách:

- Tên khảo sát.
- Đối tượng.
- Thời gian bắt đầu.
- Thời gian kết thúc.
- Số câu hỏi.
- Số người tham gia.
- Trạng thái.
- Thao tác.

Form khảo sát:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên khảo sát | Text | Có |
| Mô tả | Textarea | Không |
| Đối tượng khảo sát | Multi-select | Có |
| Tổ dân phố áp dụng | Multi-select | Không |
| Thời gian bắt đầu | Datetime | Có |
| Thời gian kết thúc | Datetime | Có |
| Cho phép làm lại | Checkbox | Không |
| Hiển thị kết quả cho người tham gia | Checkbox | Không |
| Trạng thái | Select | Có |

Form câu hỏi:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Nội dung câu hỏi | Textarea | Có |
| Loại câu hỏi | Select | Có |
| Bắt buộc trả lời | Checkbox | Không |
| Thứ tự | Number | Có |
| Danh sách đáp án | Dynamic list | Có với chọn đáp án |

API:

- `GET /surveys`
- `POST /surveys`
- `PATCH /surveys/:id`
- `DELETE /surveys/:id`
- `GET /surveys/:id/questions`
- `POST /surveys/:id/questions`
- `PATCH /survey-questions/:id`
- `DELETE /survey-questions/:id`
- `POST /surveys/:id/submit`
- `GET /surveys/:id/results`

## 12. Module tin tức và bình luận

### 12.1. App xem tin tức

Card/list:

- Ảnh đại diện.
- Tiêu đề.
- Tóm tắt.
- Ngày đăng.
- Lượt xem/bình luận nếu có.

Chi tiết:

- Tiêu đề.
- Nội dung.
- Ảnh/file.
- Bình luận.

### 12.2. Admin quản lý tin tức

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tiêu đề | Text | Có |
| Tóm tắt | Textarea | Không |
| Nội dung | Rich text | Có |
| Ảnh đại diện | Upload image | Không |
| Chuyên mục | Select | Không |
| Đối tượng hiển thị | Multi-select | Có |
| Cho phép bình luận | Checkbox | Không |
| Trạng thái | Select | Có: nháp/xuất bản/ẩn |
| Thời gian đăng | Datetime | Không |

Quản lý bình luận:

- Danh sách bình luận.
- Ẩn/hiện bình luận.
- Xóa bình luận.

API:

- `GET /news`
- `POST /news`
- `GET /news/:id`
- `PATCH /news/:id`
- `DELETE /news/:id`
- `POST /news/:id/comments`
- `PATCH /news-comments/:id/hide`

## 13. Module thông báo nhanh

### 13.1. App xem thông báo

Cột/card:

- Tiêu đề.
- Nội dung ngắn.
- Thời gian gửi.
- Đã đọc/chưa đọc.
- Mức độ: thường/quan trọng/khẩn.

### 13.2. Admin tạo thông báo nhanh

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tiêu đề | Text | Có |
| Nội dung | Textarea/Rich text | Có |
| Mức độ | Select | Không |
| Đối tượng nhận | Multi-select | Có |
| Tổ dân phố nhận | Multi-select | Không |
| Gửi ngay/lên lịch | Radio | Có |
| Thời gian gửi | Datetime | Nếu lên lịch |
| File/ảnh đính kèm | Upload | Không |

API:

- `GET /notifications`
- `POST /notifications`
- `GET /notifications/:id`
- `POST /notifications/:id/read`
- `GET /admin/notifications`

## 14. Module cuộc thi

Nguồn: PDF, slide, video quản lý/tham gia cuộc thi.

### 14.1. App tham gia cuộc thi

Danh sách:

- Tên cuộc thi.
- Mô tả.
- Thời gian bắt đầu/kết thúc.
- Trạng thái.
- Đã tham gia/chưa tham gia.
- Nút `Tham gia`, `Kết quả`.

Màn hình làm bài:

- Câu hỏi.
- Danh sách đáp án.
- Thanh tiến độ.
- Nút `Làm lại`.
- Nút `Hoàn thành`.

Kết quả:

- Điểm.
- Số câu đúng.
- Thời gian nộp.
- Xếp hạng.
- Nút xem bài làm.

### 14.2. Admin quản lý cuộc thi

Form cuộc thi:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên cuộc thi | Text | Có |
| Mô tả | Textarea/Rich text | Không |
| Đối tượng tham gia | Multi-select | Có |
| Thời gian bắt đầu | Datetime | Có |
| Thời gian kết thúc | Datetime | Có |
| Thời lượng làm bài | Number | Đề xuất |
| Số lần được làm | Number | Đề xuất |
| Hiển thị kết quả ngay | Checkbox | Không |
| Trạng thái | Select | Có |

Form câu hỏi:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Nội dung câu hỏi | Textarea | Có |
| Loại câu hỏi | Select | Có |
| Điểm | Number | Có |
| Thứ tự | Number | Có |
| Đáp án | Dynamic list | Có |
| Đáp án đúng | Select/Checkbox | Có |

API:

- `GET /contests`
- `POST /contests`
- `PATCH /contests/:id`
- `DELETE /contests/:id`
- `POST /contests/:id/questions`
- `PATCH /contest-questions/:id`
- `POST /contests/:id/submit`
- `GET /contests/:id/results`

## 15. Module cuộc họp

Nguồn: PDF ban điều hành, PDF cư dân, slide, video tổ trưởng tạo cuộc họp.

### 15.1. App tổ trưởng tạo cuộc họp

Form cuộc họp:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên cuộc họp | Text | Có |
| Nội dung cuộc họp | Textarea | Có |
| Thời gian bắt đầu | Datetime | Có |
| Thời gian kết thúc | Datetime | Không |
| Địa điểm | Text | Có |
| Chủ trì | Select/User | Đề xuất |
| Thành phần tham dự | Multi-select residents | Có |
| Tài liệu liên quan | Upload | Không |
| Ghi chú | Textarea | Không |

Sau khi lưu:

- Chuyển sang danh sách thành phần tham dự.
- Tích chọn cư dân tham gia.
- Gửi thông báo đến cư dân.

### 15.2. App cư dân xác nhận cuộc họp

Danh sách:

- Tên cuộc họp.
- Thời gian.
- Địa điểm.
- Chủ trì.
- Trạng thái xác nhận.

Hành động:

- `Xác nhận tham gia`
- `Từ chối tham gia`
- `Xem kết luận`
- `Xem tài liệu`

Form từ chối:

- Lý do từ chối.

Sau khi cuộc họp kết thúc:

- Hiển thị trạng thái `Đã kết thúc`.
- Hiển thị kết luận.
- Hiển thị tài liệu liên quan.

API:

- `GET /meetings`
- `POST /meetings`
- `GET /meetings/:id`
- `PATCH /meetings/:id`
- `POST /meetings/:id/participants`
- `POST /meetings/:id/confirm`
- `POST /meetings/:id/reject`
- `POST /meetings/:id/conclusion`

## 16. Module nhóm cộng đồng

Nguồn: PDF ban điều hành, slide.

Danh sách:

- Tên nhóm.
- Mô tả/chủ đề.
- Số thành viên.
- Người tạo.
- Ngày tạo.
- Trạng thái.

Form tạo nhóm:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên nhóm cộng đồng | Text | Có |
| Mô tả | Textarea | Không |
| Chủ đề/loại nhóm | Select | Không |
| Thành viên | Multi-select residents | Có |
| Trạng thái | Select | Có |

Hành động:

- `Thêm mới`
- `Thêm cư dân vào nhóm`
- `Xóa cư dân khỏi nhóm`
- `Hoàn tất`

API:

- `GET /community-groups`
- `POST /community-groups`
- `PATCH /community-groups/:id`
- `DELETE /community-groups/:id`
- `POST /community-groups/:id/members`
- `DELETE /community-groups/:id/members/:residentId`

## 17. Module quản lý thu

Nguồn: PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide.

### 17.1. Danh sách đợt thu

Cột:

- Tên đợt thu.
- Tổ dân phố.
- Khoản thu.
- Số tiền dự kiến.
- Số hộ phải thu.
- Số hộ đã đóng.
- Số hộ chưa đóng.
- Tổng đã thu.
- Thời gian bắt đầu/kết thúc.
- Trạng thái.
- Thao tác.

Bộ lọc:

- Tổ dân phố.
- Trạng thái.
- Khoảng thời gian.
- Tên đợt thu.

### 17.2. Form đợt thu

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên đợt thu | Text | Có |
| Tổ dân phố áp dụng | Select/Multi-select | Có |
| Loại khoản thu | Select | Có |
| Mô tả/mục đích | Textarea | Không |
| Số tiền mỗi hộ | Number | Đề xuất |
| Tổng số tiền dự kiến | Number | Không |
| Ngày bắt đầu | Date | Có |
| Ngày kết thúc | Date | Không |
| Danh sách hộ áp dụng | Multi-select/Auto | Có |
| File/chứng từ | Upload | Không |
| Trạng thái | Select | Có |

### 17.3. Chi tiết đợt thu

Cột hộ:

- Hộ dân.
- Chủ hộ.
- Số tiền phải đóng.
- Số tiền đã đóng.
- Ngày đóng.
- Trạng thái: chưa đóng/đã đóng/đóng một phần/miễn giảm.
- Ghi chú.

Hành động:

- Cập nhật trạng thái đóng.
- Sửa đợt thu.
- Xóa đợt thu.
- Xuất báo cáo.

API:

- `GET /income-campaigns`
- `POST /income-campaigns`
- `PATCH /income-campaigns/:id`
- `DELETE /income-campaigns/:id`
- `GET /income-campaigns/:id/households`
- `POST /income-campaigns/:id/payment-status`
- `GET /income-campaigns/:id/export`

## 18. Module quản lý chi

Nguồn: PDF ban điều hành, PDF lãnh đạo/chuyên viên, slide.

### 18.1. Danh sách đợt chi/khoản chi

Cột:

- Tên khoản chi/đợt chi.
- Tổ dân phố.
- Mục đích.
- Số tiền.
- Ngày chi.
- Người thực hiện.
- Chứng từ.
- Trạng thái.
- Thao tác.

Bộ lọc:

- Tổ dân phố.
- Trạng thái.
- Khoảng thời gian.
- Từ khóa.

### 18.2. Form khoản chi

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên khoản chi | Text | Có |
| Tổ dân phố | Select | Có |
| Mục đích chi | Textarea | Có |
| Số tiền | Number | Có |
| Ngày chi | Date | Có |
| Người chi/người lập | Select/Text | Đề xuất |
| Nguồn quỹ | Select | Đề xuất |
| Chứng từ đính kèm | Upload | Không |
| Ghi chú | Textarea | Không |
| Trạng thái | Select | Có |

API:

- `GET /expenses`
- `POST /expenses`
- `PATCH /expenses/:id`
- `DELETE /expenses/:id`
- `GET /expenses/export`

## 19. Module nhập liệu báo cáo DSS

Nguồn: PDF lãnh đạo/chuyên viên, video nhập liệu thủ công và import Excel.

### 19.1. Danh sách kỳ báo cáo

Cột:

- Lĩnh vực.
- Tên báo cáo.
- Kỳ báo cáo.
- Tần suất.
- Đơn vị nhập liệu.
- Hạn nhập.
- Trạng thái nhập liệu.
- Người cập nhật cuối.
- Thời gian cập nhật.
- Thao tác.

Bộ lọc:

- Lĩnh vực.
- Tên báo cáo.
- Kỳ báo cáo.
- Đơn vị.
- Trạng thái.

### 19.2. Form thêm mới dữ liệu báo cáo

Trường:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Lĩnh vực | Select | Có |
| Tên báo cáo | Select/Text | Có |
| Kỳ báo cáo | Select/Date range | Có |
| Đơn vị báo cáo | Select | Có |
| Tần suất | Select | Có |
| Hạn nhập liệu | Date | Không |
| Ghi chú | Textarea | Không |

Lưu ý từ tài liệu: khi đến kỳ nhập liệu mới, hệ thống có thể tự sinh bản ghi kỳ mới, người dùng không cần tạo thủ công.

### 19.3. Nhập liệu báo cáo

Có 3 cách:

1. Nhập dữ liệu từ Excel.
2. Nhập từ kỳ trước.
3. Nhập liệu thủ công.

Màn hình nhập thủ công:

- Hiển thị các chỉ tiêu theo mẫu báo cáo.
- Mỗi chỉ tiêu có ô giá trị.
- Có thể có đơn vị tính.
- Có ghi chú/diễn giải.
- Có upload tài liệu đính kèm.
- Có cập nhật vị trí trên bản đồ nếu chỉ tiêu yêu cầu.

Màn hình import Excel:

- Nút tải file mẫu.
- Upload file `.xlsx`/`.xls`.
- Preview dữ liệu.
- Validate lỗi từng dòng/cột.
- Nút xác nhận đẩy dữ liệu.

Màn hình lấy từ kỳ trước:

- Chọn kỳ nguồn.
- Preview dữ liệu nguồn.
- Xác nhận sao chép.
- Cho phép chỉnh sửa sau khi sao chép.

API:

- `GET /report-templates`
- `GET /report-periods`
- `POST /report-periods`
- `GET /report-periods/:id/entries`
- `POST /report-periods/:id/entries`
- `POST /report-periods/:id/import`
- `POST /report-periods/:id/copy-from-previous`
- `GET /report-periods/:id/history`
- `POST /report-periods/:id/attachments`

## 20. Module dashboard DSS

Nguồn: PPTX tập huấn DSS.

### 20.1. Dashboard tổng quan

Khối hiển thị:

- Thông tin chung phường.
- Quy hoạch.
- Thu/chi ngân sách.
- Các phân hệ chính.
- Chỉ tiêu nóng/cảnh báo.
- Liên kết hệ thống ngoài.

### 20.2. Dashboard theo khối dữ liệu

Khối dữ liệu:

- Xây dựng Đảng.
- Văn phòng HĐND và UBND.
- Kinh tế/hạ tầng/đô thị.
- Văn hóa - xã hội.
- Hành chính công.
- Đơn vị phối quản/sự nghiệp.

Mỗi dashboard nên có:

- Bộ lọc thời gian.
- Bộ lọc đơn vị/tổ dân phố.
- KPI cards.
- Biểu đồ.
- Bảng chi tiết.
- Nút xuất báo cáo.

API:

- `GET /dashboards/overview`
- `GET /dashboards/:block`
- `GET /dashboard-indicators`
- `GET /hot-alerts`

## 21. Module phòng họp số

Nguồn: PDF lãnh đạo/chuyên viên.

### 21.1. Quản lý nhân sự họp

Danh sách:

- Họ tên.
- Đơn vị.
- Chức vụ.
- Vai trò trong họp.
- SĐT/email.
- Trạng thái.

Form:

- Họ tên.
- Đơn vị.
- Chức vụ.
- SĐT.
- Email.
- Vai trò.
- Ghi chú.

### 21.2. Quản lý cuộc họp Đảng ủy/UBND/MTTQ

Form:

| Trường | Kiểu | Bắt buộc |
| --- | --- | --- |
| Tên cuộc họp | Text | Có |
| Loại cuộc họp | Select | Có: Đảng ủy/UBND/MTTQ |
| Thời gian | Datetime | Có |
| Địa điểm | Text | Có |
| Chủ trì | Select | Có |
| Thư ký | Select | Không |
| Nội dung tóm tắt | Textarea | Không |
| Trạng thái | Select | Có |

### 21.3. Quản lý tài liệu cuộc họp

Tài liệu yêu cầu hỗ trợ:

- Thêm thư mục cha.
- Thêm thư mục con.
- Upload tài liệu PDF vào thư mục.

Form thư mục:

- Tên thư mục.
- Thư mục cha.
- Thứ tự.

Form tài liệu:

- Tên tài liệu.
- Thư mục.
- File PDF.
- Mô tả.
- Phạm vi quyền xem.

### 21.4. Gán đại biểu họp

Màn hình:

- Danh sách đại biểu khả dụng.
- Danh sách đã chọn.
- Vai trò trong cuộc họp.
- Nút lưu.

### 21.5. Phân quyền tài liệu

Form:

- Chọn tài liệu/thư mục.
- Chọn vai trò/người dùng được xem.
- Quyền: xem/tải xuống/quản lý.

### 21.6. Biểu quyết

Form biểu quyết:

- Tiêu đề biểu quyết.
- Nội dung.
- Thời gian mở/đóng.
- Hình thức biểu quyết.
- Danh sách phương án.
- Đối tượng được biểu quyết.

Kết quả:

- Tổng số đại biểu.
- Số đã biểu quyết.
- Tỷ lệ từng phương án.
- Danh sách chi tiết nếu được phân quyền.

### 21.7. Gán nội dung họp

Form:

- Cuộc họp.
- Tiêu đề nội dung.
- Mô tả.
- Người phụ trách.
- Thời lượng dự kiến.
- Thứ tự.

API nhóm:

- `GET /meeting-room/meetings`
- `POST /meeting-room/meetings`
- `PATCH /meeting-room/meetings/:id`
- `DELETE /meeting-room/meetings/:id`
- `POST /meeting-room/meetings/:id/participants`
- `POST /meeting-room/doc-folders`
- `POST /meeting-room/documents`
- `POST /meeting-room/documents/:id/permissions`
- `POST /meeting-room/votes`
- `GET /meeting-room/votes/:id/results`
- `POST /meeting-room/agenda-items`

## 22. Module tiện ích, hotline, phạt nguội, trợ lý

### 22.1. Cơ sở hạ tầng xã hội / văn hóa - giải trí

Danh sách:

- Tên địa điểm.
- Loại: y tế, trường học, bưu điện, nhà văn hóa, di tích, nhà hàng, karaoke...
- Địa chỉ.
- SĐT.
- Giờ hoạt động.
- Vị trí bản đồ.

Form admin:

- Tên.
- Loại.
- Địa chỉ.
- Tọa độ/map URL.
- SĐT.
- Mô tả.
- Ảnh.
- Trạng thái hiển thị.

### 22.2. Liên kết

Danh sách liên kết mặc định:

- Tra cứu DVC.
- Cổng thông tin Phù Liễn.
- Cổng thông tin thành phố Hải Phòng.

Form admin:

- Tên liên kết.
- URL.
- Icon.
- Mô tả.
- Thứ tự.
- Trạng thái.

### 22.3. Tra cứu phạt nguội

Form:

- Biển số xe.
- Loại phương tiện nếu cần.

Hành động:

- `Tìm kiếm`.

Kết quả:

- Biển số.
- Thời gian vi phạm.
- Địa điểm.
- Hành vi.
- Đơn vị xử lý.
- Trạng thái xử lý.

Giai đoạn đầu có thể mở webview đến nguồn tra cứu bên ngoài thay vì tự tích hợp API.

### 22.4. Hotline

Danh sách:

- Nhóm hotline: cứu hỏa, cứu thương, công an, giải đáp dịch vụ công...
- Tên đơn vị/người phụ trách.
- Số điện thoại.
- Mô tả.
- Nút gọi.

Form admin:

- Nhóm.
- Tên hiển thị.
- Chức vụ/đơn vị.
- SĐT.
- Thứ tự.
- Trạng thái.

### 22.5. Trợ lý ảo

Màn hình:

- Danh sách hội thoại.
- Ô nhập câu hỏi.
- Câu trả lời.
- Nguồn tham khảo nếu có.
- Gợi ý câu hỏi nhanh.

Phạm vi trả lời:

- Người dân: thủ tục hành chính, chính sách, sự kiện, tiện ích.
- Cán bộ: tra cứu dữ liệu, tóm tắt lĩnh vực, văn bản, báo cáo, chỉ số điều hành.

API:

- `POST /assistant/sessions`
- `POST /assistant/messages`
- `GET /assistant/suggestions`

## 23. Ma trận màn hình cần xây

| Module | Mini App cư dân | App tổ trưởng | Web Admin/DSS |
| --- | --- | --- | --- |
| Auth | Đăng ký, đăng nhập, đổi/quên mật khẩu | Đăng ký, đăng nhập, đổi/quên mật khẩu | Đăng nhập, đổi mật khẩu |
| User management | Không | Không | Danh sách, thêm/sửa/xóa, phân quyền |
| Cư dân | Danh sách hộ mình, chi tiết, cập nhật | Danh sách tổ, chi tiết, cập nhật, duyệt | Danh sách toàn phường, import/export |
| Hộ dân | Hộ của mình, thêm thành viên | Danh sách tổ, thêm/sửa/duyệt | Danh sách toàn phường, import/export |
| Phản ánh | Tạo/sửa/xóa/xem lịch sử | Tiếp nhận/chuyển/hoàn thành | Xử lý phản ánh chuyển tiếp |
| Văn bản | Xem/tải/chia sẻ | Xem/tải/chia sẻ | CRUD/upload/phân quyền |
| Khảo sát | Tham gia/làm lại | Xem kết quả/tham gia | CRUD khảo sát/câu hỏi/kết quả |
| Tin tức | Xem/bình luận | Xem/bình luận | CRUD tin/kiểm duyệt bình luận |
| Thông báo | Xem thông báo | Xem thông báo | Tạo/gửi/lịch sử gửi |
| Cuộc thi | Tham gia/xem kết quả | Tham gia/xem kết quả | CRUD cuộc thi/câu hỏi/kết quả |
| Cuộc họp | Xác nhận/xem kết luận | Tạo/gán người/xem kết quả | Quản lý phòng họp số |
| Nhóm cộng đồng | Xem/tham gia nếu cần | Tạo/quản lý thành viên | Giám sát/quản trị |
| Thu | Xem nghĩa vụ đóng nếu mở | Tạo/cập nhật hộ đóng | Theo dõi toàn phường |
| Chi | Xem công khai nếu mở | Tạo/cập nhật chứng từ | Theo dõi toàn phường |
| DSS báo cáo | Không | Không | Nhập liệu, import Excel, dashboard |
| Tiện ích | Liên kết, phạt nguội, hotline, trợ lý | Như cư dân | Quản trị danh mục |

## 24. Checklist để dev bắt đầu

Trước khi implement từng module, cần chốt:

- Trường nào lấy từ ảnh form gốc, trường nào dùng theo đề xuất.
- Role nào được thêm/sửa/xóa/duyệt.
- Dữ liệu nào được xem theo phạm vi hộ, tổ dân phố, toàn phường.
- Có cần import/export Excel không.
- Có cần lưu lịch sử thay đổi không.
- Có cần file/ảnh đính kèm không.
- Có cần gửi thông báo Zalo/OA không.
- Có cần hiển thị trên Mini App hay chỉ Web Admin.

## 25. Ưu tiên xây dựng đề xuất cho dev

Thứ tự nên làm:

1. Auth + user/role/permission.
2. Tổ dân phố + hộ dân + cư dân.
3. Workflow duyệt cư dân/hộ dân.
4. Phản ánh và xử lý phản ánh.
5. Văn bản, tin tức, thông báo.
6. Khảo sát.
7. Cuộc thi.
8. Cuộc họp.
9. Thu/chi.
10. DSS nhập liệu báo cáo và dashboard.
11. Phòng họp số.
12. Trợ lý ảo và tích hợp nâng cao.

## 26. Ghi chú còn cần xác nhận

Các thông tin sau cần đối chiếu thêm với ảnh giao diện gốc hoặc người dùng nghiệp vụ:

- Danh sách trường chính xác trong form đăng ký tài khoản.
- Danh sách trường chính xác trong form thông tin cư dân.
- Danh sách trường chính xác trong form hộ dân và gia đình văn hóa.
- Danh sách trường chính xác của form đợt thu/đợt chi.
- Danh sách chỉ tiêu chi tiết của từng mẫu báo cáo DSS.
- Quy tắc phân quyền tài liệu phòng họp số.
- Có cho cư dân sửa/xóa phản ánh sau khi đã tiếp nhận hay không.
- Có cho làm lại khảo sát/cuộc thi nhiều lần hay chỉ một lần.
- Có công khai thu/chi cho cư dân xem không, hay chỉ tổ trưởng/cán bộ.
