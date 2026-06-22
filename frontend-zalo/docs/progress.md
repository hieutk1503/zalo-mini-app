# Tiến độ triển khai eGov DSS / Resident Group

Cập nhật: 2026-06-14. Bảng này theo dõi tiến độ theo từng module/domain.

Chú thích: ✅ xong · 🟡 một phần · ⛔ chưa · (mock) = có service mock+real, dữ liệu giả.

## 0. Nhật ký bổ sung tính năng công dân (2026-06-14) — mới nhất trước

Bám theo `docs/checklist-hang-muc-con-thieu.md`. Trạng thái: ✅ đã làm trong đợt này.

- ✅ **Thư viện pháp luật** (mới hoàn toàn): bảng `legal_documents` + repo + Admin CRUD +
  API `GET /legal_documents_api` (lọc lĩnh vực/loại/hiệu lực, tìm có dấu–không dấu) +
  seed 8 văn bản; FE: types, service (mock+real), store, trang danh sách (bộ lọc) + chi
  tiết (diễn giải + tóm tắt AI + disclaimer), route `/legal-library`, menu.
- ✅ **Chatbot AI bước 1**: thay khớp-cả-câu bằng tokenize (bỏ dấu + từ dừng) +
  scoreByTokens + top-N gợi ý; thêm tra cứu Thư viện pháp luật & FAQ. Test thuật toán PASS.
- ✅ **Giới thiệu** (`/about`, dùng organization API) + **YouTube Phường** (menu).
- ✅ **Mẫu đơn, tờ khai**: DocumentsPage nhận `type` từ navState; menu "Mẫu đơn, tờ khai"
  mở `/documents` lọc sẵn `form` (plumbing `navState` qua Utinity → WithItemClick).
- ✅ **Bản đồ quy hoạch**: PlanningPage hiển thị ảnh bản đồ (`imageUrl`) + nút "Mở bản đồ
  trực tuyến" (`mapUrl`); thêm trường `imageUrl`/`mapUrl` (type + admin + seed doc-005).
- ✅ **Service Hub deep link**: `onOpen` ưu tiên mở app qua `appScheme` (iframe an toàn +
  timeout) rồi fallback `webUrl`; admin thêm trường `appScheme`/`storeUrl`.
- ✅ **Trang chủ thông minh**: API `GET /home_stats_api` (đếm thủ tục/văn bản pháp luật/
  văn bản/đặt lịch/tin/phản ánh + tỉ lệ xử lý phản ánh + cấu hình dân số/hài lòng/DVC trực
  tuyến từ organization); FE: type `HomeStats`, service (mock+real), store `getHomeStats`,
  `pages/Home/StatsSection.tsx` hiển thị lưới số liệu trên trang chủ; admin organizations
  thêm trường population/area/satisfactionScore/onlineServiceRate.
- ✅ **Gắn vào giao diện home mới**: phát hiện home đã refactor sang `@constants/home-tiles`
  + `@components/home`. Đã thêm tile **Pháp luật**, **Giới thiệu**, **YouTube Phường** vào
  `CITIZEN_TILES`; mở rộng `HomeTile.link` + `TileGrid` để mở link ngoài (YouTube).
  (Menu cũ `APP_UTINITIES` vẫn cập nhật song song để tương thích.)

Hoàn tất các hạng mục xây được bằng code trong checklist (trừ phần cần khóa/hạ tầng thật).
Để sau (cần khóa/hạ tầng thật): OTP Zalo OA, ký số PKI, xác thực token Zalo; Chatbot LLM/RAG.

> Lưu ý kiểm thử: môi trường thực thi tại phiên này chỉ có mirror cũ của một số file lớn
> nên chưa chạy được `tsc`/`lint`/`test:db` đầy đủ; cần chạy lại ở máy.

## 1. Frontend Mini App

