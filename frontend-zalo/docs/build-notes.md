# Ghi chú triển khai – Đợt build mở rộng

Tài liệu này tóm tắt những phần đã được xây dựng dựa trên `requirements-analysis.md`
và `implementation-plan.md`, theo cách chia nhỏ từng phần.

## Đã hoàn thành

### Phần 1 – Nền tảng (P0)
- Thêm `.env.example`, điền `.env.development` (mock) và `.env.production` (API thật)
  với biến mới `VITE_USE_MOCK`, `VITE_DEV_TOKEN`.
- `src/service/zalo.ts`: bỏ token giả `"ACCESS_TOKEN"`, chỉ dùng `VITE_DEV_TOKEN`
  cho dev và **ném lỗi** nếu không lấy được token (an toàn cho production).
- `src/service/request.ts`: bật lại retry 1 lần sau khi refresh token.
- `src/service/index.ts`: **service adapter** chọn mock/real theo `VITE_USE_MOCK`.

### Phần 2 – Data model & dữ liệu mẫu tiếng Việt
- Mở rộng `src/types/index.ts`: `Procedure`, `PublicDocument`, `Hotline`,
  `OfficeLocation`, `WorkScheduleEvent`, `Survey`… Bổ sung `citizenId`,
  `appointmentTime`, `code` cho lịch hẹn; `code`, `status` cho phản ánh.
- `src/constants/common.ts`: thêm endpoint API, `ROUTES`, khung giờ hẹn.
- `src/mock/egov.json`: dữ liệu dịch vụ công tiếng Việt thực tế (8 thủ tục,
  văn bản/nghị quyết/mẫu đơn, đường dây nóng, trụ sở, lịch công tác, khảo sát).

### Phần 3 – Service & store
- `src/service/egov.services.mock.ts` và `egov.services.ts` (mock + API thật).
- `src/store/egovSlice.ts` gom state các module mới; đăng ký trong `store/index.ts`.
- Chuyển 5 slice cũ (organization, feedback, schedule, profile, informationGuide)
  sang dùng adapter `@service` thay vì import trực tiếp `services.mock`.
- Tiện ích tìm kiếm có dấu/không dấu và validate CCCD trong `utils/string.ts`.

### Phần 4 – Màn hình module mới
- Thủ tục hành chính: `/procedures`, `/procedures/:id` (tìm kiếm, lọc lĩnh vực).
- Kho văn bản & mẫu đơn: `/documents`, `/documents/:id` (lọc theo loại, xem/tải).
- Đường dây nóng: `/hotlines` (nhóm số, bấm gọi).
- Bản đồ – trụ sở: `/location` (địa chỉ, chỉ đường, giờ làm việc).
- Lịch công tác: `/work-schedule` (nhóm theo ngày).
- Khảo sát hài lòng: `/survey` (rating/lựa chọn/text, màn hình cảm ơn).

### Phần 5 – Nâng cấp luồng cũ & điều hướng
- Form đặt lịch: thêm **CCCD** (validate 12 số) và **chọn khung giờ**.
- Thẻ kết quả lịch hẹn: hiển thị mã phiếu, CCCD, thời gian hẹn.
- `APP_UTINITIES`: bổ sung 6 module mới vào menu trang chủ.
- Đăng ký toàn bộ route mới trong `src/pages/index.tsx`.

### Phần 6 – Backend API (scaffold)
- `server/` Express tối thiểu, **dùng chung dữ liệu seed** với frontend.
- Đầy đủ endpoint cho các module (xem `server/README.md`).
- Bao bì response khớp `request.ts`. Bật `VITE_USE_MOCK=false` để dùng API thật.

### Phần 8 – Chatbot AI dịch vụ công (native chat UI)
- Trang `/chatbot`: giao diện chat (bong bóng tin nhắn, gợi ý nhanh, ô nhập).
- Trả lời dựa trên kho **thủ tục hành chính** + **hỏi đáp (FAQ)**, tìm theo
  từ khoá không phân biệt dấu; có **fallback** gợi ý tra cứu thủ tục / đường dây nóng.
- Gợi ý có thể là điều hướng (mở thủ tục, gọi điện) hoặc câu hỏi nhanh.
- Backend: `POST /chatbot/sessions`, `POST /chatbot/messages`.

### Phần 11 – Quy hoạch / Dự án đầu tư / Đấu thầu
- `/planning`: danh sách tài liệu quy hoạch (dùng lại kho văn bản, lọc loại `planning`).
- `/projects`, `/projects/:id`: dự án đầu tư công (tìm kiếm, thanh tiến độ, trạng thái).
- `/biddings`, `/biddings/:id`: thông tin đấu thầu (trạng thái, link mua sắm công).
- Thêm types `Project`/`Bidding`, mock data tiếng Việt, service mock+real, store, menu.
- Backend: `/projects_api(/:id)`, `/biddings_api(/:id)` (lọc theo `keyword`).

### Phần 13 – Kiểm thử tự động (Vitest)
- Thêm `vitest.config.ts` + script `npm test`.
- Test: validate CCCD/SĐT, bỏ dấu & khớp từ khoá, lọc thủ tục/văn bản/dự án/gói thầu,
  và logic chatbot (khớp thủ tục + fallback).

### Phần 15–17 – Admin CMS + phân quyền (RBAC) + nhật ký
- `server/src/store.js`: kho dữ liệu in-memory dùng chung — cán bộ sửa là Mini App cập nhật ngay.
- `server/src/auth.js`: 5 tài khoản cán bộ mẫu, đăng nhập + token, phân quyền theo vai trò.
- `server/src/admin.js`: `/admin/login`, `/admin/me`, CRUD nội dung, duyệt/từ chối lịch hẹn,
  trả lời phản ánh, nhật ký thao tác.
- `server/public/admin.html`: giao diện quản trị (đăng nhập, sidebar theo quyền, bảng dữ liệu,
  form thêm/sửa, duyệt lịch hẹn, trả lời phản ánh, xem nhật ký). Mở tại `/admin.html`.

