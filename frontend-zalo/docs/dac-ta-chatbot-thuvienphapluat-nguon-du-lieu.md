# Đặc tả nội dung & nguồn dữ liệu — Chatbot AI và Thư viện pháp luật (cấp Phường/Xã)

> Lập ngày 2026-06-14. Áp dụng cho Zalo Mini App "Tự Lạn Smart" theo mô hình
> **chính quyền địa phương 2 cấp** (Tỉnh + Xã/Phường, vận hành từ 01/7/2025 —
> cấp huyện đã bỏ). Hệ thống đa địa bàn (multi-tenant theo `organizationId`),
> nên dữ liệu chia 2 lớp: **dùng chung toàn quốc/tỉnh** và **riêng từng phường/xã**.

---

## 1. Bối cảnh áp dụng cho cấp Phường/Xã

- Từ 01/7/2025 cả nước theo mô hình 2 cấp; cấp xã/phường tiếp nhận và giải quyết
  phần lớn thủ tục hành chính trực tiếp với người dân (Bộ phận Một cửa cấp xã).
- Cổng Dịch vụ công Quốc gia đã chuyển về **Trung tâm Dữ liệu quốc gia** (vận hành
  tại `dichvucong.gov.vn` từ 29/5/2026) — là nguồn tra cứu thủ tục/dịch vụ công.
- Cơ sở dữ liệu quốc gia về pháp luật phiên bản mới (`vbpl.vn`, khai trương 23/4/2026)
  quản lý chi tiết tới từng điều/khoản, thiết kế để **kết nối với nền tảng số khác**
  → nguồn chuẩn cho Thư viện pháp luật.

→ Hệ quả thiết kế: nội dung **thủ tục hành chính + văn bản pháp luật** lấy từ nguồn
quốc gia/tỉnh (đồng bộ định kỳ), còn **tin tức, lịch công tác, dự án, quy hoạch,
liên hệ** là dữ liệu riêng từng phường/xã (admin nhập hoặc crawl từ cổng TTĐT xã).

---

## 2. Chatbot AI dịch vụ công — kho tri thức gồm những gì

Chatbot không tự "biết" — nó trả lời dựa trên **kho tri thức (knowledge base)** được
nạp/đồng bộ. Với cấp phường/xã, kho gồm các nhóm sau:

### 2.1. Thủ tục hành chính cấp xã/phường (lõi)
Mỗi thủ tục: tên, mã TTHC, lĩnh vực, **cấp thực hiện (xã/phường)**, cơ quan thực hiện,
trình tự thực hiện, thành phần hồ sơ, số lượng bộ hồ sơ, lệ phí, thời hạn giải quyết,
căn cứ pháp lý, mẫu đơn/tờ khai, mức độ DVC trực tuyến (một phần/toàn trình), link nộp.
Trọng tâm nhóm thủ tục dân hỏi nhiều ở cấp xã: **hộ tịch** (khai sinh, khai tử, kết hôn),
**chứng thực** (bản sao, chữ ký, hợp đồng), **cư trú** (phối hợp Công an), **đất đai**
(xác nhận nguồn gốc, hồ sơ ban đầu), **chính sách – an sinh xã hội** (hộ nghèo, người
có công, bảo trợ xã hội, mai táng phí), **kinh doanh** (hộ kinh doanh), chứng nhận khác.

### 2.2. Hỏi – đáp thường gặp (FAQ)
Câu hỏi mẫu theo từng thủ tục ("làm khai sinh cần giấy tờ gì", "lệ phí kết hôn",
"chứng thực ở đâu", "thứ 7 có làm việc không"), kèm câu trả lời đã biên tập.

### 2.3. Thông tin địa phương (riêng từng phường/xã)
Giờ làm việc, địa chỉ trụ sở/Bộ phận Một cửa, sơ đồ, số điện thoại các bộ phận,
lãnh đạo phụ trách, lịch tiếp công dân.

### 2.4. Đường dây nóng & liên hệ
Lãnh đạo UBND, Trung tâm Phục vụ hành chính công, và **số khẩn cấp** (111, 113, 114, 115)
để fallback khi vượt khả năng trả lời.

### 2.5. Tin tức – thông báo (tùy chọn)
Thông báo mới, lịch nghỉ lễ, thay đổi quy trình — để chatbot trả lời cập nhật.

### 2.6. Nhật ký hội thoại (ẩn danh — phục vụ thống kê)
Lưu câu hỏi (không gắn CCCD/SĐT) để thống kê câu hỏi phổ biến, cải thiện kho FAQ.
**Lưu ý bảo mật:** không đưa thông tin cá nhân vào prompt; có chính sách lưu/không lưu rõ ràng.

