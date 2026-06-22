# Checklist hạng mục còn thiếu — Zalo Mini App "Tự Lạn Smart"

> Đối chiếu giữa tài liệu yêu cầu (`Gioi thieu Zalo Mini app (DT 2) - D update 12062026.docx`
> + `requirements-analysis.md`) và code thực tế (`mna-zaui-egov-sample/` + `api/`).
> Lập ngày: 2026-06-14. Quy ước: ⛔ chưa làm · 🟡 một phần · ⚠️ có nhưng chưa đạt yêu cầu.

## A. Tổng quan độ phủ

- App công dân (docx, 15 nhóm): ~12/15 **đủ**, 3 nhóm còn vướng + 3 mục mở rộng (MobiFone) chưa trọn.
- Hệ quản lý khu phố / eGov DSS: **đã làm vượt yêu cầu docx** (không nằm trong checklist này).
- Phần lớn hạng mục còn lại thuộc 2 loại: (1) chức năng nghiệp vụ thiếu/yếu; (2) hạ tầng "thật" cho production.

## B. Checklist chức năng

> Cập nhật 2026-06-14: đã hoàn thành các mục đánh dấu [x] dưới đây (xem mục F).

### B1. Ưu tiên cao (P0–P1)

- [x] ✅ **Chatbot AI dịch vụ công** — đã nâng cấp bước 1: tách token + bỏ từ dừng + chấm
  điểm độ liên quan + trả top-N thủ tục liên quan, có tra cứu cả Thư viện pháp luật & FAQ.
  (Bước 2 — LLM/RAG — vẫn để sau.) Xem mục **D1**, **F**.
- [x] ✅ **Thư viện pháp luật** (`/legal-library`) — đã xây đầy đủ: model + API public
  (lọc lĩnh vực/loại/hiệu lực, tìm có dấu/không dấu) + seed mẫu + Admin CRUD + 2 trang FE
  + mục menu. (Tóm tắt AI tự động vẫn để sau; hiện nhập tay + disclaimer.) Xem mục **D2**, **F**.
- [x] ✅ **Kho mẫu đơn, tờ khai** — DocumentsPage nhận `type` từ navState (lọc sẵn `form`);
  thêm tile/menu "Mẫu đơn, tờ khai". Điền trực tuyến vẫn để sau (tùy chọn).
- [x] ✅ **Thông tin quy hoạch** — PlanningPage hiển thị **ảnh bản đồ** (`imageUrl`) +
  nút **"Mở bản đồ trực tuyến"** (`mapUrl`); thêm trường + seed mẫu + nhập ở admin.
  (Lớp WebGIS động nâng cao vẫn để sau.)

### B2. Ưu tiên trung bình (P2)

- [x] ✅ **Trang chủ thông minh / Dashboard công dân** (mục 6.15) — API `/home_stats_api` +
  `StatsSection` trên trang chủ: số thủ tục, văn bản pháp luật, văn bản, lượt đặt lịch,
  phản ánh, tỉ lệ xử lý; dân số/hài lòng/DVC trực tuyến cấu hình ở admin organizations.
- [x] ✅ **Giới thiệu địa phương** — đã thêm trang `/about` (dùng `/get_organization_api`:
  tên, mô tả, kênh OA chính thức) + tile/menu "Giới thiệu". (Lịch sử/cơ cấu/cán bộ do admin nhập.)
- [x] ✅ **YouTube Phường** — đã thêm tile/menu "YouTube Phường" (link, cấu hình được sau).
- [x] ✅ **Điều hướng dịch vụ công / Service Hub** (mục 6.14) — `onOpen` ưu tiên **deep link
  mở app** (`appScheme`) rồi **fallback web** (`webUrl`); admin nhập `appScheme`/`storeUrl`.
  (Phát hiện chính xác app đã cài tùy nền tảng; hiện dùng kỹ thuật iframe + timeout an toàn.)

## C. Checklist hạ tầng "thật" (bắt buộc trước production)