### Phần 18–19 – Lưu trữ bền vững + củng cố bảo mật
- `server/src/persistence.js`: tự lưu dữ liệu ra `server/data/store.json` và nạp lại khi
  khởi động — thay đổi của admin/người dân **sống sót qua restart**.
- `server/src/auth.js`: mật khẩu băm scrypt + salt (`timingSafeEqual`), token phiên hết hạn 8 giờ.
- `server/src/security.js`: rate limit theo IP + validate input phía backend (SĐT/CCCD/bắt buộc).
- Áp dụng rate limit cho login/feedback/đặt lịch/chatbot/khảo sát; validate cho đặt lịch & phản ánh.

### Phần 21–24 – Chuyển backend sang PostgreSQL + API bài bản
- Kiến trúc phân lớp: `config / db (pool) / migrate / repo / auth / security / util /
  public / admin / index` (xem `server/README.md`).
- **PostgreSQL** qua `pg`: truy vấn **tham số hoá** (chống SQL injection), có transaction;
  schema migrate + seed dữ liệu tiếng Việt; auto-migrate + seed khi DB trống.
- Auth DB-backed: mật khẩu **scrypt + salt** trong bảng `admin_users`, token ký
  **HMAC-SHA256** có hạn; RBAC + audit log ghi vào DB.
- `docker-compose.yml` (Postgres 16) + `.env.example` để chạy local dễ dàng.
- `npm run test:db`: kiểm thử toàn bộ API trên **pg-mem** (Postgres in-memory).

### Phần 25–27 – Tách project API + Docker hoá
- Tách thành **2 project độc lập**: `mna-zaui-egov-sample/` (Mini App) và `api/`
  (backend, tự chứa dữ liệu seed trong `api/seed-data/`, không phụ thuộc mini app).
- **Docker**: `api/Dockerfile` + `api/docker-compose.yml` dựng **PostgreSQL + API**;
  chỉ cần `docker compose up -d --build` là có DB và API chạy, tự migrate + seed.
- README gốc (`/README.md`) mô tả cấu trúc 2 project và cách chạy từng phần.

### Đợt mở rộng eGov DSS / Resident Group – Nền tảng + Cư dân/Hộ dân/Duyệt

Theo `docs/egov-dss-build-plan.md` (đọc kèm `egov-dss-system-analysis.md`,
`egov-dss-ui-admin-functional-spec.md`, `egov-dss-ui-design-system.md`).

Nền tảng:
- `tailwind.config.js`: **thêm** token trạng thái/surface/border theo design system
  (`success/warning/danger/info/forwarded/primary_50/primary_700/surface/border`);
  giữ nguyên token cũ.
- `src/constants/status.ts`: `STATUS_META` (nhãn + màu hex) cho trạng thái nghiệp vụ.
- Component dùng chung mới (`src/components/common`): `StatusBadge`, `SectionCard`,
  `EmptyState`, `FilterBar`, `StatusTabs`, `DataList`, `SummaryCards` (+ export).
- Icon mới: `ResidentsIcon`, `HouseholdIcon`, `ApprovalIcon`.
- `src/utils/string.ts`: `maskCitizenId`, `maskPhoneNumber` (che CCCD/SĐT).

Dữ liệu & service (tách mock/real qua adapter `@service`):
- `src/types/index.ts`: thêm `Resident`, `Household`, `HouseholdMember`,
  `ApprovalRequest`, `ApprovalStatus`, `Gender`, `ResidenceType`, `HouseholdType`…
- `src/constants/resident-group.ts`: danh mục tổ dân phố/giới tính/loại cư trú/
  loại hộ/quan hệ chủ hộ (cấu hình MẪU).
- `src/mock/resident-group.json`: **dữ liệu GIẢ** (6 cư dân, 3 hộ, 3 yêu cầu duyệt).
- `src/service/residentgroup.services.mock.ts` (in-memory, duyệt/từ chối/tạo sống
  trong phiên) + `residentgroup.services.ts` (API thật) + nối vào `service/index.ts`.
- `src/store/residentGroupSlice.ts`: state + action cư dân/hộ dân/duyệt; đăng ký
  trong `store/index.ts`.

Màn hình (mobile-first, có loading/empty/error, badge trạng thái, validation):
- Cư dân: `/residents`, `/residents/create`, `/residents/:id`, `/residents/:id/edit`.
- Hộ dân: `/households`, `/households/create`, `/households/:id` (tab thành viên +
  thêm thành viên inline), `/households/:id/edit`.
- Duyệt: `/approval/residents`, `/approval/households`, `/approval/detail/:id`
  (phê duyệt / từ chối kèm lý do).
- `APP_UTINITIES`: thêm 4 mục (Cư dân, Hộ dân, Duyệt cư dân, Duyệt hộ dân).
- Route mới đăng ký trong `src/pages/index.tsx`, **không xoá route cũ**.

TODO còn lại (đợt sau):
- P0 còn lại: Phản ánh nâng cao (workflow), Thông báo nhanh.
- Import/Export Excel cư dân/hộ dân (Web Admin).
- Phân quyền theo vai trò (cư dân/tổ trưởng) cho nút thêm/sửa/duyệt và quy tắc
  mask CCCD/SĐT — cần chốt nghiệp vụ.
- Tab Kỷ luật / Tiền án–tiền sự của cư dân; gia đình văn hóa (form thêm).
- Phân trang phía server cho danh sách lớn (hiện lọc client trên tập đã tải).

### Đợt mở rộng eGov DSS – Phản ánh nâng cao + Thông báo nhanh (P0 còn lại)

Phản ánh nâng cao (surface xử lý cho tổ trưởng/cán bộ, KHÔNG đụng luồng `/feedbacks`):
- Types `Reflection`, `ReflectionLog`, `ReflectionStatus` (pending/processing/forwarded/
  completed/rejected — khớp WorkflowStatus để dùng chung màu badge).
- `src/constants/reflection.ts`: `FORWARD_UNITS`, `REFLECTION_TYPES`,
  `REFLECTION_STATUS_LABEL`, `NOTIFICATION_LEVEL_META`.
