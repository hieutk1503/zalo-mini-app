# Hướng dẫn màu sắc, hình ảnh và giao diện eGov DSS / Resident Group

## 1. Mục đích

Tài liệu này bổ sung phần visual/UI cho các tài liệu:

- `docs/egov-dss-system-analysis.md`
- `docs/egov-dss-ui-admin-functional-spec.md`

Mục tiêu là giúp dev và designer dựng giao diện đẹp, thống nhất cho:

- Zalo Mini App cư dân.
- App/Web mobile cho Ban điều hành khu phố.
- Web Admin/DSS cho lãnh đạo, chuyên viên và quản trị hệ thống.

## 2. Định hướng nhận diện giao diện

Hệ thống thuộc nhóm chính quyền số cấp cơ sở, nên giao diện cần:

- Tin cậy, rõ ràng, dễ đọc.
- Ưu tiên thao tác nhanh trên mobile.
- Màu sắc trang trọng, tránh quá nhiều hiệu ứng.
- Dùng màu để phân biệt trạng thái nghiệp vụ.
- Card/list/form phải nhất quán giữa các module.
- Hình ảnh phải gắn với địa phương, chính quyền, cộng đồng dân cư, dịch vụ công.

Tông nhận diện đề xuất:

- Chủ đạo: xanh dương chính quyền/số hóa.
- Phụ: xanh lá cho thành công/đã duyệt, cam cho cảnh báo/chờ xử lý, đỏ cho lỗi/từ chối.
- Nền: xám rất nhạt để tách khối nội dung.
- Card: trắng, bo góc nhẹ, bóng rất nhẹ hoặc viền mảnh.

## 3. Bảng màu chuẩn

### 3.1. Màu hiện có trong code

Nguồn: `tailwind.config.js`

| Token | Mã màu | Vai trò |
| --- | --- | --- |
| `main` | `#046DD6` | Màu thương hiệu chính, header, nút chính |
| `ui_bg` | `#FFFFFF` | Nền card/section |
| `text_1` | `#141415` | Text chính |
| `text_2` | `#767A7F` | Text phụ |
| `text_3` | `#B9BDC1` | Placeholder/disabled |
| `devider_1` | `#E9EBED` | Divider/line |
| `divider_01` | `#E9EBED` | Divider/line |
| `icon_bg` | `#F5F9FC` | Nền icon |
| `blue_10` | `#EBF4FF` | Nền xanh nhạt |
| `ng_10` | `#F4F5F6` | Nền xám nhạt |
| `ng_20` | `#E9EBED` | Border/nền xám |
| `wth_a70` | `rgba(255,255,255,0.7)` | Text phụ trên nền xanh |
| `blk_a70` | `rgba(0,0,0,0.7)` | Overlay/text đậm |
| `blk_a20` | `rgba(0,0,0,0.2)` | Overlay/border mờ |

### 3.2. Màu bổ sung đề xuất

Nên bổ sung vào `tailwind.config.js` để dùng thống nhất:

| Token đề xuất | Mã màu | Dùng cho |
| --- | --- | --- |
| `primary_700` | `#0359B0` | Hover/active của nút chính |
| `primary_50` | `#EAF4FF` | Nền badge/card xanh nhạt |
| `success` | `#16A34A` | Đã duyệt, hoàn thành, thành công |
| `success_50` | `#EAF8EF` | Nền badge thành công |
| `warning` | `#F59E0B` | Chờ duyệt, đang xử lý |
| `warning_50` | `#FFF7E6` | Nền badge cảnh báo |
| `danger` | `#DC2626` | Từ chối, lỗi, xóa |
| `danger_50` | `#FEECEC` | Nền badge lỗi |
| `info` | `#0284C7` | Thông tin, chuyển tiếp |
| `info_50` | `#E8F6FC` | Nền badge thông tin |
| `surface` | `#F3F5F7` | Nền toàn app/web |
| `border` | `#E5E7EB` | Border chuẩn |

### 3.3. Quy tắc dùng màu

