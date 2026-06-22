# Kiến trúc triển khai cho nhiều Phường/Xã

> Lập ngày 2026-06-14. Trả lời: mỗi phường/xã cấu hình thế nào để triển khai, và
> triển khai số lượng lớn (toàn tỉnh / toàn quốc) thì kiến trúc ra sao.
> Bối cảnh: chính quyền 2 cấp (Tỉnh + Xã/Phường); cả nước ~3.300 đơn vị cấp xã.

---

## 1. Hiện trạng code (điểm xuất phát)

**Hệ thống đang là ĐƠN TENANT — 1 bản triển khai = 1 phường:**

- Chỉ có **1** bản ghi `organization` (`org1` — "UBND phường X"); dùng làm **nội dung
  giới thiệu**, không phải khóa phân tách dữ liệu.
- Các bảng nội dung (procedures, news, reflections, meetings…) **không có trường
  `organizationId`** → không thể phân tách dữ liệu nhiều phường trong cùng 1 CSDL.
- `neighborhoodGroup` chỉ là **tổ dân phố trong 1 phường** (scope nội bộ), không phải địa bàn.
- Mini App định danh ở **build-time** qua `.env`: `VITE_BASE_URL` (backend nào) +
  `VITE_MINI_APP_ID` (Mini App Zalo nào). 1 build trỏ tới 1 backend của 1 phường.

→ Muốn triển khai nhiều phường phải chọn 1 trong 2 hướng dưới đây; hướng khuyến nghị
cần **bổ sung tính đa tenant** vào CSDL và API.

---

## 2. Hai mô hình triển khai

### Mô hình A — Đa tenant dùng chung (KHUYẾN NGHỊ cho quy mô lớn)

Một hệ thống dùng chung phục vụ tất cả phường/xã; phân tách dữ liệu bằng `organizationId`.

- **1 Mini App** (hoặc 1 Mini App / tỉnh) + **1 backend + 1 CSDL** dùng chung.
- Mỗi phường = **1 bản ghi tenant** (`organizations`) + dữ liệu gắn `organizationId`.
- App nhận diện phường đang xem qua tham số (QR/deeplink), GPS, hoặc người dùng chọn.
- Cập nhật nội dung dùng chung (thủ tục, văn bản pháp luật) **một lần, áp cho tất cả**;
  nội dung riêng (tin tức, đường dây nóng, lịch) do từng phường tự quản.

**Ưu:** thêm 1 phường chỉ là thêm 1 bản ghi (vài phút); cập nhật tập trung; chi phí thấp;
đúng tinh thần "triển khai đồng bộ toàn tỉnh".
**Nhược:** phải refactor đa tenant; một thương hiệu Mini App dùng chung (xử lý bằng theme
+ logo theo tenant); cần thiết kế cách ly dữ liệu chặt để tránh rò rỉ chéo.

### Mô hình B — Mỗi phường một bản riêng (instance-per-tenant)

Mỗi phường có Mini App ID riêng (dưới OA riêng) + backend/CSDL riêng (hoặc tách schema).

**Ưu:** cách ly tuyệt đối; mỗi phường tự chủ OA, thương hiệu.
**Nhược:** **không mở rộng được** ở quy mô hàng trăm–nghìn (phải đăng ký & duyệt từng
Mini App với Zalo, vận hành hàng trăm deployment, vá lỗi/nâng cấp lặp lại). Chỉ hợp khi
số lượng rất ít hoặc làm thí điểm.

### Mô hình đã chốt — Triển khai theo 2 giai đoạn

> Quyết định ngày 2026-06-14: **Không triển khai đồng loạt hết phường/xã.**
> **Giai đoạn 1 (hiện tại): mỗi phường = 1 instance độc lập (1 Mini App + 1 backend + 1 CSDL riêng).**
> **Giai đoạn 2 (sau): gộp đa tenant cấp tỉnh/toàn quốc — "tỉnh tính sau".**

**Giai đoạn 1 — Instance độc lập từng phường (làm ngay):**

- Mỗi phường/xã = **một bản triển khai trọn gói riêng**: Mini App Zalo riêng (OA riêng) +
  backend (`api/`) riêng + **một database riêng, tách biệt hoàn toàn** cho từng phường.