- `src/mock/reflections.json`: 5 phản ánh (đủ trạng thái) + 5 thông báo (dữ liệu giả).
- `src/service/community.services{,.mock}.ts` (+ nối adapter `@service`):
  `getReflections/Detail`, `receive/forward/complete`; `getNotifications/Detail`,
  `markNotificationRead`. Mock in-memory (thao tác sống trong phiên).
- `src/store/communitySlice.ts` (đăng ký trong `store/index.ts`).
- Màn hình: `/reflections` (tabs Chờ xử lý/Đang xử lý/Chuyển tiếp/Đã xử lý),
  `/reflections/:id` (thông tin + nội dung + **lịch sử xử lý timeline** + hành động
  Tiếp nhận/Chuyển tiếp (chọn đơn vị)/Hoàn thành (nhập nội dung)). Icon `ReflectionIcon`.

Thông báo nhanh:
- Types `QuickNotification`, `NotificationLevel` (normal/important/urgent).
- Màn hình: `/notifications` (tabs mức độ, badge mức độ, đánh dấu đã đọc/chưa đọc),
  `/notifications/:id` (xem chi tiết, tự đánh dấu đã đọc). Dùng lại `Icon.NotificationIcon`.

Menu trang chủ: thêm "Xử lý phản ánh", "Thông báo".

Trạng thái P0: **đã đủ** Cư dân, Hộ dân, Duyệt, Phản ánh nâng cao, Thông báo nhanh.
Văn bản/tài liệu và Tin tức đã có sẵn từ đợt trước (có thể nâng cấp thêm bình luận/CRUD
admin nếu cần).

### Đợt P1 (1) – Cuộc họp & Nhóm cộng đồng

Nền dữ liệu chung:
- Types `Meeting`, `MeetingParticipant`, `CommunityGroup`, `CommunityGroupMember`
  (+ `MeetingStatus`, `ConfirmStatus`, `GroupStatus`).
- `src/constants/neighborhood.ts`: `MEETING_STATUS_META`, `CONFIRM_STATUS_META`,
  `GROUP_STATUS_META`, `GROUP_TOPICS`.
- `src/mock/neighborhood.json`: 3 cuộc họp + 3 nhóm (dữ liệu giả).
- `src/service/neighborhood.services{,.mock}.ts` (+ adapter); `neighborhoodSlice`
  (đăng ký trong `store/index.ts`).
- Component dùng chung mới: `MetaBadge` (badge theo meta {label,color,bg} cho các
  trạng thái ngoài WorkflowStatus). Icon `MeetingIcon`, `GroupIcon`.

Cuộc họp:
- `/meetings` (tabs Sắp diễn ra/Đã kết thúc/Tất cả, badge trạng thái, giờ + địa điểm).
- `/meetings/create` (tên, nội dung, ngày dd/mm/yyyy + giờ HH:mm, địa điểm, chủ trì,
  tổ dân phố, ghi chú — có validation).
- `/meetings/:id` (thông tin + nội dung + **thành phần tham dự** kèm trạng thái xác
  nhận + tài liệu + **kết luận** khi đã kết thúc + **Xác nhận/Từ chối tham gia**).

Nhóm cộng đồng:
- `/community-groups` (tabs trạng thái, chủ đề, số thành viên).
- `/community-groups/create` (tên, chủ đề, trạng thái, mô tả).
- `/community-groups/:id` (thông tin + **thành viên**: thêm inline / xóa).

Menu trang chủ: thêm "Cuộc họp", "Nhóm cộng đồng".

TODO: gán thành phần tham dự / thành viên nhóm trực tiếp từ danh sách cư dân đã duyệt
(vai trò tổ trưởng); P1 còn lại: Khảo sát (quản lý + tham gia), Cuộc thi, Quản lý thu,
Quản lý chi, Tiện ích/liên kết.

### Đợt P1 (2) – Khảo sát & Cuộc thi

Nền engagement:
- Types `SurveyCampaign`/`SurveyResult`, `Contest`/`ContestQuestion`/`ContestResult`/
  `ContestRankingEntry`; mở rộng `SurveyQuestionType` thêm `multiple_choice`; nới
  `SurveyAnswer.value` cho phép `string[]` (an toàn với khảo sát hài lòng cũ).
- `src/constants/engagement.ts`: `SURVEY_STATUS_META`, `CONTEST_STATUS_META`.
- `src/mock/engagement.json`: 2 khảo sát + 2 cuộc thi + bảng xếp hạng (dữ liệu giả).
- `src/service/engagement.services{,.mock}.ts` (+ adapter). **Tên hàm tách biệt**
  với khảo sát hài lòng: `getSurveyCampaigns/Detail/Results`, `submitSurveyCampaign`,
  `getContests/Detail`, `submitContest`, `getContestRanking`. Mock tự chấm điểm cuộc
  thi (so khớp đáp án đúng) và tổng hợp kết quả khảo sát mô phỏng.
- `src/store/engagementSlice.ts` (state đặt tên riêng để không đụng `submittingSurvey`
  của egovSlice); đăng ký trong `store/index.ts`.
- Icon `SurveyIcon`, `ContestIcon`.

Khảo sát:
- `/surveys` (tabs Đang mở/Đã đóng, nhãn "Đã tham gia").
- `/surveys/:id` (làm khảo sát: single/multiple/rating/text + validation bắt buộc;
  gửi xong xem **kết quả tổng hợp** dạng thanh % nếu cho phép, hoặc màn cảm ơn).

Cuộc thi:
- `/contests` (tabs Đang mở/Sắp diễn ra/Đã đóng).
- `/contests/:id` (làm bài trắc nghiệm single/multiple → **chấm điểm**: điểm, số câu
  đúng, xếp hạng + **bảng xếp hạng**).

Menu trang chủ: thêm "Khảo sát", "Cuộc thi".

Lưu ý: builder tạo/sửa khảo sát & cuộc thi (thêm/sửa câu hỏi) thuộc Web Admin — để
TODO; Mini App tập trung luồng tham gia + xem kết quả.

### Đợt P1 (3) – Quản lý thu & Quản lý chi