| Module | Route | UI | Service (mock+real) | Store |
| --- | --- | --- | --- | --- |
| Cư dân | /residents(+/:id,/create,/:id/edit) | ✅ | ✅ | ✅ |
| Hộ dân | /households(+chi tiết, thành viên) | ✅ | ✅ | ✅ |
| Duyệt cư dân/hộ dân | /approval/* | ✅ | ✅ | ✅ |
| Phản ánh nâng cao | /reflections(+/:id) | ✅ | ✅ | ✅ |
| Thông báo nhanh | /notifications(+/:id) | ✅ | ✅ | ✅ |
| Cuộc họp | /meetings(+/:id,/create) | ✅ | ✅ | ✅ |
| Nhóm cộng đồng | /community-groups(+...) | ✅ | ✅ | ✅ |
| Khảo sát | /surveys(+/:id) | ✅ | ✅ | ✅ |
| Cuộc thi | /contests(+/:id) | ✅ | ✅ | ✅ |
| Quản lý thu | /income(+/:id,/create) | ✅ | ✅ | ✅ |
| Quản lý chi | /expenses(+/:id,/create) | ✅ | ✅ | ✅ |
| Tiện ích/Liên kết | /service-hub | ✅ | ✅ | ✅ |
| Tin tức + bình luận | /news(+/:id) | ✅ | ✅ | ✅ |
| Tổng quan (DSS rút gọn) | /dashboard | ✅ | (tổng hợp client) | — |
| TODO web: nhập liệu báo cáo, phòng họp số | /report-entry, /meeting-room | ✅ placeholder | — | — |

Nền tảng: tailwind tokens design system ✅ · component dùng chung (StatusBadge,
MetaBadge, SectionCard, EmptyState, FilterBar, StatusTabs, DataList, SummaryCards) ✅ ·
adapter `@service` gộp 8 nhóm ✅.

## 2. Backend API thật (`api/` — Express + PostgreSQL)

| Domain | Public API | Admin CMS | Seed |
| --- | --- | --- | --- |
| Cư dân | ✅ /residents (+submit/approve/reject) | ✅ | ✅ |
| Hộ dân | ✅ /households (+members/approve/reject) | ✅ | ✅ |
| Duyệt | ✅ /approval-requests (+approve/reject) | (qua bản ghi gốc) | ✅ |
| Danh mục tổ dân phố | ✅ /neighborhood-groups | — | — |
| Phản ánh (xử lý) | ✅ /reflections (+receive/forward/complete) | ✅ | ✅ |
| Thông báo nhanh | ✅ /notifications (+read) | ✅ | ✅ |
| Tin tức nội bộ + bình luận | ✅ /news (+/:id, /comments GET+POST) | ✅ | ✅ |
| Cuộc họp | ✅ /meetings (+confirm/reject) | ✅ | ✅ |
| Nhóm cộng đồng | ✅ /community-groups (+members add/remove) | ✅ | ✅ |
| Quản lý thu | ✅ /income-campaigns (+payment-status) | ✅ | ✅ |
| Quản lý chi | ✅ /expenses | ✅ | ✅ |
| Khảo sát (campaign) | ✅ /surveys (+submit/results) | ✅ | ✅ |
| Cuộc thi | ✅ /contests (+submit/ranking) | ✅ | ✅ |
| Service links | ✅ /service-links | ✅ | ✅ |

→ **13/13 domain đã có public API thật + quản lý trong Admin CMS.**

RBAC: super_admin (toàn quyền), content_editor (nội dung + địa bàn + cộng đồng +
khu phố + tương tác), feedback_officer (phản ánh). Chạy: `cd api && docker compose up -d --build`.

## 3. Còn lại để hoàn thiện

Public API + Admin CRUD: **đã đủ 13/13 domain.**

Web DSS (trong Admin CMS `api/`): ✅ **Dashboard điều hành** (GET /admin/dashboard —
KPI cư dân/hộ/duyệt, phản ánh theo trạng thái, thu/chi, lịch hẹn, họp, khảo sát,
cuộc thi, tin); ✅ **Nhập liệu báo cáo theo kỳ** (thủ công — bảng report_entries,
mục "Nhập liệu báo cáo DSS").

**Phòng họp số** (xem `docs/phong-hop-so-analysis.md`): ✅ đợt 1 — Nhân sự họp, Cuộc
họp Đảng ủy/UBND/MTTQ, Tài liệu họp (thư mục+tệp) trong Admin CMS; vai trò
`meeting_clerk` (tài khoản seed `phonghop/123456`). ✅ đợt 2a — **Biểu quyết** (tạo +
ghi phiếu + tổng hợp kết quả + đóng). ✅ đợt 2b — **gán đại biểu** + **gán nội dung họp
(agenda)** qua panel "Đại biểu/Nội dung", **phân quyền tài liệu** (viewScope + endpoint
riêng). ✅ **đợt 3 — Cổng đại biểu** (`public-portal.js` + `public/portal.html`): đăng
nhập **OTP qua Zalo** (gửi Zalo OA = TODO; DEV trả OTP để test), xem cuộc họp được gán +
tài liệu phân quyền, xác nhận dự họp, biểu quyết (chống bỏ phiếu trùng — bảng
`room_vote_ballots`), kết quả realtime, **ký xác nhận mô phỏng** (hash nội dung; TODO PKI
thật VGCA), lịch sử. → Module phòng họp số hoàn chỉnh.

✅ **Import báo cáo hàng loạt** — dán CSV/TSV (xuất từ Excel hoặc copy ô Excel, tự nhận
Tab), map tiêu đề cột tiếng Việt → tạo nhiều bản ghi (`POST /admin/report-entries/import`,
nút "Import" ở mục Nhập liệu báo cáo). Web DSS coi như đủ; nâng cấp tùy chọn: đọc trực
tiếp file `.xlsx` bằng thư viện SheetJS (chỉ cần đổi parser, hiện dùng CSV/TSV không
phụ thuộc lib).

Nâng cao — đã xong: ✅ kiểm duyệt (ẩn/hiện/xoá) bình luận tin tức; ✅ vai trò
**Cán bộ khu phố (ward_officer)**; ✅ **upload file thật** ở backend (POST /uploads,
giới hạn type JPG/PNG/WEBP/PDF + ≤5MB, phục vụ /uploads) + service FE `api.uploadFile`
(mock+real); ✅ **tổng hợp khảo sát từ phản hồi thật** (lưu `survey_campaign_responses`,
aggregate; fallback mô phỏng khi chưa có phản hồi).

Nâng cao — đã xong thêm: ✅ **nối upload file vào form** — component `FileUpload`
(chọn tệp → base64 → `api.uploadFile`) đã gắn vào **form Chứng từ (Quản lý chi)** và
**form Tài liệu (Cuộc họp khu phố)**; tệp khác có thể tái dùng component này.

Nâng cao — đã xong thêm: ✅ **RBAC data-scope theo địa bàn** — `admin_users.scope`
(tổ dân phố); token mang scope; danh sách Admin tự lọc theo `neighborhoodGroup===scope`;
tạo mới tự gán địa bàn; form tài khoản có trường "Phạm vi địa bàn"; tài khoản
`khupho` gắn "Tổ dân phố 1".

Nâng cao — còn lại (đều phụ thuộc khóa/hạ tầng thật): gửi OTP thật qua **Zalo OA**
(cần `ZALO_OA_TOKEN` + template ZNS — đã chừa hàm `sendOtpViaZalo`, hiện DEV trả OTP);
**ký số thật** PKI/CA (VGCA/USB token — hiện ký mô phỏng lưu hash); deep link app cho
service hub; xác thực token Zalo cho API public; (Mini App production: nối Zalo media
picker thay `<input type=file>` nếu cần); đọc trực tiếp `.xlsx` (SheetJS).

Kiểm thử backend: `api/test/db.test.js` (pg-mem) đã bao phủ cả domain mới — chạy
`cd api && npm install && npm run test:db`. **Đã chạy thực tế: 70/70 PASS (0 FAIL).**

Kiểm thử — **đã chạy thực tế trên máy, tất cả XANH:**
- Backend `npm run test:db` (pg-mem): **90/90 PASS, 0 FAIL** (gồm cổng đại biểu +
  liên kết dữ liệu nội bộ + hoạt động đại biểu).
- Frontend `npx tsc --noEmit`: **0 lỗi.**
- Frontend `npm run lint`: **0 errors** (còn 13 warnings `no-console`/`array-index-key`
  trong code gốc — không chặn build).
- Frontend `npm test` (vitest): **16/16 PASS** (2 file test).

(Lệnh đầy đủ: `npx tsc --noEmit && npm run lint && npm test` cho FE; `cd api &&
npm install && npm run test:db` hoặc `docker compose up` cho BE.)

## 4. Nhật ký đợt (mới nhất trước)

- Đợt NEWS-9 (banner TIN NỔI BẬT là bài thật): seed bài **"Tin tức Chuyển Đổi Số"** (id
  `nw-chuyendoiso`, featured=true, có ảnh + nội dung HTML về chuyển đổi số) vào `newsArticles`
  qua `ensureDefaultArticles()` (create-if-missing, chạy lúc khởi động) + chuyên mục
  "Chuyển đổi số". Thêm cờ **featured**: type NewsArticle, field Admin "Nổi bật (đưa lên
  banner)" cho newsArticles; `/news` **sắp bài Nổi bật lên đầu**; HomePage case featured
  ưu tiên `find(featured)` rồi mới tới bài mới nhất. → Banner hiện bài "Tin tức Chuyển Đổi
  Số" (ảnh + chip "TIN NỔI BẬT"), bấm mở `/news/nw-chuyendoiso` (chi tiết về Chuyển đổi số).
  Cán bộ có thể đánh dấu "Nổi bật" cho bài bất kỳ để đổi bài lên banner. Cần restart api.

- Đợt NEWS-8 (bấm "TIN NỔI BẬT" không xem được tin): banner đang hiển thị bài hệ `news` cũ
  (không có trang chi tiết trong app, chỉ mở `link` ngoài — link trống → bấm vô tác dụng).
  Sửa tận gốc: thêm `migrateNewsIntoArticles()` (seed.js) chuyển bài `news` → `newsArticles`
  (id `mig-<id>`, map desc→summary, thumb→thumbnailUrl, link→sourceUrl, giữ content/category/
  author/source/status), **idempotent create-if-missing**, chạy trong `ensureSeed()` mỗi lần
  khởi động (index.js) — không mất/ghi đè dữ liệu. Sau migrate, banner dùng `newsArticles[0]`
  → mở `/news/:id` (có chi tiết + bình luận). Phòng hờ: fallback hệ cũ không link → về `/news`.
  → Cần `docker compose restart api` (KHÔNG dùng down -v) để chạy migrate.

- Đợt NEWS-7 (gộp 1 hệ tin): Giữ "Tin tức nội bộ" (newsArticles) làm hệ chính, **đổi nhãn
  Admin thành "Tin tức"** + icon 📰; đưa cụm newsArticles/newsCategories/newsComments vào
  nhóm "Dịch vụ công & Nội dung". **Ẩn** domain `news` cũ khỏi NAV_GROUPS (đổi nhãn
  "Tin tức (cũ – đã ẩn)"); data + endpoint giữ nguyên (không mất dữ liệu), home featured vẫn
  fallback đọc news domain để nội dung cũ còn hiện. (Có thể migrate news→newsArticles nếu cần.)
- Đợt EVENTS-3: Trang **danh sách `/events`** (PageLayout + widget Events, bấm mở chi tiết);
  thêm ô **"Sự kiện" 🎉** vào CITIZEN_TILES (/events); khối Sự kiện trang chủ thêm nút
  **"Xem tất cả"** → /events (widget Events: tiêu đề tùy chọn + onMore).
- CFG: `.env.development` xác nhận `VITE_USE_MOCK=false` (dùng API thật, không mock) — sửa
  comment cho đúng.

- Đợt NEWS-6: **Banner "TIN NỔI BẬT" trống** vì trang chủ đọc `newsArticles` ("Tin tức nội
  bộ"), trong khi nội dung có thể được nhập ở hệ `news` ("Tin tức", /get_articles_api).
  Sửa: HomePage fetch thêm `getArticles` và case `featured` đọc **cả 2 nguồn** — ưu tiên
  `newsArticles[0]` (mở `/news/:id`); nếu rỗng dùng `articles[0]` (news domain, map `thumb`→
  ảnh, mở `link` ngoài); cả 2 rỗng mới hiện banner tĩnh. → Banner hiện bài thật dù bạn nhập
  ở mục "Tin tức" hay "Tin tức nội bộ". (Khuyến nghị lâu dài: gộp 2 hệ tin về 1 cho gọn.)

- Dọn nốt 13 warning → lint sạch hoàn toàn (0/0). `no-console` đổi sang
  `["warn",{allow:["warn","error"]}]`; 11 chỗ `console.log(err)` (catch/`fail`) →
  `console.error` (bỏ `console.log("")` + callback success vô nghĩa ở WithItemClick);
  2 chỗ `react/no-array-index-key` (skeleton InformationGuideList + ảnh ImageUpload —
  index hợp lệ) thêm `// eslint-disable-next-line`.

- Fix lint (11 errors → 0): nạp `plugins:["react-hooks"]` vào `.eslintrc.js` (rule có sẵn,
  không bật → hết "Definition for rule react-hooks/exhaustive-deps was not found" ở 5 file);
  HomePage 2 empty arrow `() => {}`→`() => undefined`; bỏ prop thừa `videoUrl` (VideoBlock)
  + chỗ truyền; bỏ import `Box` thừa (StatsSection); 2 nested ternary (LegalLibrary) → arrow
  có thân dùng `if`. (Còn 13 warning no-console/array-index-key là pre-existing, không chặn build.)

- Đợt NEWS-5: **Banner "Tin tức nổi bật" → bài viết thật**. Component `FeaturedNews`
  (hero ảnh nền + lớp phủ gradient + chip "TIN NỔI BẬT" màu chủ đạo + tiêu đề 2 dòng).
  HomePage case `featured` dùng `newsArticles.articles[0]` (bài mới nhất), bấm mở
  `/news/:id`; nếu chưa có bài thì fallback banner trang trí cũ (`FeaturedBanner`).
  → Trang chủ giờ có đúng 1 điểm nhấn tin tức, không trùng.
- Đợt EVENTS-2: **Trang chi tiết sự kiện `/events/:id`**. Backend `GET /events_api/:id`
  (ẩn nháp, trả 1 sự kiện). FE: `API.EVENT_DETAIL`, service `getEvent` (real+mock),
  store `eventDetail`/`gettingEventDetail`/`getEventDetail`; trang `EventDetailPage`
  (ảnh bìa, tiêu đề, 🕒 giờ + ngày (start–end), 📍 địa điểm, mô tả render HTML, link
  "Xem chi tiết/Đăng ký"); route trong pages/index.tsx; thẻ Sự kiện trang chủ mở chi tiết.

- HOME-FIX: Trang chủ bị **trùng 2 lối vào tin tức** ("Tin tức mới" = khối `newsList` dạng
  danh sách + "Tin tức nổi bật" = banner `featured`). Theo yêu cầu: **bỏ "Tin tức mới"** —
  đặt `newsList` enabled:false ở `HomePage.DEFAULT_SECTIONS`, `db.json` homeSections,
  và mock getHomeSections; giữ banner `featured`. Vẫn quản trị/bật lại được trong Admin
  "Giao diện trang chủ". Lưu ý: DB đang chạy vẫn bật → hiệu lực ngay bằng cách tắt trong
  Admin (Hiển thị = Ẩn) hoặc reseed `down -v`.

- Fix tsc: `WithItemClick.tsx` bỏ cast sai `as Parameters<typeof navigate>[1]` (overload
  `navigate(delta)` khiến `[1]`=undefined → TS2352/TS2493). Để object literal tự suy kiểu
  `ZMPNavigationOptions` (animate/direction + state kế thừa react-router).

- Đợt EVENTS-1: **Loại section "Sự kiện" cho Home Builder (đầy đủ Admin + API + FE)**.
  Backend: collection `events` (repo dataTable + RESOURCE_TABLE prefix `evt` + migrate bảng
  `events` + quyền trong CONTENT_RES); endpoint công khai `GET /events_api` (lọc bỏ `draft`,
  sắp theo `startTime` tăng dần); `seed.js` nạp `db.events`; seed 3 sự kiện mẫu + khối
  home `hs-events` (order 4.7).
  Admin (`admin.html`): mục **"Sự kiện"** (CRUD: tên, bắt đầu/kết thúc, địa điểm, ảnh,
  **mô tả richtext**, link, trạng thái) trong nhóm "Dịch vụ công & Nội dung" + icon 🎉;
  thêm tùy chọn key `events=Sự kiện sắp diễn ra` trong form "Giao diện trang chủ".
  FE: type `EventItem`; API const `EVENTS`; service `getEvents` (real + mock); store
  `events`/`getEvents` (organizationSlice); component **`Events`** (thẻ có badge ngày, dùng
  `--main`); HomePage thêm `case "events"` + `DEFAULT_SECTIONS` (order 4.7) + gọi getEvents;
  mock getHomeSections thêm khối events. (Bonus: thêm helper `delay` còn thiếu trong services.mock.)

- Đợt NEWS-4: **Trình soạn thảo WYSIWYG (editor) cho "Mô tả ngắn" + "Nội dung" tin tức**.
  Admin (`admin.html`): thêm field type `richtext` = thanh công cụ (Đậm/Nghiêng/Gạch chân/
  Tiêu đề/Danh sách/Link/Ảnh/Xoá định dạng) + vùng `contenteditable`. Áp dụng cho
  `news.desc`/`news.content` và `newsArticles.summary`/`newsArticles.content`.
  - **Chèn ảnh**: nút 🖼️ → upload `/uploads` → chèn `<img>` tại con trỏ.
  - **Dán từ Word/Web**: giữ định dạng (HTML); ảnh dán dạng base64 tự upload lên `/uploads`
    (đổi `src` data: → URL same-origin), tránh phình DB & vướng whitelist ảnh ngoài.
  - Lưu: editor đọc `innerHTML` (qua `data-editor="1"`); gắn paste handler sau showModal.
  FE: `NewsDetailPage` render nội dung bằng `dangerouslySetInnerHTML` (styled `ArticleBody`:
  ảnh max-width 100%, h3, ul/ol, link màu chủ đạo). `toHtml()` tự nhận biết HTML mới vs text
  cũ (`\n`→`<br/>`). NewsPage/NewsList chỉ dùng title/ảnh/meta nên không lộ thẻ HTML.
  Lưu ý: nội dung do cán bộ (đã đăng nhập) soạn nên render trực tiếp; ảnh dán từ web vẫn là
  URL ngoài → nên dùng nút Chèn ảnh (lưu /uploads) hoặc whitelist domain ở Zalo Console.

- Đợt NEWS-3: **Nâng domain "Tin tức" (`news`, /get_articles_api) ngang "Tin tức nội bộ"**.
  Form Admin "Tin tức" đầy đủ: Nội dung chi tiết, **Ảnh tin (upload)**, **Chuyên mục
  (dropdown động từ newsCategories)**, Tác giả, Nguồn (Phường/Tỉnh/Khác), Link bài gốc,
  Ngày đăng + cột Chuyên mục. `get_articles_api` trả full object (spread); seed news
  pass-through (`...a`) + làm giàu 2 bài mẫu (ảnh/chuyên mục/nội dung/nguồn).
  Lưu ý: 2 hệ tin (news vs newsArticles) giờ đều đầy đủ trong Admin; FE (trang chủ +
  /news) đang dùng `newsArticles` — nếu muốn hiển thị domain `news` trên app cần wire thêm.

- Đợt HOME-3b: **Khối nâng cao Home Builder + sửa "không thấy tin trên trang chủ"**.
  + Nguyên nhân: trang chủ mới chỉ có banner tĩnh, **không có khối danh sách tin**; domain
    `news` (mục "Tin tức" cũ) không còn render trên home (NewsSection cũ đã bỏ). FE /news +
    home dùng `newsArticles` ("Tin tức nội bộ").
  + Thêm khối **"newsList"** (Danh sách tin) — hiện tin mới nhất từ `newsArticles` (ảnh/ngày/
    nguồn/chuyên mục), bấm mở chi tiết, "Xem tất cả" → /news; đưa vào seed/mock + DEFAULT
    (order 4.5) → hiện ngay trên trang chủ.
  + Thêm khối **"slider"** (trình chiếu ảnh — field "Ảnh slider" mỗi dòng 1 URL) và **"video"**
    (poster + nút play mở link). Admin: key select thêm 3 loại + field `images`/`videoUrl`.
  + Khuyến nghị: dùng **"Tin tức nội bộ"** cho tin hiển thị trên app (mục "Tin tức" cũ là
    template DVC, không gắn vào home mới). Ảnh production nên dùng **/uploads** (đã upload được
    trong Admin) vì domain ngoài cần whitelist ở Zalo Console.

