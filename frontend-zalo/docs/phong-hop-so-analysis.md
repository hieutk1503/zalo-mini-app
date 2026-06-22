# Phân tích module Phòng họp số (Digital Meeting Room)

Nguồn: `egov-dss-ui-admin-functional-spec.md` §21, `egov-dss-system-analysis.md` §5.19.
Bề mặt: **Web Admin/DSS** (cán bộ phường), KHÔNG đưa vào Mini App cư dân.

## 1. Mục tiêu & phân biệt

Phòng họp số phục vụ **họp không giấy** của Đảng ủy / UBND / MTTQ: quản lý nhân sự
dự họp, cuộc họp, tài liệu (thư mục + PDF) có phân quyền, gán đại biểu, gán nội dung
(agenda), biểu quyết và xem kết quả, kết luận họp.

Phân biệt với module **Cuộc họp khu phố** (`/meetings` trên Mini App, bảng
`meetings`): đó là họp tổ dân phố do tổ trưởng tạo, cư dân xác nhận tham gia. Phòng
họp số là nghiệp vụ điều hành cấp phường trên web → dùng bảng **riêng** `room_*`.

## 2. Vai trò (RBAC)

- **Cán bộ phòng họp số** (`meeting_clerk`): quản lý toàn bộ phòng họp số (nhân sự,
  cuộc họp, tài liệu, biểu quyết, đại biểu).
- **Quản trị hệ thống** (`super_admin`): toàn quyền.
- Lãnh đạo/đại biểu: xem cuộc họp/tài liệu được phân quyền, tham gia biểu quyết
  (giai đoạn sau, cần đăng nhập đại biểu — ngoài phạm vi admin hiện tại).

## 3. Thực thể & trường (data model)

Lưu dạng `(id, data jsonb)` như các bảng nội dung khác.

### 3.1. `room_personnel` — Nhân sự họp
`{ id, name*, unit (đơn vị), position (chức vụ), phone, email, defaultRole
(chair/secretary/delegate/guest), note, status (active/inactive) }`

### 3.2. `room_meetings` — Cuộc họp Đảng ủy/UBND/MTTQ
`{ id, title*, type* (party=Đảng ủy / ubnd=UBND / mttq=MTTQ), time (datetime),
location, chair (chủ trì), secretary (thư ký), summary (nội dung tóm tắt),
status (scheduled/ongoing/finished/cancelled), conclusion (kết luận),
participants:[{id, personId?, name, unit, position, role, confirmStatus}],
agenda:[{id, title, desc, owner, durationMinutes, order}] }`
- `participants` (gán đại biểu) và `agenda` (gán nội dung) nhúng trong cuộc họp.

### 3.3. `room_documents` — Tài liệu họp (thư mục + tệp)
`{ id, type* (folder/file), name*, parentId (thư mục cha; null=gốc), order,
meetingId?, fileUrl (PDF, dùng /uploads), description,
viewScope (all / role list / person list — phân quyền xem) }`
- Cây thư mục cha–con bằng `parentId`. Tệp PDF gắn `fileUrl` (upload qua `/uploads`).

### 3.4. `room_votes` — Biểu quyết
`{ id, meetingId*, title*, content, openTime, closeTime, method (open/secret),
scope (đối tượng được biểu quyết), status (open/closed),
options:[{id, label, count}] }`
- Kết quả = tổng phiếu, tỷ lệ từng phương án (tính từ `options[].count`).

## 4. API đề xuất (admin, gate theo quyền phòng họp số)

CRUD generic (đã có hạ tầng RESOURCE_TABLE):
- `/admin/roomPersonnel`, `/admin/roomMeetings`, `/admin/roomDocuments`,
  `/admin/roomVotes` (GET/POST/PUT/DELETE).

Nghiệp vụ riêng (đợt 2):
- `POST /admin/room-meetings/:id/participants` — gán đại biểu.
- `POST /admin/room-meetings/:id/agenda` — gán nội dung họp.
- `POST /admin/room-documents/:id/permissions` — phân quyền tài liệu.
- `POST /admin/room-votes/:id/cast` — ghi nhận một phiếu (tăng count phương án).
- `GET /admin/room-votes/:id/results` — tổng hợp kết quả (tổng, tỷ lệ).

## 5. Luồng nghiệp vụ

1. Khai báo **nhân sự họp** (danh bạ đại biểu).
2. Tạo **cuộc họp** (loại, thời gian, chủ trì, thư ký).
3. **Gán đại biểu** vào cuộc họp + vai trò trong họp.
4. Tạo **thư mục** + upload **tài liệu PDF**; **phân quyền** tài liệu theo vai trò.
5. **Gán nội dung họp** (agenda) theo thứ tự.
6. Tạo **biểu quyết**; đại biểu biểu quyết → **xem kết quả** theo thời gian thực.
7. Ghi **kết luận** cuộc họp; lưu trữ tra cứu.

## 6. Chia đợt triển khai

- **Đợt 1 (đang làm)**: cấu trúc lõi — `room_personnel`, `room_meetings`,
  `room_documents` (CRUD trong Admin CMS), vai trò `meeting_clerk`, seed mẫu.
- **Đợt 2**: `room_votes` + ghi phiếu + tổng hợp kết quả; gán đại biểu; gán agenda;
  phân quyền tài liệu (UI chuyên biệt trong Admin).
- **Đợt 3 (ĐÃ XONG)**: cổng đại biểu (`api/src/public-portal.js` + `api/public/portal.html`).
  Đăng nhập **OTP qua Zalo** (kênh gửi Zalo OA = TODO, cần `ZALO_OA_TOKEN`; DEV trả OTP
  để thử nghiệm, production không lộ). Đại biểu xem cuộc họp được gán, tài liệu được
  phân quyền (`viewScope`), xác nhận dự họp, biểu quyết (chống bỏ phiếu trùng qua bảng
  `room_vote_ballots`), xem kết quả thời gian thực, **ký xác nhận (mô phỏng**: lưu hash
  nội dung — TODO tích hợp PKI/CA thật như VGCA), và lịch sử biểu quyết.
  Endpoint: `POST /portal/auth/request-otp|verify-otp`, `GET /portal/me|meetings|
  meetings/:id|votes/:id/result|history`, `POST /portal/meetings/:id/confirm`,
  `POST /portal/votes/:id/cast|sign`. Token phiên `kind:"delegate"` tách biệt token cán bộ.

## 7. Ràng buộc

- Tài liệu họp có thể **mật** → bắt buộc phân quyền xem (đợt 2); mặc định `viewScope`
  giới hạn theo vai trò.
- Upload PDF dùng endpoint `/uploads` (đã có, giới hạn type/size).
- Không trộn với bảng `meetings` của Mini App.