- [ ] ⛔ **Xác thực token Zalo cho API public** — hiện API public chưa xác thực người dùng Zalo.
- [ ] ⛔ **Gửi OTP thật qua Zalo OA (ZNS)** — đã chừa hàm `sendOtpViaZalo`, hiện DEV trả OTP;
  cần `ZALO_OA_TOKEN` + template ZNS (dùng cho cổng đại biểu phòng họp số).
- [ ] ⛔ **Ký số thật PKI/CA (VGCA / USB token)** — hiện ký mô phỏng (hash nội dung).
- [ ] 🟡 **Chuyển frontend từ mock → API thật** — kiểm chứng cờ môi trường (`.env.production`)
  để store gọi service thật thay vì mock khi build production.
- [ ] 🟡 **Đọc trực tiếp file `.xlsx`** cho import báo cáo (hiện dán CSV/TSV; nâng cấp SheetJS).
- [ ] ⛔ **Bản đồ quy hoạch dạng WebGIS/lớp bản đồ** (gắn với B2 mục quy hoạch).

## D. Rà soát sâu

### D1. Chatbot AI dịch vụ công

**Hiện trạng — đã có:**

- Frontend `pages/Chatbot/ChatbotPage.tsx`: UI chat hoàn chỉnh (bong bóng người dùng/bot,
  chip gợi ý điều hướng, ô nhập, trạng thái "Đang soạn trả lời…", auto-scroll).
- Backend `api/src/public.js`: `POST /chatbot/sessions` (cấp sessionId) và
  `POST /chatbot/messages` (rate limit 30 req/phút).
- Luồng trả lời 3 bước: (1) khớp **thủ tục hành chính** → trả lĩnh vực, cơ quan, lệ phí,
  thời hạn, thành phần hồ sơ + gợi ý "Xem chi tiết" / "Nộp trực tuyến"; (2) khớp **FAQ**
  (`guidelines`); (3) **fallback** → gợi ý tra cứu thủ tục + đường dây nóng.
- Đáp ứng tốt mục 6.2: entry point, chat UI, trả lời dựa kho thủ tục, fallback có gợi ý
  liên quan, không nhét thông tin cá nhân vào prompt.

**Hạn chế cốt lõi — chưa đạt "AI":**

- Cơ chế khớp là `matchKeyword`: bỏ dấu tiếng Việt rồi kiểm tra **toàn bộ câu** người dùng
  có phải **chuỗi con** của tên/lĩnh vực/mã thủ tục hay không.
- Hệ quả: chỉ hoạt động khi người dùng gõ **đúng từ khóa ngắn** (vd "khai sinh").
  Câu hỏi ngôn ngữ tự nhiên như *"Làm khai sinh cần giấy tờ gì?"* sẽ **KHÔNG khớp**
  (vì cả câu không phải chuỗi con của "đăng ký khai sinh") → rơi vào fallback.
- Không có: hiểu ý định (intent), đồng nghĩa/viết tắt, xếp hạng độ liên quan, hội thoại
  nhiều lượt theo ngữ cảnh, lưu log hội thoại để thống kê (mục 6.2 có nêu "chat session logs").
- Chưa có fallback "nhắn tin OA / cán bộ đang online" như mô tả (mới có gợi ý hotline).

**Đề xuất nâng cấp (tăng dần):**

1. **Cải thiện khớp không cần LLM** (nhanh, rẻ): tách câu thành token, bỏ stopword,
   chấm điểm theo số token trùng + đồng nghĩa/từ viết tắt, trả top-N thủ tục liên quan
   thay vì 1 kết quả. Giải quyết ~80% câu hỏi từ khóa.
2. **Tích hợp LLM thật** (đúng nghĩa "AI"): RAG trên kho thủ tục + FAQ đã kiểm duyệt
   (embedding + truy hồi → LLM tóm tắt/trả lời, kèm trích nguồn). Cần khóa API LLM,
   kiểm soát chi phí, cache câu trả lời, disclaimer "đối chiếu văn bản gốc".
3. **Bổ sung**: lưu `chat_session_logs` (ẩn danh) để thống kê câu hỏi phổ biến;
   fallback chuyển tiếp OA/cán bộ; chính sách lưu/không lưu hội thoại rõ ràng.