Nền tài chính:
- Types `IncomeCampaign`/`HouseholdPayment`, `ExpenseRecord` (+ statuses).
- `src/constants/finance.ts`: `INCOME_STATUS_META`, `PAYMENT_STATUS_META`,
  `EXPENSE_STATUS_META`, `FEE_TYPES`, `FUND_SOURCES`, `formatVnd`.
- `src/mock/finance.json`: 2 đợt thu (kèm danh sách hộ + trạng thái đóng) + 3 khoản
  chi (dữ liệu giả).
- `src/service/finance.services{,.mock}.ts` (+ adapter). Mock tự tính tổng đã thu,
  số hộ đã đóng; cập nhật trạng thái đóng theo hộ. `financeSlice` (đăng ký store).
- Icon `IncomeIcon`, `ExpenseIcon`.

Quản lý thu:
- `/income` (KPI **tổng đã thu**, tabs trạng thái, mỗi đợt hiển thị đã đóng X/Y hộ).
- `/income/:id` (tổng quan + **danh sách hộ** + **cập nhật trạng thái đóng**:
  Đã đóng/Đóng một phần (nhập số tiền)/Miễn giảm/Chưa đóng).
- `/income/create` (tên, loại khoản thu, tổ dân phố, mức/hộ, thời gian, mô tả).

Quản lý chi:
- `/expenses` (KPI **tổng đã chi**, danh sách khoản chi).
- `/expenses/:id` (thông tin + **chứng từ đính kèm**).
- `/expenses/create` (tên, mục đích, số tiền, ngày chi, nguồn quỹ, người chi, ghi chú).

Menu trang chủ: thêm "Quản lý thu", "Quản lý chi".

Service adapter `@service` hiện gộp 7 nhóm: core, egov, residentGroup, community,
neighborhood, engagement, finance.

TODO: gán danh sách hộ vào đợt thu tự động theo tổ dân phố; upload chứng từ thực tế
(hiện chỉ hiển thị danh sách tên file); báo cáo/xuất Excel thu-chi (Web Admin).

### Đợt P1 (4) – Tiện ích/Liên kết + tổ chức lại menu trang chủ

Tiện ích / Liên kết (service hub) — theo `requirements-analysis §6.14`:
- Type `ServiceLink`; mock `src/mock/service-links.json` (DVCQG, DVC tỉnh, VNeID,
  eTax, VssID, TTĐT, Fanpage, Zalo OA — nhóm theo `group`).
- `getServiceLinks` thêm vào **egov service** (mock+real) và **egovSlice** (không
  tạo slice mới).
- Trang `/service-hub`: nhóm liên kết theo `group`, mở bằng Zalo webview
  (`openWebView`), có loading/empty. Icon `ServiceHubIcon`.
- Lưu ý: ưu tiên deep link app + fallback store là TODO; hiện mở web fallback.

Tổ chức lại menu trang chủ (gọn hơn, đỡ dồn 1 lưới dài):
- Tách `APP_UTINITIES` (Dịch vụ công) và `RESIDENT_GROUP_UTINITIES` (Quản lý khu phố).
- `HomePage` hiển thị 2 section có tiêu đề: "Dịch vụ công" và "Quản lý khu phố".
- Thêm mục "Tiện ích - Liên kết" vào nhóm Dịch vụ công.

## Tổng kết phạm vi

- **P0**: HOÀN THÀNH — Cư dân, Hộ dân, Duyệt, Phản ánh nâng cao, Thông báo nhanh
  (Văn bản & Tin tức có sẵn từ trước).
- **P1**: HOÀN THÀNH — Cuộc họp, Nhóm cộng đồng, Khảo sát, Cuộc thi, Quản lý thu,
  Quản lý chi, Tiện ích/Liên kết (Hotline/Bản đồ/Lịch công tác có sẵn).
- **P2 (thiên Web Admin/DSS)**: CHƯA LÀM — DSS dashboard, nhập liệu báo cáo, phòng
  họp số. Với Mini App nên làm bản xem rút gọn / trang TODO, không ép web admin vào app.

Service adapter `@service` gộp 7 nhóm; mỗi module đều có mock (dữ liệu giả) + real
stub tách sạch để chuyển API thật qua `VITE_USE_MOCK=false`.

### Đợt P2 (rút gọn) – Dashboard tổng quan + trang TODO Web Admin

Dashboard rút gọn (read-only) cho Mini App — hiện thực hóa "Trang chủ thông minh"
(`requirements-analysis §6.15`), KHÔNG nhồi web DSS đầy đủ vào app:
- Trang `/dashboard` (Tổng quan khu phố): tổng hợp **chỉ để xem** từ các module đã
  có — tổng cư dân/hộ + số chờ duyệt (`SummaryCards`), phản ánh theo trạng thái,
  tổng thu/tổng chi, hoạt động đang mở (khảo sát/cuộc thi/cuộc họp).
- Tính toán trực tiếp trong page từ store (gọi lại các getter sẵn có), reuse
  `SummaryCards`/`SectionCard`/`MetaBadge`, không thêm thư viện chart.
- Icon `DashboardIcon`; thêm mục "Tổng quan" đứng đầu nhóm "Quản lý khu phố".

Trang TODO cho phần Web Admin/DSS (không ép vào Mini App):
- `/report-entry` (Nhập liệu báo cáo DSS) và `/meeting-room` (Phòng họp số):
  placeholder giải thích thuộc Web DSS + đánh dấu TODO liên kết web khi có hệ thống
  thật. Liên kết từ section "Phân hệ DSS" trong dashboard.

Đến đây: P0 + P1 hoàn thành; P2 có **bản xem rút gọn** trên Mini App + placeholder
định hướng cho phần web quản trị.

### Rà soát typecheck + Module Tin tức (chi tiết + bình luận)

Rà soát typecheck:
- Không chạy được `tsc` trong sandbox (node_modules thiếu/cắt cụt, không có mạng).
- Đã rà tĩnh chéo toàn bộ file mới: api↔mock service, trùng key state giữa các slice,
  import của page (@components/@components/common/@constants/@dts/icons), constants,
  type @dts. **Không phát hiện lỗi TS cụ thể.** Vẫn cần chạy `npx tsc --noEmit` trên máy.