### 2.7. Mức độ "thông minh" — 3 cấp triển khai
1. **Khớp từ khóa cải tiến** (hiện tại + nâng cấp token/đồng nghĩa/top-N) — không cần LLM.
2. **RAG + LLM**: embedding kho mục 2.1–2.5 → truy hồi đoạn liên quan → LLM trả lời
   bằng ngôn ngữ tự nhiên, **trích nguồn**, kèm disclaimer.
3. **Fallback**: hết khả năng → gợi ý thủ tục liên quan, nhắn tin OA/cán bộ trực, gọi hotline.

---

## 3. Thư viện pháp luật — danh mục & trường thông tin

**Phân biệt rõ với "Kho văn bản điện tử" (đã có):** Kho văn bản điện tử lưu **văn bản
nội bộ địa phương** (Nghị quyết Đảng ủy/HĐND xã). **Thư viện pháp luật** lưu **văn bản
quy phạm pháp luật chung** (Luật, Nghị định, Thông tư, Quyết định…) để dân tra cứu pháp lý.

### 3.1. Phân nhóm theo lĩnh vực (ưu tiên cho dân cấp xã)
Đất đai · Hộ tịch – Cư trú · Chứng thực · Kinh doanh – Hộ kinh doanh · Lao động –
Việc làm · Bảo hiểm xã hội – Bảo hiểm y tế · Xây dựng · Môi trường · An sinh xã hội –
Người có công · Giáo dục · Y tế · Tư pháp – Khiếu nại tố cáo · Thuế – Phí – Lệ phí.

### 3.2. Phân loại theo loại văn bản
Luật · Nghị quyết (QH/HĐND) · Pháp lệnh · Nghị định · Quyết định · Thông tư ·
Thông tư liên tịch · Công văn hướng dẫn · Văn bản hợp nhất.

### 3.3. Phạm vi văn bản nên đưa vào (cấp xã/phường)
- Văn bản trung ương theo các lĩnh vực ở 3.1 (Luật, NĐ, TT).
- Văn bản QPPL của **tỉnh** (HĐND/UBND tỉnh) đang áp dụng tại địa bàn.
- (Tùy chọn) văn bản đặc thù địa phương liên quan trực tiếp người dân.

### 3.4. Trường thông tin mỗi văn bản
Tiêu đề · Số hiệu · Loại văn bản · Lĩnh vực · Cơ quan ban hành · Ngày ban hành ·
Ngày hiệu lực · **Trạng thái hiệu lực** (còn hiệu lực / hết hiệu lực / sửa đổi bổ sung) ·
Nội dung hoặc file đính kèm (xem/tải) · **Diễn giải dễ hiểu** (biên tập viên soạn) ·
**Tóm tắt AI** (có kiểm duyệt, kèm disclaimer "đối chiếu văn bản gốc") · Văn bản liên quan.

### 3.5. Tính năng
Tìm kiếm có dấu/không dấu (tiêu đề, số hiệu) · Lọc theo lĩnh vực + loại + trạng thái
hiệu lực · Chi tiết + xem/tải file · Diễn giải + tóm tắt AI · Cảnh báo khi văn bản hết hiệu lực.

### 3.6. Yêu cầu tóm tắt AI
Chỉ tóm tắt trên văn bản chính thống đã kiểm duyệt · Cache kết quả tránh gọi lặp ·
Có bước duyệt/khóa trước khi public · Luôn kèm disclaimer tham khảo.

---

## 4. Crawl / đồng bộ dữ liệu — nguồn nào, lấy gì

> Nguyên tắc: **ưu tiên nguồn chính thống & API/dịch vụ tích hợp** (.gov.vn), tôn trọng
> điều khoản sử dụng và `robots.txt`; **tránh nguồn thương mại có bản quyền**
> (vd thuvienphapluat.vn, các trang quy hoạch tư nhân). Crawl HTML chỉ là phương án
> dự phòng khi không có API; mọi dữ liệu cần lưu **nguồn + thời điểm đồng bộ** để truy vết.