| Thành phần | Màu |
| --- | --- |
| Header Mini App | `main` + ảnh nền header có overlay xanh |
| Primary button | `main`, text trắng |
| Secondary button | nền trắng, border `main`, text `main` |
| Danger button | `danger`, text trắng |
| Link | `main` |
| Icon utility | nền `icon_bg` hoặc `primary_50`, icon `main` |
| Card nền | `ui_bg` |
| Page nền | `surface` hoặc `#EAEBED` hiện có |
| Text chính | `text_1` |
| Text phụ | `text_2` |
| Disabled | `text_3` |

## 4. Màu trạng thái nghiệp vụ

| Trạng thái | Label tiếng Việt | Màu chữ | Màu nền | Ghi chú |
| --- | --- | --- | --- | --- |
| `draft` | Nháp | `text_2` | `ng_10` | Dữ liệu chưa gửi |
| `pending` | Chờ duyệt / Chờ xử lý | `warning` | `warning_50` | Cần người có quyền xử lý |
| `approved` | Đã duyệt | `success` | `success_50` | Thông tin hợp lệ |
| `rejected` | Từ chối | `danger` | `danger_50` | Cần hiển thị lý do |
| `processing` | Đang xử lý | `info` | `info_50` | Phản ánh/việc đang xử lý |
| `forwarded` | Chuyển tiếp | `#7C3AED` | `#F3E8FF` | Đã chuyển phòng ban |
| `completed` | Hoàn thành | `success` | `success_50` | Đã xử lý xong |
| `cancelled` | Đã hủy | `text_2` | `ng_20` | Không còn hiệu lực |
| `overdue` | Quá hạn | `danger` | `danger_50` | Dùng cho báo cáo/việc trễ |

Badge trạng thái:

- Border radius: `999px`.
- Padding: `4px 8px`.
- Font size: `12px`.
- Font weight: `500`.

## 5. Typography

### 5.1. Mini App

Zalo Mini App nên dùng font hệ thống để hiển thị tốt:

- iOS: San Francisco.
- Android: Roboto.
- Fallback: Arial, sans-serif.

Thang chữ:

| Token | Size | Line-height | Dùng cho |
| --- | ---: | ---: | --- |
| `display` | 24px | 32px | Tiêu đề trang đặc biệt/dashboard mobile |
| `title_lg` | 20px | 28px | Tiêu đề màn hình |
| `title_md` | 18px | 26px | Tiêu đề section |
| `body_lg` | 16px | 24px | Nội dung chính |
| `body_md` | 14px | 20px | Text danh sách/form |
| `body_sm` | 13px | 18px | Text phụ |
| `caption` | 12px | 16px | Badge, mô tả ngắn |

### 5.2. Web Admin/DSS

Web admin cần mật độ cao hơn:

| Token | Size | Dùng cho |
| --- | ---: | --- |
| Page title | 24px | Tiêu đề trang |
| Section title | 18px | Tiêu đề khối |
| Table header | 13px | Header bảng |
| Table body | 14px | Nội dung bảng |
| Form label | 13px | Label input |
| Helper text | 12px | Mô tả/lỗi |

## 6. Khoảng cách, bo góc và layout

### 6.1. Spacing

| Token | Giá trị | Dùng cho |
| --- | ---: | --- |
| `xs` | 4px | Khoảng cách icon/text nhỏ |
| `sm` | 8px | Khoảng cách trong item |
| `md` | 12px | Padding item/list |
| `lg` | 16px | Padding section/card |
| `xl` | 24px | Khoảng cách giữa section |
| `2xl` | 32px | Khoảng cách lớn |

### 6.2. Border radius

| Thành phần | Radius |
| --- | ---: |
| Button | 8px |
| Input | 8px |
| Card | 8px |
| Modal/bottom sheet | 12px |
| Badge | 999px |
| Avatar/icon tròn | 999px |

### 6.3. Layout Mini App

Quy tắc:

- Header cố định cao `48px + safe-area`.
- Page padding top tính safe area như code hiện tại.
- Section full width, nền trắng, không lồng quá nhiều card.
- Mỗi section cách nhau 8-12px trên mobile.
- Menu chức năng dùng grid 3 cột hoặc 4 cột tùy màn hình.
- Với menu nhiều tính năng: tối đa 6 item/trang như tài liệu tập huấn, dùng carousel hoặc pagination dots.

### 6.4. Layout Web Admin/DSS

Quy tắc:

- Sidebar trái cho phân hệ.
- Topbar có tên hệ thống, tìm kiếm, thông báo, tài khoản.
- Nội dung chính max width linh hoạt, ưu tiên table.
- Bộ lọc nằm trên bảng, có thể thu gọn.
- Form thêm/sửa nên dùng drawer hoặc modal với module nhỏ; dùng page riêng với form nhiều tab như cư dân/hộ dân.

## 7. Hình ảnh và asset hiện có

Nguồn: `src/assets`

| Asset | Kích thước | Vai trò đề xuất |
| --- | ---: | --- |
| `logo.png` | 1024x1024 | Logo app/chính quyền |
| `header-background.png` | 640x345 | Nền header Mini App |
| `background.png` | 1170x186 | Banner/nền ngang |
| `avatar.png` | 144x144 | Avatar mặc định |
| `thumb.png` | 80x80 | Thumbnail tin tức nhỏ |
| `feedback-thumb.png` | 361x171 | Ảnh mẫu phản ánh |
| `files.png` | 72x73 | Icon mẫu đơn/văn bản |
| `benefits.png` | 72x73 | Icon chế độ/chính sách |
| `location.png` | 72x73 | Icon bản đồ/trụ sở |
| `id-card.png` | 78x79 | Icon CCCD/cư dân |
| `internal-phone.png` | 72x73 | Icon hotline/nội bộ |
| `youtube.png` | 72x73 | Icon YouTube |
| `logo-social-insurance.png` | 78x79 | Icon nghiệp vụ BHXH cũ |
| `social-insurance.png` | 804x1125 | Ảnh minh họa BHXH cũ |

### 7.1. Quy tắc dùng ảnh

- Header nên dùng ảnh nền địa phương hoặc ảnh trụ sở, phủ overlay xanh `rgba(4,109,214,0.85)`.
- Tin tức phải có thumbnail thực tế hoặc placeholder chuẩn.
- Module văn bản/tài liệu dùng icon file, không dùng ảnh trang trí lớn.
- Module phản ánh dùng ảnh người dân upload; nếu không có ảnh, dùng placeholder.
- Module cư dân/hộ dân dùng avatar mặc định nếu chưa có ảnh.
- Dashboard web dùng chart/card, không cần ảnh minh họa lớn.

### 7.2. Ảnh cần bổ sung

Để giao diện đẹp và đúng nghiệp vụ, nên bổ sung:

| Ảnh/icon | Mục đích |
| --- | --- |
| Ảnh trụ sở UBND/phường | Hero/header, trang giới thiệu |
| Ảnh bản đồ/địa điểm | Trang trụ sở, cơ sở hạ tầng |
| Icon cư dân | Module cư dân |
| Icon hộ dân | Module hộ dân |
| Icon duyệt thông tin | Duyệt cư dân/hộ dân |
| Icon phản ánh | Góp ý/phản ánh |
| Icon khảo sát | Survey |
| Icon cuộc thi | Contest |
| Icon cuộc họp | Meeting |
| Icon thu/chi | Finance |
| Icon văn kiện | Documents |
| Icon thông báo | Notifications |
| Icon trợ lý ảo | Chatbot/assistant |
| Placeholder ảnh tin tức | Khi bài viết chưa có ảnh |

## 8. Icon system

### 8.1. Mini App

Nên dùng icon line/filled đồng bộ, kích thước:

- Utility icon: 28-32px trong nền tròn 48-56px.
- List icon: 20-24px.
- Button icon: 18-20px.
- Tab icon: 20-24px.

Màu:

- Icon chính: `main`.
- Icon disabled: `text_3`.
- Icon cảnh báo/lỗi/thành công theo trạng thái.