Tin tức nội bộ (chi tiết + bình luận) — không đụng tin liên kết ngoài ở trang chủ:
- Types `NewsArticle`, `NewsComment`; mock `src/mock/news.json` (4 tin + 3 bình luận).
- `news.services{,.mock}.ts` (+ adapter, nâng `@service` lên 8 nhóm); `newsSlice`
  (list/detail/comments/post; bình luận mới sống trong phiên). Tên tách biệt với
  `articles/getArticles` (tin ngoài) hiện có.
- Trang `/news` (danh sách + lọc chuyên mục + tìm kiếm) và `/news/:id` (nội dung +
  **danh sách bình luận** + **ô gửi bình luận**; tôn trọng cờ `allowComment`).
- Icon `NewsIcon`; thêm menu "Tin tức"; `NewsSection` trang chủ thêm "Xem tất cả" → `/news`.

### Backend API thật + Admin CMS cho Cư dân/Hộ dân/Duyệt (đợt 1)

Mở rộng backend `api/` (Express + PostgreSQL, jsonb + RBAC) cho phân hệ Resident Group:
- `migrate.js`: thêm bảng `residents`, `households`, `approval_requests`.
- `repo.js`: thêm `dataTable` + đăng ký `RESOURCE_TABLE` (residents/households) để
  Admin CMS có CRUD tự động.
- `auth.js`: thêm nhóm quyền `RESIDENT_RES`; `content_editor` (và `super_admin`)
  được quản lý cư dân/hộ dân/duyệt.
- `seed-data/resident-group.json` (tự chứa) + `seed.js` nạp residents/households/
  approval_requests.
- `src/public-egov.js` (mount trong `index.js`): public API **khớp** frontend
  `residentgroup.services.ts` — `GET/POST/PATCH /residents` (+ `/submit-approval`,
  `/approve`, `/reject`), `GET/POST/PATCH /households` (+ `/members`, `/approve`,
  `/reject`), `GET /approval-requests` (+ `/approve`, `/reject` cập nhật luôn bản ghi
  gốc), `GET /neighborhood-groups`. Bao response `{err,message,data}` đúng `request.ts`.
- `public/admin.html`: thêm mục **Cư dân**, **Hộ dân** (bảng + form + badge trạng thái).

Cách chạy API thật end-to-end:
1. `cd api && docker compose up -d --build` (hoặc `npm install && npm start` với
   PostgreSQL) → API tại `http://localhost:8090`, Admin tại `/admin.html`
   (`admin/admin123`). Tự migrate + seed.
2. Frontend: đặt `VITE_USE_MOCK=false` và `VITE_BASE_URL=http://localhost:8090`
   trong `.env.development` (mặc định vẫn để `true` để chạy demo offline).
3. Module Cư dân/Hộ dân/Duyệt trên Mini App sẽ gọi API thật; cán bộ quản lý dữ liệu
   qua Admin CMS.

Lưu ý: sandbox không có PostgreSQL/Node modules nên **chưa chạy được**; hợp đồng API
đã mirror đúng logic mock. Cần chạy `docker compose up` / `npm run test:db` trên máy
để xác nhận.

Roadmap còn lại (đợt sau):
- Backend thật + Admin cho các domain còn lại: phản ánh (workflow), thông báo, cuộc
  họp, nhóm cộng đồng, khảo sát, cuộc thi, thu/chi, tin tức+bình luận, service-links.
- Web DSS thật: dashboard theo khối, nhập liệu báo cáo, phòng họp số.
- Nâng cao: upload file thật (ảnh/chứng từ/tài liệu) + giới hạn type/size; deep link
  service hub; vai trò riêng cho tổ trưởng/cán bộ phường (RBAC theo địa bàn); xác thực
  token Zalo cho API public; kiểm duyệt bình luận tin tức.

### Backend API thật + Admin CMS đợt 2: Phản ánh + Thông báo + Tin tức nội bộ

- Schema: thêm bảng `reflections`, `quick_notifications`, `news_articles`,
  `news_comments` (`migrate.js`); `repo.js` thêm dataTable + RESOURCE_TABLE
  (reflections, quickNotifications, newsArticles cho Admin CRUD).
- RBAC (`auth.js`): `content_editor` quản lý thông báo/tin tức nội bộ + xem phản ánh;
  `feedback_officer` xử lý phản ánh.
- Seed tự chứa: `seed-data/community.json` (5 phản ánh + 5 thông báo + 4 tin + 3 bình
  luận) nạp trong `seed.js`.
- `src/public-community.js` (mount `index.js`) khớp `community.services.ts` &
  `news.services.ts`: `/reflections` (+receive/forward/complete, ghi log + đổi trạng
  thái), `/notifications` (+read), `/news` (+/:id, `/comments` GET+POST, tăng
  commentCount).
- `public/admin.html`: thêm mục **Phản ánh (xử lý)**, **Thông báo nhanh**, **Tin tức
  nội bộ**; thêm tag trạng thái `forwarded`.

Tiến độ tổng thể: xem `docs/progress.md`.

### Backend API thật + Admin CMS đợt 3: Cuộc họp + Nhóm cộng đồng + Thu + Chi

- Schema: thêm bảng `meetings`, `community_groups`, `income_campaigns`, `expenses`
  (`migrate.js`); `repo.js` thêm dataTable + RESOURCE_TABLE (cả 4 cho Admin CRUD).
- RBAC (`auth.js`): nhóm `KHU_PHO_RES` cấp cho `content_editor` (+ `super_admin`).
- Seed tự chứa `seed-data/khupho.json` (3 họp + 3 nhóm + 2 đợt thu + 3 khoản chi).
- `src/public-khupho.js` (mount `index.js`) khớp `neighborhood.services.ts` &
  `finance.services.ts`: `/meetings` (+confirm/reject), `/community-groups`
  (+members add/remove, PATCH), `/income-campaigns` (+payment-status tính lại tổng
  thu/số hộ đã đóng), `/expenses`.