**Tiêu chí nghiệm thu gợi ý:**
trả lời đúng cho ≥90% mẫu câu hỏi ngôn ngữ tự nhiên về 10 thủ tục phổ biến nhất;
luôn có gợi ý điều hướng; có disclaimer khi dùng AI tóm tắt.

### D2. Thư viện pháp luật (mục 6.13)

**Hiện trạng:** ⛔ **chưa xây gì** — không có route `/legal-library`, không có page,
không có endpoint API, không có bảng/seed dữ liệu. (Chỉ tồn tại field `legalBasis?`
trong `types/index.ts`, không liên quan.)

**Phân biệt với "Kho văn bản điện tử" (mục 6.7 — đã có):**
mục 6.7 lưu **văn bản nội bộ địa phương** (nghị quyết Đảng ủy/HĐND).
Thư viện pháp luật lưu **văn bản quy phạm pháp luật chung** (Luật, Nghị định, Thông tư…)
để người dân tra cứu pháp lý → **module riêng**, không gộp được.

**Khối lượng cần xây (đầy đủ theo 6.13):**

- **Data model** `legal_documents`: tiêu đề, số hiệu, loại văn bản (Luật/Nghị định/
  Thông tư/Quyết định/Công văn), lĩnh vực, cơ quan ban hành, ngày ban hành/hiệu lực,
  **trạng thái hiệu lực** (còn/hết/sửa đổi bổ sung), nội dung hoặc file đính kèm,
  **diễn giải dễ hiểu** (biên tập viên soạn), **tóm tắt AI** (có kiểm duyệt).
- **API public**: `GET /legal-documents` (lọc theo lĩnh vực + loại, tìm có dấu/không dấu
  theo tiêu đề/số hiệu), `GET /legal-documents/:id`.
- **Admin CMS**: thêm `legalDocuments` vào `RESOURCE_TABLE` (CRUD + phân quyền + upload file);
  bước duyệt/khóa tóm tắt AI trước khi public.
- **Frontend**: route `/legal-library` (+ `/legal-library/:id`), trang danh sách có bộ lọc
  lĩnh vực/loại + tìm kiếm, trang chi tiết (xem/tải file, hiển thị diễn giải + tóm tắt AI
  kèm disclaimer "đối chiếu văn bản gốc"); thêm icon vào menu trang chủ.
- **Tóm tắt AI**: chỉ tóm tắt trên tài liệu chính thống đã kiểm duyệt; cache kết quả;
  có disclaimer; có bước duyệt trước khi hiển thị.

**Ước lượng:** đây là hạng mục lớn nhất còn thiếu — tương đương một domain hoàn chỉnh
(model + API + admin CRUD + 2 trang FE), cộng phần tóm tắt AI (phụ thuộc khóa LLM,
có thể làm sau, để trống ban đầu).

## E. Thứ tự đề xuất triển khai

1. ✅ Thư viện pháp luật (D2) — phần CRUD + tra cứu (chưa cần AI tóm tắt). **Đã làm.**
2. ✅ Nâng cấp Chatbot bước 1 (khớp token + top-N) — chi phí thấp, hiệu quả cao. **Đã làm.**
3. ✅ Trang Giới thiệu + YouTube. (Bản đồ quy hoạch, trang mẫu đơn riêng — còn lại.)
4. ⏳ Hạ tầng production: xác thực token Zalo, OTP qua Zalo OA, ký số PKI thật (cần khóa thật).
5. ⏳ (Tùy chọn) Chatbot LLM/RAG + tóm tắt AI cho thư viện pháp luật.

## F. Đã hoàn thành (2026-06-14) — file thay đổi

**Thư viện pháp luật (đầy đủ):**
- Backend: `api/src/migrate.js` (+bảng `legal_documents`), `api/src/repo.js` (+repo +
  RESOURCE_TABLE `legalDocuments`), `api/src/auth.js` (+quyền content_editor),
  `api/src/public.js` (API `GET /legal_documents_api` + `/:id`, lọc field/docType/status +
  tìm có dấu/không dấu), `api/src/seed.js` (+nạp seed), `api/seed-data/legal.json` (8 văn bản
  mẫu), `api/public/admin.html` (mục Admin CRUD "Thư viện pháp luật").