### 8.2. Web Admin

Nên dùng icon từ một bộ thống nhất như Lucide/Ant Design Icons nếu xây web admin mới.

Nhóm icon đề xuất:

| Module | Icon gợi ý |
| --- | --- |
| Dashboard | BarChart / LayoutDashboard |
| Người dùng | Users |
| Cư dân | UserRound |
| Hộ dân | Home |
| Duyệt | CheckCircle |
| Phản ánh | MessageSquareWarning |
| Văn bản | FileText |
| Khảo sát | ClipboardList |
| Tin tức | Newspaper |
| Thông báo | Bell |
| Cuộc thi | Trophy |
| Cuộc họp | CalendarDays |
| Nhóm cộng đồng | UsersRound |
| Thu | WalletCards |
| Chi | Receipt |
| Phòng họp số | Presentation |
| Trợ lý | Bot |

## 9. Component chuẩn cho Mini App

### 9.1. Header

Hiện code có `HomeHeader`:

- Nền xanh `#046DD6`.
- Ảnh nền `header-background.png`.
- Overlay xanh.
- Logo 32x32.
- Title và tên đơn vị.

Quy chuẩn:

- Trang chủ dùng header có logo + tên app + tên đơn vị.
- Trang con dùng header đơn giản có nút back + title.
- Title tối đa 1 dòng, tên đơn vị tối đa 1 dòng ellipsis.

### 9.2. Utility grid

Dùng cho trang chủ/Xem thêm.

Card item:

- Width: chia 3 cột trên mobile.
- Icon wrapper: 52x52, nền `icon_bg` hoặc `primary_50`, bo tròn.
- Label: 12-13px, 2 dòng tối đa.
- Badge nhỏ nếu có thông báo/chờ duyệt.

Màu icon theo nhóm:

| Nhóm | Màu |
| --- | --- |
| Cư dân/hộ dân | `main` |
| Duyệt/chờ duyệt | `warning` |
| Phản ánh | `danger` hoặc `warning` |
| Văn bản/tin tức | `info` |
| Khảo sát/cuộc thi | `#7C3AED` |
| Thu/chi | `success` |
| Hotline | `danger` |

### 9.3. Section card

Dùng cho:

- Tin tức.
- Thông báo.
- Danh sách phản ánh.
- Danh sách khảo sát/cuộc thi/cuộc họp.

Style:

- Nền trắng.
- Padding 16px.
- Radius 8px.
- Title 16-18px semibold.
- Link `Xem tất cả` màu `main`.

### 9.4. List item

List item mobile chuẩn:

- Padding 12-16px.
- Border bottom `divider_01`.
- Title 14-16px.
- Meta 12-13px.
- Badge trạng thái ở phải/trên.
- Icon chevron nếu có drill-down.

### 9.5. Form mobile

Style:

- Mỗi nhóm form là section nền trắng.
- Label 13px, màu `text_2`.
- Input cao tối thiểu 44px.
- Textarea cao tối thiểu 96px.
- Error text màu `danger`, 12px.
- Button submit sticky bottom nếu form dài.

### 9.6. Empty/loading/error

Mỗi danh sách phải có:

- Loading skeleton.
- Empty state với icon nhẹ và text ngắn.
- Error state có nút thử lại.

Text mẫu:

- Empty: `Chưa có dữ liệu`
- Error: `Không tải được dữ liệu, vui lòng thử lại`
- Loading: skeleton theo list/card.

## 10. Component chuẩn cho Web Admin/DSS

### 10.1. Shell layout

Desktop layout:

- Sidebar trái 240px.
- Topbar 56-64px.
- Content padding 24px.
- Breadcrumb hoặc page title.

Sidebar:

- Logo + tên hệ thống.
- Nhóm menu theo phân hệ:
  - Tổng quan.
  - Quản trị.
  - Quản lý khu phố.
  - DSS báo cáo.
  - Phòng họp số.
  - Cấu hình.

### 10.2. Dashboard card

KPI card:

- Nền trắng.
- Radius 8px.
- Padding 16px.
- Icon 40px.
- Label 13px.
- Value 24-28px semibold.
- Trend nhỏ nếu có.

Màu KPI:

- Tổng dân cư: `main`.
- Chờ duyệt: `warning`.
- Phản ánh đang xử lý: `danger`.
- Hoàn thành: `success`.
- Báo cáo quá hạn: `danger`.

### 10.3. Table

Quy chuẩn:

- Header nền `#F8FAFC`.
- Border `border`.
- Font 13-14px.
- Row hover `primary_50`.
- Action buttons dạng icon + tooltip.
- Sticky header nếu bảng dài.

Action màu:

- Xem: `info`.
- Sửa: `main`.
- Duyệt: `success`.
- Từ chối/xóa: `danger`.
- Chuyển tiếp: `#7C3AED`.

### 10.4. Filter bar

Gồm:

- Search input.
- Select trạng thái.
- Select tổ dân phố/đơn vị.
- Date range.
- Nút `Tìm kiếm`.
- Nút `Đặt lại`.
- Nút `Xuất Excel` nếu có.

### 10.5. Form nhiều tab

Dùng cho:

- Cư dân.
- Hộ dân.
- Người dùng.
- Phòng họp số.

Layout:

- Tabs ngang trên desktop.
- Tabs hoặc accordion trên mobile.
- Footer sticky có `Lưu`, `Hủy`, `Lưu và duyệt`.

## 11. Mẫu giao diện theo module

### 11.1. Trang chủ Mini App

Thứ tự section đề xuất:

1. Header logo + tên app + tên đơn vị.
2. Banner/thông báo quan trọng.
3. Grid chức năng nổi bật.
4. Danh sách chờ xử lý của người dùng nếu có:
   - Phản ánh đang xử lý.
   - Lịch họp cần xác nhận.
   - Khảo sát/cuộc thi đang mở.
5. Tin tức nổi bật.
6. Cơ sở hạ tầng/xã hội.
7. Liên kết/tiện ích.

Màu:

- Header xanh.
- Nền page xám nhạt.
- Card trắng.
- Badge thông báo màu warning/danger.

### 11.2. Màn hình cư dân/hộ dân

Gợi ý layout:

- Summary card đầu trang:
  - Tổng thành viên.
  - Đã duyệt.
  - Chờ duyệt.
  - Từ chối.
- Tabs trạng thái.
- List cư dân/hộ dân.
- FAB hoặc button `Thêm thành viên` nếu được phép.

### 11.3. Màn hình phản ánh

Gợi ý layout:

- Tabs: Chờ xử lý, Đang xử lý, Chuyển tiếp, Đã xử lý.
- Card phản ánh:
  - Tiêu đề.
  - Loại phản ánh.
  - Ngày gửi.
  - Badge trạng thái.
  - Ảnh thumbnail nếu có.
- Button nổi `Tạo phản ánh`.

### 11.4. Màn hình khảo sát/cuộc thi

Card:

- Tên.
- Thời gian.
- Số câu hỏi.
- Trạng thái.
- CTA: `Bắt đầu`, `Làm lại`, `Kết quả`.

Màn hình làm bài/khảo sát:

- Progress step.
- 1 câu hỏi/màn hình hoặc list câu hỏi tùy độ dài.
- Nút `Tiếp`, `Quay lại`, `Hoàn thành`.

### 11.5. Màn hình thu/chi

Tổ trưởng:

- KPI tổng thu/tổng chi.
- Danh sách đợt thu/chi.
- Badge trạng thái.
- Chi tiết có bảng hộ dân đã đóng/chưa đóng.

Nếu cho cư dân xem:

- Chỉ hiển thị minh bạch tổng hợp và nghĩa vụ của hộ mình.
- Không hiển thị dữ liệu nhạy cảm của hộ khác nếu chưa được phép.

### 11.6. Web DSS dashboard

Layout:

- Header: bộ lọc kỳ/thời gian/địa bàn.
- KPI cards hàng đầu.
- Biểu đồ theo khối.
- Bảng chỉ tiêu nóng.
- Danh sách phản ánh/công việc quá hạn.