- `public/admin.html`: thêm mục **Cuộc họp**, **Nhóm cộng đồng**, **Quản lý thu**,
  **Quản lý chi** + tag trạng thái scheduled/finished/recorded/inactive.

Hiện đã có **11/13 domain** API thật. Còn: Khảo sát (campaign), Cuộc thi, Service-links.
Chi tiết: `docs/progress.md`.

### Backend API thật + Admin CMS đợt 4 (đóng public API): Khảo sát + Cuộc thi + Service-links

- Schema: `survey_campaigns`, `contests`, `service_links` (`migrate.js`); repo +
  RESOURCE_TABLE (cả 3 cho Admin CRUD); RBAC nhóm `ENGAGEMENT_RES` cho content_editor.
- Seed tự chứa `seed-data/engagement.json` (2 khảo sát + 2 cuộc thi kèm bảng xếp hạng
  + 8 liên kết).
- `src/public-engagement.js` (mount `index.js`) khớp `engagement.services.ts` &
  `egov.services.ts(getServiceLinks)`: `/surveys` (+/:id, `/submit` tổng hợp kết quả,
  `/results`), `/contests` (+/:id, `/submit` chấm điểm + xếp hạng, `/ranking`),
  `/service-links`.
- `public/admin.html`: thêm mục **Khảo sát (đợt)**, **Cuộc thi**, **Liên kết dịch vụ**
  + tag `upcoming`.

**→ Public API + Admin CRUD đã đủ 13/13 domain** (8 file route: public, public-egov,
public-community, public-khupho, public-engagement). Còn lại: Web DSS thật + các mục
nâng cao (xem `docs/progress.md`).

### Nâng cao đợt 1: kiểm duyệt bình luận + vai trò Cán bộ khu phố

- `admin.js`: `/admin/news-comments` (GET list kèm tiêu đề bài), `/:id/hide`,
  `/:id/unhide`, DELETE — gate theo quyền `newsArticles`, có ghi audit log.
- `auth.js`: thêm role `ward_officer` (Cán bộ khu phố) quản lý địa bàn + cộng đồng +
  khu phố + tương tác + phản ánh; `seed.js` thêm tài khoản `khupho/123456`;
  `admin.js` ROLES + `admin.html` ROLE_VN/role-select.
- `admin.html`: mục **Bình luận tin** (type `comments`: Ẩn/Hiện/Xoá), hỗ trợ
  `permKey` để section dùng quyền của resource khác (bình luận gate theo `newsArticles`).
- Frontend đã sẵn lọc bình luận `hidden` (getNewsComments) nên ẩn ở Admin là ẩn trên app.

### Nâng cao đợt 2: upload file + tổng hợp khảo sát thật

Upload file (không thư viện ngoài):
- `api/src/upload.js`: `POST /uploads` nhận `{filename, contentType, contentBase64}`,
  validate loại (JPG/PNG/WEBP/PDF) + dung lượng ≤5MB, lưu `api/uploads/` và phục vụ
  tĩnh tại `/uploads/<file>`; rate limit 20 req/phút. `index.js` nâng JSON limit lên
  10mb + mount; `.gitignore` thêm `uploads/`, `data/`.
- FE: `api.uploadFile` (mock trả URL giả; real POST /uploads) + type `UploadResult` +
  `API.UPLOADS`. Form hiện vẫn dùng Zalo media picker — nối `uploadFile` là bước sau.

Tổng hợp khảo sát từ phản hồi thật:
- Bảng `survey_campaign_responses` + `surveyCampaignResponseRepo`; `/surveys/:id/submit`
  lưu answers rồi `aggregateSurvey` (đếm lựa chọn, trung bình rating, gom text);
  `/results` tổng hợp; **fallback** mô phỏng khi chưa có phản hồi (giữ demo đẹp).

### Web DSS đợt 1: Dashboard điều hành + Nhập liệu báo cáo (trong Admin CMS)

- `admin.js`: `GET /admin/dashboard` (requireAuth) tổng hợp realtime số liệu các khối:
  cư dân/hộ (tổng + theo trạng thái), phản ánh theo trạng thái, tổng thu/chi, lịch
  hẹn, cuộc họp, khảo sát/cuộc thi đang mở, tin đã đăng.
- `admin.html`: mục **"Tổng quan DSS"** (luôn hiển thị cho mọi cán bộ) — KPI cards +
  thanh tỷ lệ phản ánh theo trạng thái (không dùng thư viện chart). Hỗ trợ section
  `always` + type `dashboard`.
- Nhập liệu báo cáo theo kỳ: bảng `report_entries` + repo + RESOURCE_TABLE + RBAC
  (`REPORT_RES` cho content_editor); seed `seed-data/reports.json` (4 chỉ tiêu mẫu);
  mục Admin **"Nhập liệu báo cáo DSS"** (lĩnh vực/tên/kỳ/tần suất/đơn vị/giá trị/
  trạng thái). Import Excel: TODO.

→ Web DSS đã có dashboard điều hành + nhập liệu báo cáo thủ công ngay trong Admin CMS
hiện có (không dựng web riêng). Còn lại: import Excel báo cáo, phòng họp số.

### Phòng họp số đợt 1 (Web Admin): nhân sự + cuộc họp + tài liệu

Phân tích chi tiết: `docs/phong-hop-so-analysis.md` (thực thể, trường, API, RBAC,
luồng, chia 3 đợt).

- Schema: `room_personnel`, `room_meetings`, `room_documents`, `room_votes`
  (`migrate.js`); repo + RESOURCE_TABLE cả 4; RBAC nhóm `MEETING_ROOM_RES`.
- Vai trò mới `meeting_clerk` (Cán bộ phòng họp số) — `auth.js` ROLE_LABEL/ROLE_PERMS,
  `admin.js` ROLES, `admin.html` ROLE_VN/role-select; seed tài khoản `phonghop/123456`.
- Seed tự chứa `seed-data/meeting-room.json` (4 nhân sự, 2 cuộc họp kèm đại biểu+agenda,
  4 tài liệu/thư mục, 1 biểu quyết).
