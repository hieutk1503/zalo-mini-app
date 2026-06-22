# Kế hoạch triển khai eGov DSS / Resident Group (đợt mở rộng)

Tài liệu ngắn này định hướng đợt build mở rộng **eGov DSS / Resident Group** trên
nền Zalo Mini App hiện có. Không viết lại app, không đổi stack, không xoá module cũ.

Nguồn: `egov-dss-system-analysis.md`, `egov-dss-ui-admin-functional-spec.md`,
`egov-dss-ui-design-system.md` (và `requirements-analysis.md`, `implementation-plan.md`).

## 1. Hiện trạng (đã có)

- **Nền tảng Phase 0 đã xong** (xem `build-notes.md`): `.env.*`, bỏ token giả
  `"ACCESS_TOKEN"` (dùng `VITE_DEV_TOKEN`), encoding tiếng Việt đã chuẩn UTF-8,
  adapter `@service` chọn mock/real theo `VITE_USE_MOCK`, retry sau refresh token.
- **Module dịch vụ công lõi**: thủ tục, văn bản/mẫu đơn, đường dây nóng, bản đồ
  trụ sở, lịch công tác, khảo sát hài lòng, dự án, đấu thầu, chatbot.
- **Backend + Admin CMS** ở project riêng.

## 2. Còn thiếu (lớp eGov DSS / Resident Group)

| Nhóm | Trạng thái |
| --- | --- |
| Design tokens trạng thái trong `tailwind.config.js` | Thiếu |
| Component dùng chung (StatusBadge, SectionCard, EmptyState, FilterBar, DataList) | Thiếu |
| **P0**: Cư dân, Hộ dân, Duyệt cư dân/hộ dân | Thiếu |
| **P0**: Phản ánh nâng cao (workflow), Thông báo nhanh | Thiếu |
| **P1**: Khảo sát (admin), Cuộc thi, Cuộc họp, Nhóm cộng đồng, Thu, Chi | Thiếu |
| **P2**: DSS dashboard, nhập liệu báo cáo, phòng họp số | Thiếu (web admin) |

## 3. Phạm vi đợt này

**Nền tảng + Cư dân / Hộ dân / Duyệt thông tin** (lõi Resident Group).

1. Chuẩn hoá `tailwind.config.js` (thêm token, giữ token cũ).
2. Component dùng chung + `src/constants/status.ts` + icon Cư dân/Hộ dân/Duyệt.
3. Types + constants (routes/api/tổ dân phố) cho Resident Group.
4. Mock data giả `src/mock/resident-group.json` + service mock/real tách sạch.
5. Store slice `residentGroupSlice`.
6. Màn hình **Cư dân**: danh sách (summary + tab trạng thái) / chi tiết / form.
7. Màn hình **Hộ dân**: danh sách / chi tiết (tab thành viên) / form.
8. Màn hình **Duyệt**: hàng đợi cư dân + hộ dân / chi tiết duyệt-từ chối.

Mỗi màn hình: loading + empty + error; badge trạng thái dùng màu thống nhất;
form có validation; mobile-first, card bo góc 8px, không lồng quá 2 cấp card.

## 4. Quy ước

- **Trạng thái phê duyệt** dùng chung (theo spec §3.3): `draft`, `pending`,
  `approved`, `rejected` (+ `processing`, `forwarded`, `completed` cho phản ánh).
- **Route mới** (không xoá route cũ): `/residents`, `/residents/:id`,
  `/residents/create`, `/households`, `/households/:id`, `/households/create`,
  `/approval/residents`, `/approval/households`.
- **Dữ liệu cư dân/hộ dân chỉ là dữ liệu GIẢ** trong `src/mock/resident-group.json`.
  Không đưa dữ liệu cá nhân thật vào repo. CCCD/SĐT hiển thị có **mask** theo vai trò.
- Service không gọi API thật nếu chưa có `VITE_BASE_URL`/`VITE_USE_MOCK=false`.
- Không hardcode token/secret.

## 5. Điểm cần xác nhận nghiệp vụ (TODO, không tự quyết)

- Vai trò thực tế trên Mini App (cư dân vs tổ trưởng) và quyền thêm/sửa/duyệt.
- Quy tắc mask CCCD/SĐT theo từng vai trò.
- Trường chính xác của form cư dân/hộ dân (một số trường trong spec là *đề xuất*).
- Tab đoàn thể/khen thưởng/kỷ luật/tiền án tiền sự: phạm vi hiển thị cho cư dân.

## 6. Ngoài phạm vi đợt này (làm sau)

- Phản ánh nâng cao, Thông báo nhanh (P0 còn lại).
- P1/P2 (khảo sát admin, cuộc thi, cuộc họp, thu/chi, DSS dashboard, phòng họp số).
- Import/Export Excel cư dân/hộ dân (thuộc Web Admin).