- Frontend: `types/index.ts` (`LegalDocument`/`LegalDocuments`/`LegalDocumentStatus`),
  `constants/common.ts` (API + ROUTES + `LEGAL_FIELDS`/`LEGAL_DOC_TYPES`/`LEGAL_STATUS_LABEL`),
  `service/egov.services.ts` + `egov.services.mock.ts` (`getLegalDocuments`/`...Detail`),
  `store/egovSlice.ts` (state + actions), `pages/LegalLibrary/*` (danh sách có bộ lọc +
  chi tiết kèm diễn giải/tóm tắt + disclaimer), `pages/index.tsx` (routes),
  `constants/utinities.ts` (menu "Thư viện pháp luật").

**Chatbot AI (bước 1):** `api/src/public.js` — thay khớp-cả-câu bằng `tokenize` (bỏ dấu +
bỏ từ dừng) + `scoreByTokens` (chấm điểm token trùng) → trả thủ tục liên quan nhất + top-N
gợi ý; bổ sung nhánh tra cứu Thư viện pháp luật và FAQ; fallback có thêm lối vào pháp luật.
Đã test thuật toán: "Làm khai sinh cần giấy tờ gì?" → khớp đúng "Đăng ký khai sinh".

**Giới thiệu + YouTube:** `pages/About/*` (trang `/about` dùng organization API),
`pages/index.tsx` (route), `constants/utinities.ts` (menu "Giới thiệu" + "YouTube Phường").

**Đợt 2 (tiếp theo):**
- **Mẫu đơn (lối vào riêng):** `pages/Documents/DocumentsPage.tsx` (đọc `type` từ navState),
  `types/index.ts` + `components/utilities/*` (plumbing `navState`), tile/menu "Mẫu đơn, tờ khai".
- **Bản đồ quy hoạch:** `pages/Planning/PlanningPage.tsx` (ảnh `imageUrl` + nút mở `mapUrl`),
  `types/index.ts` (`imageUrl`/`mapUrl`), `api/seed-data/egov.json` (doc-005), `api/public/admin.html`.
- **Service Hub deep link:** `pages/ServiceHub/ServiceHubPage.tsx` (appScheme→fallback web),
  `api/public/admin.html` (trường `appScheme`/`storeUrl`).
- **Trang chủ thông minh:** `api/src/public.js` (`/home_stats_api`), `types/index.ts` (`HomeStats`),
  `service/egov.services*.ts`, `store/egovSlice.ts` (`getHomeStats`), `pages/Home/StatsSection.tsx`,
  `api/public/admin.html` (organizations + population/area/satisfaction/onlineServiceRate).
- **Tích hợp giao diện home mới:** `constants/home-tiles.ts` (tiles Pháp luật/Giới thiệu/YouTube +
  field `link`), `components/home/HomeWidgets.tsx` (TileGrid mở link ngoài), `pages/Home/HomePage.tsx`
  (render `StatsSection`). *Lưu ý: home đã được refactor sang home-tiles ngoài phiên làm việc.*

**Còn lại (không làm được nếu thiếu khóa/hạ tầng thật):**
- Gửi OTP thật qua **Zalo OA (ZNS)** — cần `ZALO_OA_TOKEN` + template (đã chừa hàm stub).
- **Ký số PKI/CA thật** (VGCA/USB token) — hiện ký mô phỏng (hash).
- **Xác thực token Zalo** cho API public; deep link app thật cần kiểm thử trên thiết bị.
- **Chatbot LLM/RAG** + **tóm tắt AI** thư viện pháp luật — cần khóa LLM (đã có nhập tay + disclaimer).
- Lớp **WebGIS động** cho quy hoạch; **điền biểu mẫu trực tuyến**; đọc trực tiếp `.xlsx`.

**Kiểm thử:** thuật toán chatbot đã chạy thử (PASS). Do môi trường sandbox chỉ có bản
mirror cũ của một số file lớn, **chưa chạy được `tsc`/`lint`/`test:db` đầy đủ tại đây** —
đề nghị chạy lại ở máy: FE `npx tsc --noEmit && npm run lint && npm test`; BE `cd api &&
npm install && npm run test:db` (hoặc `docker compose up`).