- `admin.html`: 3 mục **PHS · Nhân sự họp / PHS · Cuộc họp / PHS · Tài liệu họp**
  (cột + form + tag). Tài liệu PDF dùng `fileUrl` trỏ `/uploads`.

Đợt 2 phòng họp số (chưa làm): biểu quyết + ghi phiếu + tổng hợp kết quả; gán đại biểu;
gán nội dung họp (agenda); phân quyền tài liệu (UI chuyên biệt).

### Phòng họp số đợt 2a: Biểu quyết (kết quả + ghi phiếu)

- `admin.js`: `GET /admin/room-votes/:id/results` (tổng phiếu + tỷ lệ từng phương án),
  `POST /admin/room-votes/:id/cast` (ghi 1 phiếu cho phương án, chặn khi đã đóng) — gate
  `roomVotes`, ghi audit.
- `admin.html`: mục **"PHS · Biểu quyết"** (type `votes`): danh sách; **tạo** biểu quyết
  (tiêu đề/nội dung/cuộc họp/hình thức + phương án mỗi dòng → options); **modal kết quả**
  (thanh tỷ lệ + nút Ghi phiếu từng phương án); **Đóng** biểu quyết (PUT generic). Tạo/
  đóng/xoá tận dụng CRUD generic của `roomVotes`.

Đợt 2b (còn lại): gán đại biểu cuộc họp, gán nội dung họp (agenda), phân quyền tài liệu
(viewScope đã sửa được qua form; cần UI chọn vai trò/đại biểu chuyên biệt).

### Phòng họp số đợt 2b: gán đại biểu + nội dung họp + phân quyền tài liệu

- `admin.js`: `POST/DELETE /admin/room-meetings/:id/participants` (gán/xoá đại biểu),
  `POST/DELETE /admin/room-meetings/:id/agenda` (gán/xoá nội dung họp),
  `PATCH /admin/room-documents/:id/permissions` (đặt viewScope) — gate roomMeetings/
  roomDocuments + audit.
- `admin.html`: nút **"Đại biểu/Nội dung"** trên mỗi cuộc họp (PHS · Cuộc họp) mở modal
  quản lý: danh sách đại biểu (thêm họ tên + vai trò / xoá) và nội dung họp/agenda
  (thêm tiêu đề/phụ trách/thời lượng/thứ tự / xoá), cập nhật realtime.

→ **Phòng họp số hoàn thiện nghiệp vụ cốt lõi**: nhân sự, cuộc họp, tài liệu (thư mục+
PDF + phân quyền), gán đại biểu, agenda, biểu quyết + kết quả. Đợt 3 tùy chọn: cổng
đại biểu đăng nhập, ký số.

### Nâng cao đợt 3: nối upload file vào form Mini App

- `src/components/common/FileUpload.tsx`: chọn tệp (ảnh/PDF, ≤5MB) → đọc base64 →
  `api.uploadFile` → hiển thị danh sách tệp + xoá; báo lỗi type/size. Export qua
  `@components/common`.
- Nối vào **ExpenseFormPage** (chứng từ → `attachments`) và **MeetingFormPage**
  (tài liệu → `documents`); gửi kèm khi tạo. Mock trả URL giả; bật `VITE_USE_MOCK=false`
  để upload thật lên backend `/uploads`.
- Lưu ý: dùng `<input type="file">` (chạy tốt trên dev/web); với Mini App production có
  thể thay bằng Zalo media picker rồi vẫn gọi `api.uploadFile`.

### Nâng cao đợt 4: RBAC data-scope theo địa bàn (bảo mật dữ liệu §14)

- Schema: `admin_users` thêm cột `scope` (`migrate.js`, CREATE + ALTER IF NOT EXISTS,
  bọc try/catch cho pg-mem); `adminUserRepo` select/insert/update gồm `scope`.
- `auth.js`: login + token + requireAuth mang `scope`.
- `admin.js`: GET `/admin/:resource` lọc theo `neighborhoodGroup === scope` (mục không
  gắn địa bàn vẫn hiển thị); POST tự gán `neighborhoodGroup = scope` khi tạo mới;
  adminUsers create/update nhận `scope`.
- `seed.js`: tài khoản `khupho` (ward_officer) gắn scope "Tổ dân phố 1".
- `admin.html`: form tài khoản admin thêm trường "Phạm vi địa bàn"; cột "Địa bàn" trong
  danh sách; dòng tài khoản hiển thị địa bàn.
- Hiệu quả: cán bộ địa bàn (vd `khupho`) chỉ thấy/sửa cư dân, hộ dân, phản ánh, thu/chi,
  cuộc họp... thuộc tổ dân phố của mình; super_admin/biên tập (scope trống) thấy toàn phường.

### Web DSS đợt 2: import báo cáo hàng loạt (CSV/TSV)

- `admin.js`: `POST /admin/report-entries/import {csv}` — parser CSV/TSV không phụ thuộc
  thư viện (tự nhận Tab khi dán trực tiếp từ Excel), map tiêu đề cột tiếng Việt
  (Lĩnh vực/Tên báo cáo/Kỳ/Tần suất/Đơn vị/Giá trị/Ghi chú) → tạo nhiều `report_entries`
  (status submitted, updatedBy/updatedAt); gate reportEntries + audit.
- `admin.html`: nút **"Import"** ở mục Nhập liệu báo cáo DSS → modal dán CSV/Excel +
  hướng dẫn cột → gọi import → báo số dòng đã nhập.
- Web DSS đủ: dashboard điều hành + nhập liệu thủ công + import hàng loạt. Nâng cấp tùy
  chọn: đọc trực tiếp `.xlsx` bằng SheetJS (chỉ đổi parser).

### Đợt LK-1+2: Liên kết dữ liệu nội bộ + Hoạt động đại biểu

- **Nạp hộ vào đợt thu theo tổ dân phố**: `POST /admin/income-campaigns/:id/populate-households`
  — lấy hộ từ bảng `households` có `neighborhoodGroup` khớp đợt thu **và** `status==="approved"`,
  ghép vào `campaign.households` (mỗi hộ: `householdId`, `householdName`=headName,
  `amountDue`=amountPerHousehold, `status:"unpaid"`); **giữ nguyên** dòng đã có
  (đã đóng/miễn) và các dòng thủ công. Admin: nút **"Nạp hộ"** trên mỗi đợt thu.