- Đợt ADMIN-FORM-1: nâng cấp form builder Admin:
  + Loại field **`image`** — nút "Tải ảnh" đọc file → base64 → `POST /uploads` → tự điền URL;
    áp cho Ảnh bìa tin tức, Ảnh nền khối giao diện, Logo tổ chức.
  + Loại field **`dynselect:resource:field`** — dropdown động; áp cho **Chuyên mục bài viết**
    (lấy từ `newsCategories`, giữ giá trị hiện tại nếu chưa có trong danh sách).
  + `openForm` chuyển async để prefetch dữ liệu dropdown trước khi dựng form.

- Đợt HOME-3a: **Đổi thứ tự khối ▲▼** trong Admin (section Giao diện trang chủ — hàm
  `moveSection` hoán đổi `order` 2 khối liền kề) + **Màu chủ đạo toàn app**: tailwind
  token `main` → `var(--main, #046DD6)`; thêm trường "Màu chủ đạo" vào tổ chức (Admin);
  HomePage áp `--main` theo `organization.primaryColor` → đổi màu trong Admin là cả app
  đổi theo (fallback #046DD6 nếu chưa đặt).

- Đợt HOME-1+2: **Quản trị giao diện trang chủ (Home Builder)**.
  + Backend: bảng `home_sections` (CRUD admin) + public `GET /home-sections` + seed 9 khối
    mặc định; quyền CONTENT_RES.
  + Admin: section **"Giao diện trang chủ"** (nhóm "Giao diện hiển thị") — mỗi khối: loại,
    thứ tự, bật/tắt, tiêu đề, phụ đề, ảnh nền, 2 màu, link.
  + FE: type `HomeSection` + service `getHomeSections` (thật+mock) + store; **HomePage render
    ĐỘNG** theo cấu hình (sắp theo `order`, chỉ khối enabled, áp tiêu đề/ảnh/màu từng khối),
    fallback layout mặc định nếu chưa cấu hình. HeroHeader/ExploreBanner/FeaturedBanner/
    StatCards nhận props màu/ảnh.
  + Docker: thêm volumes (`./src`,`./public`,`./seed-data`) để sửa là cập nhật.
  + Đính chính NEWS: `newsCategories` + field ảnh/tác giả/nguồn ĐÃ có trong `admin.html` thật;
    không thấy là do Docker image cũ → đã thêm volumes + hướng dẫn rebuild/reset DB để seed.

- Đợt NEWS-1: **Mở rộng module Tin tức** (domain newsArticles mà FE /news dùng).
  + Admin: thêm section **"Chuyên mục tin tức"** (newsCategories — CRUD tên/thứ tự/mô tả/
    hiển thị) trong nhóm "Cộng đồng & Tiếp nhận"; bổ sung field bài viết: **Ảnh bìa,
    Tác giả, Nguồn (Phường/Tỉnh/Khác), Link bài gốc**.
  + Backend: bảng `news_categories` + RESOURCE_TABLE + quyền COMMUNITY_RES + route công khai
    `GET /news-categories`; `/news` & `/news/:id` trả full object nên field mới tự ra FE.
  + Seed: 6 chuyên mục + ảnh/tác giả/nguồn cho 4 bài (1 bài nguồn "Tỉnh" kèm link gốc).
  + FE: type `NewsArticle` (+author/source/sourceUrl/status) + `NewsCategory`; service
    `getNewsCategories` (thật+mock); `newsSlice`; **NewsPage** lọc theo chuyên mục động (từ
    Admin, fallback hằng số) + nhãn nguồn; **NewsDetailPage** hiện ảnh bìa + tác giả + nguồn
    + "Xem bài gốc".

- Đợt ADMIN-UI-1: **Sidebar Admin dạng cây (tree) có nhóm + icon + thu/mở**.
  Gom 38 mục thành 10 nhóm (Tổng quan · Dịch vụ công & Nội dung · Thông tin địa phương ·
  Địa bàn dân cư · Cộng đồng & Tiếp nhận · Vận hành khu phố · Tương tác · DSS & Báo cáo ·
  Phòng họp số · Hệ thống) + nhóm "Khác" dự phòng. Mỗi nhóm có header bấm thu/mở (chevron
  xoay), trạng thái lưu `localStorage`; mỗi mục có emoji icon; nhóm chứa mục đang chọn tự
  mở; ẩn nhóm rỗng theo phân quyền. Sửa `admin.html` (CSS .navgroup/.gh/.gitems/.navitem,
  config NAV_GROUPS+SECTION_ICONS, dựng menu trong loadMe, mở nhóm trong selectSection).

- Đợt WEATHER-1: **Thời tiết thật qua API (Open-Meteo, miễn phí, không cần key)**.
  Backend proxy `GET /weather_api` (đọc lat/lon từ tổ chức/Admin hoặc query, gọi
  Open-Meteo server-side, map mã WMO → nhãn tiếng Việt + emoji). Service `getWeather`
  (thật + mock) + `WEATHER` endpoint. Store `organizationSlice.getWeather` + state
  `weather`. HomePage gọi `getWeather()` và hero ưu tiên thời tiết thật (fallback org →
  mặc định). Thêm trường **lat/lon** vào form Tổ chức (Admin) để cấu hình vị trí.
  Lưu ý vận hành: backend cần truy cập ra `api.open-meteo.com`; Mini App chỉ gọi backend
  (không cần whitelist domain ngoài).

- Đợt ADMIN-1: rà soát yêu cầu "mọi chức năng đều có quản trị trong Admin".
  + Thêm **quản trị "Hồ sơ tra cứu" (profiles)** — trước đó có dữ liệu + API
    `search_profiles_api` nhưng KHÔNG có section admin: bổ sung `profiles` vào
    `RESOURCE_TABLE` (repo.js) → tự sinh CRUD `/admin/profiles`; thêm quyền vào
    `RESIDENT_RES` (auth.js); thêm section "Hồ sơ tra cứu" trong `admin.html`.
  + Nối thống kê hero trang chủ với Admin: section "Thông tin địa phương"
    (organizations) ĐÃ có sẵn (population/area/satisfactionScore/onlineServiceRate);
    bổ sung trường `shortName` (tên hiển thị) + sửa `get_organization_api` trả TOÀN BỘ
    trường tổ chức → hero Mini App dùng số liệu do Admin nhập (không còn hardcode).
  + Lưu ý: bản mount sandbox cắt cụt `admin.html` ở ~dòng 143 gây hiểu nhầm "mất
    section"; đã đối chiếu file thật bằng Read — TẤT CẢ section admin vẫn còn đủ.
- Đợt FE lịch hẹn/forms: route `/forms/:id` riêng; lịch sử nhiều lịch hẹn qua API
  (`GET /schedules_api` + service getWorkSchedules + store getSchedules + trang
  "Lịch hẹn của tôi" hiển thị danh sách).

- Đợt LK-1+2: **Liên kết dữ liệu nội bộ + Hoạt động đại biểu**.
  (1) `POST /admin/income-campaigns/:id/populate-households` — nạp hộ **đã duyệt** theo
  tổ dân phố vào đợt thu (giữ trạng thái hộ đã đóng/miễn) + nút "Nạp hộ" trong Admin;
  gán đại biểu phòng họp số **chọn từ danh bạ nhân sự** (auto-fill personId/đơn vị/vai trò).
  (2) `GET /admin/room-meetings/:id/activity` — tổng hợp xác nhận dự họp + ai đã biểu
  quyết/đã ký từng nội dung (bảng `room_vote_ballots`) + panel "Hoạt động" trong Admin.
  Test +4 ca → **90/90 PASS**.
- Đợt PHS-3: **Cổng đại biểu Phòng họp số** — backend `public-portal.js` (đăng nhập OTP
  qua Zalo [gửi=TODO, DEV trả OTP], `/portal/*`: me, meetings, meeting detail, confirm,
  votes result/cast/sign, history; token `kind:delegate`; bảng `room_vote_ballots` chống
  bỏ phiếu trùng; ký mô phỏng + hash, TODO PKI) + trang `public/portal.html`. Seed thêm
  biểu quyết mở `rvote-002`. Test +16 ca → **86/86 PASS** (chạy thực tế pg-mem).

- Đợt TS-1: sửa 4 lỗi `npx tsc --noEmit`. (1) `BadgeMeta` trùng export ở
  neighborhood/engagement/finance → định nghĩa một lần trong `constants/status.ts`,
  ba file kia import lại (hết TS2308). (2) `ServiceHubPage` icon `zi-globe` không hợp lệ
  → đổi `zi-link`. (3) `zalo.ts` `JSON.parse(data)` với `string|string[]` → ép `raw`
  về string trước khi parse.
- Đợt LINT-1: sửa 14 lỗi `npm run lint` (FE). Cấu hình eslint: `react/no-unknown-property`
  ignore `tw` (twin.macro) + override tắt `import/no-extraneous-dependencies` cho file test.
  Code: đổi `seq++`→`seq+=1` (5 file service mock), bỏ nested ternary (Contest/Survey
  detail bằng IIFE), bỏ import `ROUTES` thừa, `prefer-destructuring` egovSlice,
  `no-param-reassign` (community mock, disable có chú thích), key text khảo sát theo nội dung.
  (Lỗi `node_modules` hỏng lúc đầu là do cài đặt lỗi → cài lại đã hết.)
- Đợt TEST-1: mở rộng `api/test/db.test.js` (+~30 check) cho toàn bộ domain mới
  (cư dân/hộ/duyệt, phản ánh, thông báo, tin+bình luận, họp/nhóm/thu/chi, khảo sát/
  cuộc thi/service-links, dashboard, import báo cáo, phòng họp số biểu quyết/đại biểu/
  agenda, kiểm duyệt bình luận, data-scope). **Đã chạy thực tế trên pg-mem:
  70/70 PASS, 0 FAIL** (cài `npm install` + `node test/db.test.js`).
- Đợt DSS-2: import báo cáo hàng loạt (dán CSV/TSV) — `POST /admin/report-entries/import`
  + nút "Import" + modal dán dữ liệu; map tiêu đề cột tiếng Việt.
- Đợt NC-4: RBAC data-scope theo địa bàn (`admin_users.scope`, token mang scope, lọc
  danh sách Admin theo `neighborhoodGroup`, tự gán khi tạo, form + cột "Địa bàn").
- Đợt NC-3: component `FileUpload` (FE) + nối vào form Chứng từ (chi) và Tài liệu (họp)
  → upload thật qua `/uploads` (base64, giới hạn type/size).
- Đợt PHS-2b: gán đại biểu + nội dung họp (agenda) qua panel "Đại biểu/Nội dung" trong
  Admin (`/admin/room-meetings/:id/participants|agenda`); phân quyền tài liệu
  (`/admin/room-documents/:id/permissions`). → Phòng họp số đủ nghiệp vụ cốt lõi.
- Đợt PHS-2a: Biểu quyết phòng họp số — `/admin/room-votes/:id/results` + `/cast`;
  mục Admin "PHS · Biểu quyết" (tạo theo phương án/dòng, modal kết quả + ghi phiếu +
  đóng).
- Đợt PHS-1 (Phòng họp số): phân tích `docs/phong-hop-so-analysis.md`; backend +
  Admin cho Nhân sự họp / Cuộc họp / Tài liệu họp (bảng `room_*`), vai trò
  `meeting_clerk`, seed `meeting-room.json`. Biểu quyết/đại biểu/agenda/phân quyền → đợt 2.
- Đợt DSS-1: Web DSS trong Admin — dashboard điều hành (`/admin/dashboard` + mục
  "Tổng quan DSS": KPI cards + bar phản ánh) và nhập liệu báo cáo theo kỳ
  (`report_entries` + mục "Nhập liệu báo cáo DSS").
- Đợt NC-2 (nâng cao): upload file backend (`upload.js`, POST /uploads + serve, giới
  hạn type/size) + `api.uploadFile` (FE); khảo sát tổng hợp từ phản hồi thật
  (`survey_campaign_responses` + aggregate trong `public-engagement.js`).
- Đợt NC-1 (nâng cao): kiểm duyệt bình luận tin tức (Admin: /admin/news-comments
  hide/unhide/delete + mục "Bình luận tin"); thêm vai trò `ward_officer` (Cán bộ
  khu phố) + tài khoản seed `khupho/123456`.
- Đợt BE-4: backend + admin cho Khảo sát, Cuộc thi, Service-links
  (`public-engagement.js`, seed `engagement.json`). → **13/13 domain có API thật.**
- Đợt BE-3: backend + admin cho Cuộc họp, Nhóm cộng đồng, Quản lý thu, Quản lý chi
  (`public-khupho.js`, seed `khupho.json`). → 11/13 domain có API thật.
- Đợt BE-2: backend + admin cho Phản ánh, Thông báo, Tin tức+bình luận.
- Đợt BE-1: backend + admin cho Cư dân, Hộ dân, Duyệt.
- FE: hoàn tất P0 + P1 + dashboard rút gọn + tin tức + service hub.