| Nhóm dữ liệu | Nguồn chính thống | Lấy gì | Cách lấy | Tần suất |
|---|---|---|---|---|
| **Thủ tục hành chính** (chatbot + module TTHC) | Cổng DVC Quốc gia / CSDLQG về TTHC `dichvucong.gov.vn` (Trung tâm Dữ liệu quốc gia); Cổng DVC tỉnh | TTHC cấp xã: mã, tên, lĩnh vực, trình tự, hồ sơ, lệ phí, thời hạn, căn cứ, mẫu đơn, link nộp | API/tích hợp nếu được cấp; nếu không, crawl trang chi tiết TTHC theo mã | Tuần/tháng |
| **Văn bản pháp luật** (Thư viện pháp luật) | CSDLQG về pháp luật `vbpl.vn` (Bộ Tư pháp, bản mới có kết nối nền tảng số); văn bản tỉnh trên `vbpl.vn/[tinh]` | Metadata + nội dung/file văn bản theo lĩnh vực, trạng thái hiệu lực | API/kết nối nếu được cấp; hoặc crawl danh mục theo lĩnh vực | Tuần |
| **Thông tin đấu thầu** | Hệ thống mạng đấu thầu quốc gia `muasamcong.mpi.gov.vn` | Thông báo mời thầu, kết quả lựa chọn nhà thầu, mua sắm công của địa bàn | Crawl/đọc thông tin công khai theo bên mời thầu/khu vực | Ngày/tuần |
| **Tin tức – sự kiện** | Cổng TTĐT phường/xã & tỉnh; Fanpage/Zalo OA địa phương | Bài viết, thông báo, sự kiện | Crawl RSS/HTML cổng TTĐT; hoặc admin đăng tay | Ngày |
| **Lịch công tác / tiếp dân** | Cổng TTĐT phường/xã | Lịch lãnh đạo, lịch họp, lịch tiếp công dân | Crawl mục lịch; hoặc admin nhập | Tuần |
| **Dự án đầu tư công** | Cổng TTĐT tỉnh/phường; cổng đầu tư công | Danh mục dự án, chủ đầu tư, tiến độ, vốn | Crawl/nhập tay | Tháng |
| **Thông tin quy hoạch** | Cổng quy hoạch/TTĐT tỉnh; bản đồ quy hoạch của tỉnh | Văn bản quy hoạch + ảnh/lớp bản đồ quy hoạch sử dụng đất | Tải văn bản + nhúng/đồng bộ bản đồ; admin nhập | Khi có cập nhật |
| **Mẫu đơn, tờ khai** | Theo từng TTHC trên Cổng DVC | File biểu mẫu (.doc/.pdf) gắn với thủ tục | Lấy kèm khi đồng bộ TTHC | Theo TTHC |

### 4.1. Pipeline đồng bộ đề xuất
Nguồn → **Connector/Crawler** (mỗi nguồn 1 adapter) → **Chuẩn hóa** về schema nội bộ
(map trường, bỏ dấu để search) → **Khử trùng lặp** (theo mã TTHC/số hiệu văn bản) →
**Hàng đợi kiểm duyệt** (biên tập viên duyệt/sửa diễn giải) → **Tóm tắt AI** (nếu bật) →
**Publish** xuống CSDL Mini App. Lưu `source_url`, `synced_at`, `checksum` để cập nhật incremental.

### 4.2. Lưu ý pháp lý & kỹ thuật
- Xin/đăng ký quyền kết nối API với đơn vị chủ quản (Trung tâm Dữ liệu quốc gia, Bộ Tư pháp,
  Sở/Cổng tỉnh) thay vì crawl ẩn — vừa hợp lệ vừa ổn định.
- Có cron job + cảnh báo khi nguồn đổi cấu trúc; giữ bản ghi lịch sử để rollback.
- Văn bản pháp luật: luôn hiển thị trạng thái hiệu lực + ngày đồng bộ, tránh dùng nội dung lỗi thời.

---

## 5. Bổ sung data model & API (tóm tắt cho lập trình)

- **`legal_documents`** (Thư viện pháp luật): các trường ở mục 3.4; thêm vào
  `RESOURCE_TABLE` (Admin CRUD + phân quyền + upload). API public:
  `GET /legal-documents` (lọc lĩnh vực/loại/hiệu lực + tìm có dấu/không dấu),
  `GET /legal-documents/:id`. FE: `/legal-library`, `/legal-library/:id`.
- **`chat_knowledge`** (tùy chọn): gom thủ tục + FAQ + thông tin địa phương cho RAG;
  hoặc tái dùng `procedures` + `guidelines` hiện có.
- **`chat_session_logs`** (ẩn danh): câu hỏi, kết quả khớp, thời gian — phục vụ thống kê.
- **`sync_sources` / `sync_runs`**: cấu hình nguồn crawl + nhật ký mỗi lần đồng bộ.

---

## 6. Việc cần chốt trước khi build
1. Địa bàn áp dụng đầu tiên (phường/xã + tỉnh) để lấy đúng cổng TTĐT và danh mục TTHC.
2. Có được cấp **API/quyền kết nối** từ Cổng DVC quốc gia và vbpl.vn không, hay phải crawl HTML.
3. Có bật **tóm tắt AI** (LLM) ngay không, hay làm CRUD + tra cứu trước rồi bổ sung AI sau.
4. Phạm vi văn bản pháp luật đưa vào (chỉ lĩnh vực dân cấp xã hay đầy đủ).