- **Mỗi phường 1 database:** không dùng chung dữ liệu, không cần cột `organizationId` để
  phân tách (chính database đã là ranh giới phường) → cách ly tuyệt đối, đơn giản, an toàn.
- **Đúng với code hiện tại** (đang đơn tenant) → **chưa cần refactor `organizationId`**.
- Cấu hình mỗi phường nằm ở: `.env` của Mini App (`VITE_BASE_URL` = backend của phường,
  `VITE_MINI_APP_ID` = Mini App ID của phường) + dữ liệu seed (organization, hotline,
  trụ sở, lịch, TTHC…) trong backend của phường.
- Triển khai dần từng phường (pilot → nhân rộng), không phụ thuộc control plane cấp tỉnh.

**Ưu:** đơn giản, cách ly tuyệt đối, dùng được ngay với code hiện có; mỗi phường tự chủ OA & dữ liệu.
**Nhược cần lưu:** (1) **nội dung dùng chung (TTHC, pháp luật, mẫu đơn) bị nhân bản** ở mỗi
phường — tạm chấp nhận, seed từ một bộ mẫu chuẩn; (2) **vá lỗi/nâng cấp phải áp cho từng
instance** → bắt buộc chuẩn hóa triển khai (Docker/IaC + 1 codebase + config) để cập nhật theo lô;
(3) đăng ký + kiểm duyệt Mini App cho mỗi OA với Zalo là thủ công, làm dần theo từng phường.

**Giữ tương thích cho giai đoạn 2 (rẻ, làm ngay):** mỗi instance vẫn lưu `code`/`provinceCode`
trong bản ghi `organization` để **sau này gom các CSDL phường vào một CSDL đa tenant
(`organizationId`) dễ dàng**, không phải sửa lại mô hình dữ liệu từ đầu.

Phần đa tenant dùng chung (control plane, shared DB + `organizationId`, sơ đồ ở trên) là
**định hướng giai đoạn 2** — mô tả trong các mục dưới để tham khảo, chưa triển khai bây giờ.

---

## 3. Cấu hình cho TỪNG Phường/Xã (bản ghi tenant)

Mỗi phường/xã cấu hình bằng **một bản ghi `organization`** (do tỉnh tạo qua control plane
hoặc admin tỉnh). Các trường cấu hình đề xuất:

**Định danh & địa bàn**
- `id`, `code` (mã đơn vị hành chính chuẩn), `provinceCode`, `name` (UBND phường/xã …),
  `shortName`, `level` (phường/xã/đặc khu).

**Thương hiệu (branding)**
- `logoUrl`, `coverUrl`, `themeColor`, tiêu đề hiển thị, ảnh banner mặc định.

**Liên hệ & vị trí**
- Địa chỉ trụ sở, **tọa độ (lat/lng)** cho bản đồ, giờ làm việc, email, Cổng TTĐT,
  Fanpage, **Zalo OA** của phường (để tin nhắn/ZNS/OTP).

**Đường dây nóng**
- Danh sách số: lãnh đạo (Chủ tịch/Phó CT), Một cửa, + số khẩn cấp chung (111/113/114/115).

**Nội dung dùng chung vs riêng** (xem mục 5).

**Tích hợp**
- `zaloOaId`, `zaloOaToken` (gửi ZNS/OTP), link Cổng DVC tỉnh, mã tra cứu TTHC theo tỉnh.

**Trạng thái**
- `status` (nháp / đang chạy / tạm dừng), `publishedAt`, người quản trị phụ trách.

---

## 4. Cách Mini App xác định "đang ở phường/xã nào"

**Giai đoạn 1 (mỗi phường 1 Mini App + 1 backend + 1 database riêng):** không cần định tuyến
tenant. Mini App của phường chỉ trỏ tới **backend của phường mình** (`VITE_BASE_URL`), backend
đó nói chuyện với **database riêng của phường** → toàn bộ dữ liệu trả về đã là của đúng phường.

QR/deeplink vẫn dùng để **phân phối đúng Mini App của phường** (in/dán tại trụ sở, đăng lên
Cổng TTĐT/Fanpage), không phải để chọn tenant.

> (Tham khảo giai đoạn 2 — nếu gộp về 1 app/backend dùng chung: khi đó mới cần resolve tenant
> theo deeplink `?org` → lựa chọn đã lưu → GPS → màn hình chọn Tỉnh/Phường.)