Màu chart:

- Primary blue: `#046DD6`.
- Green: `#16A34A`.
- Orange: `#F59E0B`.
- Red: `#DC2626`.
- Purple: `#7C3AED`.
- Cyan: `#0284C7`.

## 12. Hướng dẫn hình ảnh cho từng module

| Module | Loại hình ảnh nên dùng | Không nên dùng |
| --- | --- | --- |
| Trang chủ | Ảnh trụ sở, ảnh địa phương, banner thông báo | Ảnh stock chung chung, ảnh tối/nhòe |
| Tin tức | Ảnh thật sự kiện/hoạt động | Icon lặp lại cho mọi tin |
| Cư dân/hộ dân | Avatar mặc định, icon cư dân/hộ | Ảnh cá nhân nếu chưa có consent |
| Phản ánh | Ảnh người dân upload | Ảnh minh họa thay thế nội dung thật |
| Văn bản | Icon file/PDF | Ảnh trang trí lớn |
| Khảo sát | Icon clipboard/checklist | Ảnh không liên quan |
| Cuộc thi | Icon trophy/quiz | Hình quá màu mè |
| Cuộc họp | Icon calendar/meeting | Ảnh hội họp stock không cần thiết |
| Thu/chi | Icon wallet/receipt/chart | Ảnh tiền mặt nhạy cảm |
| Dashboard | Chart, map, KPI | Ảnh trang trí |
| Trợ lý | Icon bot/chat | Mascot quá vui nhộn, không phù hợp chính quyền |

## 13. Mẫu CSS/Tailwind token đề xuất

Có thể cập nhật `tailwind.config.js`:

```js
colors: {
  main: "#046DD6",
  primary_700: "#0359B0",
  primary_50: "#EAF4FF",
  success: "#16A34A",
  success_50: "#EAF8EF",
  warning: "#F59E0B",
  warning_50: "#FFF7E6",
  danger: "#DC2626",
  danger_50: "#FEECEC",
  info: "#0284C7",
  info_50: "#E8F6FC",
  surface: "#F3F5F7",
  ui_bg: "#FFFFFF",
  text_1: "#141415",
  text_2: "#767A7F",
  text_3: "#B9BDC1",
  border: "#E5E7EB",
  divider_01: "#E9EBED",
  icon_bg: "#F5F9FC"
}
```

## 14. Design checklist cho dev

Trước khi hoàn thành một màn hình:

- [ ] Dùng đúng màu primary/status.
- [ ] Có loading state.
- [ ] Có empty state.
- [ ] Có error state.
- [ ] Có badge trạng thái đúng màu.
- [ ] Form có validate và error text.
- [ ] List có phân trang hoặc infinite scroll nếu dữ liệu lớn.
- [ ] Text dài có ellipsis/wrap hợp lý.
- [ ] Ảnh có fallback/placeholder.
- [ ] Icon cùng một style.
- [ ] Không dùng quá 2 cấp card lồng nhau.
- [ ] Mobile không bị che bởi safe area/bottom bar.
- [ ] Web admin table có filter và action rõ ràng.

## 15. Các việc cần làm tiếp theo

1. Chốt bộ logo/icon chính thức của địa phương.
2. Bổ sung ảnh trụ sở, banner địa phương, placeholder tin tức.
3. Chốt thư viện icon cho web admin.
4. Cập nhật Tailwind tokens.
5. Thiết kế Figma/wireframe cho các màn hình P0:
   - Trang chủ Mini App.
   - Đăng ký/đăng nhập.
   - Cư dân.
   - Hộ dân.
   - Duyệt thông tin.
   - Phản ánh.
   - Web admin quản lý người dùng.
   - Web admin quản lý cư dân/hộ dân.
6. Tạo component library:
   - Button.
   - Input.
   - Select.
   - DatePicker.
   - StatusBadge.
   - SectionCard.
   - UtilityGrid.
   - DataTable.
   - FilterBar.
   - UploadField.
   - EmptyState.