- **Gán đại biểu phòng họp số từ danh bạ**: panel "Đại biểu/Nội dung" thêm ô **chọn từ
  danh bạ `room_personnel`** (auto-fill `personId`/đơn vị/vai trò mặc định) thay vì chỉ gõ tay.
- **Hoạt động đại biểu**: `GET /admin/room-meetings/:id/activity` — tổng hợp xác nhận dự
  họp (confirmed/pending/declined) + theo từng biểu quyết liệt kê đại biểu đã bỏ phiếu/đã
  ký (đọc `room_vote_ballots`). Admin: nút **"Hoạt động"** mở modal thống kê.
- Test +4 ca (populate-households + activity). **Chạy thực tế pg-mem: 90/90 PASS, 0 FAIL.**

### Đợt PHS-3: Cổng đại biểu Phòng họp số (delegate portal)

- Backend `api/src/public-portal.js` (mount trong `index.js`):
  - **Đăng nhập OTP qua Zalo**: `POST /portal/auth/request-otp` (tra `room_personnel`
    theo SĐT, sinh OTP 6 số, băm HMAC-SHA256 lưu bảng `delegate_otps` kèm hạn 5 phút +
    đếm số lần thử) và `POST /portal/auth/verify-otp` (so khớp timing-safe, cấp token
    phiên `kind:"delegate"`). Hàm `sendOtpViaZalo` = **TODO** (cần `ZALO_OA_TOKEN`); môi
    trường không phải production trả `devOtp` trong response để thử nghiệm, production
    không lộ OTP.
  - Xem cuộc họp được gán (`GET /portal/meetings`, `/portal/meetings/:id` — chặn nếu
    không thuộc thành phần dự họp), tài liệu lọc theo `viewScope` (all/vai trò/personId),
    xác nhận dự họp (`/confirm`).
  - Biểu quyết: `GET /portal/votes/:id/result`, `POST /portal/votes/:id/cast` (chống bỏ
    phiếu trùng bằng bảng `room_vote_ballots`), `POST /portal/votes/:id/sign` (**ký mô
    phỏng**: lưu `signature{method:"simulated", contentHash}` — **TODO** tích hợp PKI/CA
    thật VGCA/USB token). `GET /portal/history` — lịch sử biểu quyết của đại biểu.
  - Token đại biểu tách biệt token cán bộ admin (middleware `requireDelegate`).
- Schema: `migrate.js` thêm bảng `room_vote_ballots` + `delegate_otps`; `repo.js` thêm
  `roomVoteBallots` + `delegateOtpRepo`. Seed `meeting-room.json` thêm biểu quyết mở
  `rvote-002` cho `rmt-001`.
- Trang web `api/public/portal.html`: đăng nhập SĐT→OTP, danh sách cuộc họp, chi tiết
  (agenda + tài liệu + biểu quyết bỏ phiếu/kết quả/ký), lịch sử — vanilla JS, mobile-first.
- Test: +16 ca cổng đại biểu (OTP dev → token → meetings → cast → chống trùng → result →
  sign → history → chặn 401/404). **Chạy thực tế pg-mem: 86/86 PASS, 0 FAIL.**

### Test đợt 1: mở rộng test:db cho toàn bộ domain mới

- `api/test/db.test.js`: thêm ~30 assertion chạy trên pg-mem cho các endpoint mới —
  cư dân (list/lọc/approve), hộ dân (+thành viên), duyệt (approve cập nhật bản ghi gốc),
  phản ánh (receive→processing+log), thông báo (read), tin tức nội bộ (bình luận),
  cuộc họp (confirm), nhóm (thêm thành viên), thu (payment-status), chi (tạo),
  khảo sát (submit→aggregate), cuộc thi (chấm 30đ), service-links, dashboard DSS,
  import báo cáo (2 dòng), phòng họp số (gán đại biểu/agenda, ghi phiếu+kết quả),
  kiểm duyệt bình luận (ẩn→public không thấy), data-scope (cán bộ khu phố chỉ thấy TDP1).
- Chạy: `cd api && npm install && npm run test:db` (pg-mem, không cần DB thật).
- **Đã chạy thực tế (pg-mem): 90/90 PASS, 0 FAIL** — toàn bộ public API + Admin CMS
  (gồm tất cả domain mới + biểu quyết/đại biểu/agenda phòng họp số + import báo cáo +
  kiểm duyệt bình luận + data-scope + **cổng đại biểu OTP/biểu quyết/ký mô phỏng** +
  **nạp hộ theo tổ dân phố** + **hoạt động đại biểu**) hoạt động đúng end-to-end.

## Kết quả kiểm thử (đã chạy thực tế)

- Frontend: `tsc --noEmit` → **0 lỗi**; `vitest run` → **16/16 pass**.
- Backend API độc lập (PostgreSQL/pg-mem): `npm run test:db` → **17/17 pass** —
  public API, validate (400), đăng nhập đúng/sai (200/401), admin CRUD → public
  cập nhật, duyệt lịch hẹn, trả lời phản ánh, nhật ký, **RBAC chặn viewer (403)**, xoá.
- `docker-compose.yml` hợp lệ (service db + api), Dockerfile chuẩn.

## Phần còn lại (theo lộ trình)

- Migrations có phiên bản + index/khoá ngoại; backup/restore.
- JWT chuẩn + refresh token; xác thực token Zalo cho API public; HTTPS.
- Upload file (ảnh phản ánh) giới hạn type/size; rate limit phân tán (Redis).
- Báo cáo khảo sát trong admin; test trên Zalo Android/iOS, UAT; deploy `zmp deploy`.

## Cách chạy nhanh

```bash
# Frontend (mặc định dùng mock, không cần backend)
npm install
npm start

# Backend (tuỳ chọn, để chạy với dữ liệu thật)
cd server && npm install && npm start
# rồi đặt VITE_USE_MOCK=false trong .env.development
```