---

## 5. Chiến lược nội dung: dùng chung vs riêng từng phường

| Loại nội dung | Phạm vi | Nguồn | Ai cập nhật |
|---|---|---|---|
| Thủ tục hành chính | Dùng chung theo **tỉnh** (cấp xã áp dụng chung) | Cổng DVC QG/tỉnh (đồng bộ) | Tỉnh/hệ thống |
| Thư viện pháp luật | Dùng chung (trung ương + tỉnh) | vbpl.vn (đồng bộ) | Tỉnh/hệ thống |
| Mẫu đơn, tờ khai | Theo thủ tục (dùng chung) | Kèm TTHC | Tỉnh/hệ thống |
| Đấu thầu | Theo địa bàn | muasamcong | Đồng bộ/tỉnh |
| Tin tức, thông báo | **Riêng từng phường** | Phường nhập/crawl TTĐT xã | Phường |
| Đường dây nóng, trụ sở, giờ làm việc, giới thiệu | **Riêng từng phường** | Phường nhập | Phường |
| Lịch công tác, tiếp dân | **Riêng từng phường** | Phường nhập | Phường |
| Đặt lịch, phản ánh, khảo sát | **Riêng từng phường** (dữ liệu người dân) | Phát sinh trong app | Phường xử lý |
| Quy hoạch, dự án | Theo địa bàn (tỉnh/phường) | Tỉnh/phường nhập | Tỉnh/phường |

→ Thiết kế: thủ tục/pháp luật/mẫu đơn nằm ở **kho dùng chung cấp tỉnh** (không nhân bản
theo phường); phường chỉ ghi đè/bổ sung phần riêng. Giảm trùng lặp, cập nhật một nơi.

---

## 6. Phân quyền quản trị đa tenant

- **Control plane (cấp tỉnh / hệ thống):** tạo phường mới, cấu hình tenant, quản kho
  dùng chung (TTHC, pháp luật), giám sát toàn tỉnh.
- **Admin phường/xã:** chỉ thấy & quản dữ liệu **của phường mình** (lọc theo `organizationId`).
  Tái dùng cơ chế data-scope hiện có (`admin_users.scope`) nhưng nâng từ "tổ dân phố"
  lên "organizationId".
- **Vai trò trong phường:** giữ RBAC hiện tại (super_admin, content_editor, feedback_officer,
  ward_officer, meeting_clerk) nhưng **đóng khung trong tenant**.

---

## 7. Kiến trúc khi triển khai SỐ LƯỢNG LỚN

**Tách mặt phẳng:**
- **Control plane:** đăng ký/khởi tạo tenant, cấu hình, đồng bộ kho dùng chung, dashboard giám sát.
- **Data plane:** API + CSDL phục vụ runtime của các phường (theo tenant).

**Cách ly dữ liệu (chọn theo quy mô):**
- *Shared DB + cột `organizationId`* (đơn giản, mở rộng tốt tới hàng nghìn tenant nhỏ) — **khuyến nghị**.
- *Schema/DB theo tỉnh* (cách ly mạnh hơn, hợp khi mỗi tỉnh là một chủ quản dữ liệu).
- Bắt buộc: **mọi truy vấn phải lọc `organizationId`** (middleware ép tenant) để tránh rò rỉ chéo.

**Hiệu năng & vận hành:**
- Cache nội dung dùng chung (TTHC, pháp luật) + CDN cho file/mẫu đơn/ảnh.
- Đồng bộ dữ liệu nguồn (mục crawl) chạy **một lần ở cấp tỉnh**, không lặp theo phường.
- Quan trắc theo tenant (lượt dùng, lỗi), rate-limit, sao lưu, kế hoạch khôi phục.
- Triển khai hạ tầng dạng tham số hóa (IaC) để dựng instance tỉnh mới nhanh, đồng nhất.

**Zalo Mini App / OA ở quy mô lớn (theo mô hình đã chốt — mỗi phường 1 Mini App + OA riêng):**
- **1 codebase duy nhất** cho mọi Mini App; mỗi phường chỉ khác **config** (`organizationId`,
  Mini App ID, OA). Branding + nội dung lấy từ backend theo `organizationId` → không sửa code.
- **CI/CD sinh bản build theo phường** từ bản ghi tenant (đọc config → đóng gói → nộp lên
  Mini App tương ứng). Mục tiêu: thêm phường = thêm 1 bản ghi + 1 lần đăng ký Zalo.
- **Đăng ký & kiểm duyệt Mini App cho mỗi OA với Zalo là thủ công, không tránh được** ở
  quy mô ~3.300 đơn vị → làm **theo lô** (ưu tiên theo tỉnh), có người điều phối với Zalo;
  cân nhắc gói/đối tác Zalo nếu có hỗ trợ đăng ký số lượng lớn.
- Vá lỗi/nâng cấp code: build lại từ 1 codebase và phát hành đồng loạt.
- Mỗi phường lưu **OA + token riêng** trong bản ghi tenant để gửi tin/ZNS/OTP dưới danh nghĩa phường.

**Quy mô toàn quốc — phân tách theo tỉnh trong cùng hệ thống:**
- Shared DB + `organizationId`, thêm `provinceCode` để **phân vùng/sharding** khi dữ liệu lớn.
- Một **control plane chung toàn quốc** quản tenant của mọi tỉnh; phân quyền chủ quản theo tỉnh.
- Kho dùng chung (TTHC, pháp luật) có thể chia theo tỉnh nhưng dùng chung cơ chế đồng bộ.

---

## 8. Quy trình onboarding một phường/xã mới (mục tiêu: vài phút)

1. Admin tỉnh tạo tenant: nhập mã đơn vị, tên, tọa độ, logo, theme, OA, hotline.
2. Hệ thống tự gắn kho dùng chung của tỉnh (TTHC, pháp luật, mẫu đơn) cho tenant.
3. Phường nhập nội dung riêng: giới thiệu, lịch công tác, tin tức đầu tiên.
4. Tạo tài khoản admin phường (scope = organizationId) + phân vai trò.
5. Hệ thống sinh **QR/deeplink** `?org=<code>` → phường in/dán & đăng lên TTĐT/Fanpage.
6. Kiểm thử checklist → đặt `status = đang chạy` → công khai.

---

## 9. Việc cần làm

### Giai đoạn 1 — Instance độc lập từng phường (làm ngay)
- [ ] **Chuẩn hóa triển khai 1 phường:** Docker Compose/IaC cho `api/` + CSDL; tham số hóa qua `.env`.
- [ ] **Bộ seed mẫu chuẩn:** dữ liệu khung (TTHC, pháp luật, mẫu đơn, số khẩn cấp) để nạp nhanh
      cho phường mới; phần riêng (organization, hotline, trụ sở, lịch) nhập theo phường.
- [ ] **Quy trình onboarding 1 phường:** dựng backend → seed → tạo Mini App + OA riêng →
      set `.env` (`VITE_BASE_URL`, `VITE_MINI_APP_ID`) → build → đăng ký Zalo → công khai.
- [ ] **Tương thích giai đoạn 2:** giữ `code`/`provinceCode` trong bản ghi `organization`
      mỗi instance để sau gom dữ liệu dễ.
- [ ] (Khuyến nghị) 1 codebase + CI sinh build theo phường để cập nhật/vá lỗi theo lô.

### Giai đoạn 2 — Gộp đa tenant cấp tỉnh/toàn quốc ("tỉnh tính sau")
- [ ] Thêm `organizationId` vào mọi bảng + middleware ép tenant; gom CSDL phường vào shared DB.
- [ ] Nâng data-scope admin `neighborhoodGroup` → `organizationId`; control plane quản tenant đa tỉnh.
- [ ] Tách kho dùng chung (TTHC, pháp luật) ra cấp tỉnh để hết nhân bản; cache/CDN; quan trắc theo tenant.

---

## 10. Quyết định đã chốt (2026-06-14)

1. **Không triển khai đồng loạt** hết phường/xã của các tỉnh.
2. **Giai đoạn 1: mỗi phường = 1 Mini App + 1 backend + 1 CSDL độc lập** (đúng code hiện tại,
   chưa cần refactor `organizationId`). Triển khai dần từng phường.
3. Zalo OA: **OA riêng từng phường**.
4. **Cấp tỉnh / đa tenant: tính sau (giai đoạn 2)** — chỉ giữ tương thích dữ liệu để gộp về sau.

→ Hiện tại: **mỗi phường một bản triển khai độc lập, chuẩn hóa để nhân rộng dần.**
