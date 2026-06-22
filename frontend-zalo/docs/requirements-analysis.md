# Phan tich yeu cau hoan thien Zalo Mini App dich vu cong

## 1. Muc dich tai lieu

Tai lieu nay tong hop tu hai nguon:

- Tai lieu Word: `Gioi thieu Zalo Mini app (DT 2) - D update 12062026.docx`
- Code hien tai: `mna-zaui-egov-sample`

Muc tieu la xac dinh cac chuc nang can bo sung de dua du an tu trang thai template/prototype thanh san pham Zalo Mini App dich vu cong co the van hanh thuc te.

## 2. Tong quan du an

Du an la mot Zalo Mini App phuc vu mo hinh chinh quyen so cap xa/phuong. Nguoi dan co the truy cap tren Zalo de xem thong tin dia phuong, tra cuu thu tuc/ho so, dat lich lam viec, gui phan anh kien nghi va su dung cac tien ich dich vu cong.

Code hien tai duoc xay dung dua tren template `Zalo-MiniApp/zaui-egovernment`.

Stack chinh:

- React 18
- TypeScript
- Vite
- Zalo Mini App SDK: `zmp-sdk`
- UI: `zmp-ui`
- State management: Zustand
- Styling: Tailwind CSS, twin.macro, styled-components
- Form: react-hook-form

## 3. Hien trang code

### 3.1. Cac man hinh da co

File route chinh: `src/pages/index.tsx`

Code hien co cac route:

| Route | Chuc nang |
| --- | --- |
| `/` | Trang chu |
| `/guidelines` | Trang huong dan |
| `/feedbacks` | Danh sach phan anh/gop y |
| `/feedbacks/:id` | Chi tiet phan anh |
| `/create-feedback` | Tao phan anh |
| `/create-schedule-appointment` | Dat lich lam viec |
| `/schedule-appointment-result` | Ket qua lich hen |
| `/information-guide` | Thong tin/hoi dap huong dan |
| `/search` | Tra cuu ho so |
| `/profile` | Chi tiet ho so |

### 3.2. Cac module UI da co

| Module | Vi tri | Ghi chu |
| --- | --- | --- |
| Trang chu | `src/pages/Home` | Co user info, menu tien ich, OA, lien he, thu tuc, tin tuc |
| Tin tuc | `src/components/news` | Hien danh sach tin, dang dung mock |
| Phan anh | `src/pages/Feedback`, `src/components/feedback` | Co list, detail, create form, upload anh |
| Dat lich | `src/pages/CreateScheduleAppointment`, `src/components/appointment-schedule` | Co form dat lich va the ket qua |
| Tra cuu ho so | `src/pages/Search`, `src/pages/Profile` | Co search va chi tiet ho so |
| Thong tin huong dan | `src/pages/InformationGuide`, `src/components/information-guide` | Dang o muc hoi dap don gian |
| OA | `src/components/oa` | Co follow OA |
| Upload anh | `src/components/image-upload` | Dung Zalo media picker |

### 3.3. Lop service va du lieu

Code co hai lop service:

- `src/service/services.ts`: goi API that qua `fetch`.
- `src/service/services.mock.ts`: tra ve du lieu mock tu `src/mock/db.json`.

Hien tai cac store slice dang import mock service:

- `src/store/organizationSlice.ts`
- `src/store/feedbackSlice.ts`
- `src/store/scheduleSlice.ts`
- `src/store/profileSlice.ts`
- `src/store/informationGuideSlice.ts`

Dieu nay cho thay app hien van la prototype/demo, chua ket noi backend that.

### 3.4. Cau hinh moi truong

Hai file moi truong dang de trong:

- `.env.development`
- `.env.production`

Bien quan trong:

```env
VITE_BASE_URL=
VITE_MINI_APP_ID=
```

Can cau hinh backend API va Mini App ID truoc khi chay production.

## 4. Tom tat yeu cau tu tai lieu Word

Tai lieu mo ta giai phap Zalo Mini App "Tu Lan Smart" voi muc tieu tao kenh tuong tac so giua chinh quyen va nguoi dan.

### 4.1. Muc tieu voi nguoi dan

- Tiep can dich vu cong moi luc, moi noi.
- Giam thoi gian di lai.
- Han che viec den truc tiep co quan nha nuoc de hoi thong tin.
- Chu dong tra cuu thu tuc hanh chinh.
- Dat lich lam viec truoc voi chinh quyen.
- Tiep can nhanh cac so dien thoai ho tro/khan cap.

### 4.2. Muc tieu voi chinh quyen

- Giam ap luc tiep cong dan truc tiep.
- Giam cuoc goi lap lai ve thong tin thu tuc.
- Tang ty le su dung dich vu cong truc tuyen.
- Tang cong khai, minh bach.
- Hinh thanh kenh tuong tac so chinh thuc giua chinh quyen va nguoi dan.

### 4.3. Nhom chuc nang trong tai lieu

| Nhom chuc nang | Mo ta |
| --- | --- |
| Trung tam thong tin dieu hanh | Tin tuc, su kien, banner, cap nhat noi dung |
| Chatbot AI dich vu cong | Hoi dap thu tuc bang ngon ngu tu nhien, ho tro 24/7 |
| Danh muc thu tuc hanh chinh | Tim kiem, xem thanh phan ho so, le phi, thoi han, mau don |
| Dat lich lam viec | Nguoi dan chon ngay/gio, nhap thong tin, nhan phieu hen |
| Kho mau don, to khai | Xem/tai bieu mau hanh chinh |
| Cong dich vu cong truc tuyen | Link nop ho so truc tuyen va theo doi trang thai |
| Thong tin quy hoach | Ban do, van ban quy hoach |
| Thong tin du an dau tu | Danh sach du an, tien do, thong tin dau tu cong |
| Thong tin dau thau | Moi thau, ket qua lua chon nha thau, mua sam cong |
| Phan anh, kien nghi | Gui phan anh hien truong, gop y, kien nghi |
| Lich cong tac dien tu | Lich lanh dao, lich hop, lich tiep cong dan |
| Khao sat su hai long | Danh gia chat luong phuc vu |
| Duong day nong | Goi truc tiep lanh dao, bo phan mot cua, so khan cap |
| Ban do va dinh vi tru so | Xem vi tri, dan duong |
| Kho van ban dien tu | Nghi quyet Dang uy, HDND, tim kiem/xem/tai |
| Thu vien phap luat | Van ban quy pham phap luat theo linh vuc, dien giai de hieu, AI tom tat |
| Dieu huong dich vu cong | Trung tam lien ket nhanh: DVCQG, VNeID, iHanoi, eTax Mobile, fanpage, TTDT, OA |
| Trang chu thong minh | Dashboard thong ke dan so, dich vu cong, muc do hai long nguoi dan |
| Gioi thieu dia phuong | Lich su, co cau, thanh tich, can bo chu chot |

### 4.4. Bo sung theo mo ta giai phap MobiFone Ha Noi

Ba dong cuoi bang tren (Thu vien phap luat, Dieu huong dich vu cong, Trang chu
thong minh) duoc bo sung theo mo ta giai phap "Zalo Miniapp UBND phuong/xa" do
MobiFone Thanh pho Ha Noi trien khai. Mot so luu y kien truc tu mo ta:

- He thong gom hai thanh phan: Zalo Mini App (cho nguoi dan) va Website quan tri
  (cho UBND phuong/xa), phan quyen quan tri vien va chuyen vien phu trach. Phan
  Website quan tri tuong ung voi Admin CMS o muc 7.
- Du lieu quan ly tap trung tren dien toan dam may, cap nhat noi dung theo thoi
  gian thuc, trien khai dong bo tren pham vi toan tinh. Dieu nay yeu cau mo hinh
  multi-tenant theo `organizationId` (da co trong data model) va co che publish
  noi dung tu admin xuong Mini App.
- Cac module B: Bo Tin tuc, Tiep nhan phan anh, Tro ly ao AI (chatbot), Ban do
  so (chi duong) da co dac ta o muc 6 va build-notes; phan bo sung duoi day chi
  tap trung vao ba module con thieu/chua day du.

Dac ta chi tiet ba module nay o muc 6.13, 6.14, 6.15.

## 5. Gap analysis giua code va tai lieu

### 5.1. Chuc nang da co nen hoan thien

| Yeu cau | Code hien tai | Khoang cach can xu ly |
| --- | --- | --- |
| Trang chu | Da co `HomePage` | Can du lieu that, banner, menu nhieu trang, cau hinh theo dia phuong |
| Tin tuc - su kien | Co `NewsSection` | Can API that, chi tiet tin, banner/slideshow, phan loai tin |
| Dat lich lam viec | Co form dat lich | Thieu CCCD, gio hen, khung gio, chong trung lich, phe duyet, nhac lich |
| Phan anh - kien nghi | Co list/detail/create | Can ma phan anh, trang thai xu ly, phan hoi can bo, API that |
| Tra cuu ho so | Co search profile | Can API that, timeline xu ly, trang thai, thong bao |
| Thong tin huong dan | Co information guide | Can mo rong thanh kho thu tuc/FAQ co phan loai va search |
| Cong dich vu cong | Co link dichvucong.gov.vn | Can gan link theo tung thu tuc |
| OA/Zalo | Co follow OA, token, user info | Can xu ly token production, consent, retry unauthorized |

### 5.2. Chuc nang chua co trong code

| Chuc nang | Muc do uu tien | Ghi chu |
| --- | --- | --- |
| Chatbot AI dich vu cong | Cao | Yeu cau noi bat trong tai lieu |
| Danh muc thu tuc hanh chinh chi tiet | Cao | La luong chinh cua dich vu cong |
| Kho mau don, to khai | Cao | Gan voi thu tuc hanh chinh |
| Duong day nong | Cao | De lam, gia tri su dung cao |
| Ban do tru so | Trung binh | Co the mo Google Maps/webview |
| Lich cong tac | Trung binh | Can CMS/admin cap nhat |
| Khao sat hai long | Trung binh | Can form va bao cao |
| Kho van ban dien tu | Trung binh | Can upload/search/preview file |
| Thong tin quy hoach | Trung binh | Co the dung webview truoc, native sau |
| Thong tin du an dau tu | Trung binh | Can data model va admin |
| Thong tin dau thau | Trung binh | Co the crawl/sync tu nguon ngoai |
| Thu vien phap luat | Trung binh | Can data model rieng, dien giai + AI tom tat tren nguon da kiem duyet |
| Dieu huong dich vu cong | Cao | De lam, gia tri cao; can deep link + fallback va cau hinh tu admin |
| Trang chu thong minh (dashboard) | Trung binh | Tong hop so lieu dan so/ho so/hai long; mot phan auto tu survey/appointment/feedback |
| Gioi thieu dia phuong | Thap | Co the lam page content dong |
| Backend crawl/sync data | Cao neu van hanh that | Tai lieu co de cap crawl data va luu tru |
| Admin CMS | Bat buoc | Khong co admin se khong van hanh duoc du lieu dong |

## 6. Yeu cau chuc nang chi tiet

### 6.1. Trang chu

Can bo sung:

- Banner tin tuc/su kien co carousel.
- Menu tien ich toi da 6 bieu tuong/trang, co vuot ngang.
- Cac block noi dung co the cau hinh tu backend.
- Hien ten/logo dia phuong.
- Hien thong tin nguoi dung Zalo neu duoc cap quyen.

Du lieu can co:

- Organization profile
- Banner list
- Utility menu configuration
- Featured news
- Hotlines
- Procedure shortcuts

### 6.2. Chatbot AI dich vu cong

Can bo sung:

- Entry point tren trang chu.
- Chat UI native hoac mo webview chatbot.
- Backend chatbot tra loi dua tren kho thu tuc hanh chinh.
- Fallback khi khong tra loi duoc:
  - Goi duong day nong.
  - Nhan tin OA/can bo dang online.
  - De xuat link thu tuc lien quan.

Yeu cau du lieu:

- Procedure documents
- FAQ
- Contact/hotline
- Chat session logs neu can thong ke

Luu y bao mat:

- Khong dua CCCD/SDT/thong tin ca nhan vao prompt neu khong can.
- Can co chinh sach luu/khong luu chat ro rang.

### 6.3. Thu tuc hanh chinh

Can bo sung module rieng:

- Danh sach thu tuc.
- Tim kiem co dau/khong dau.
- Loc theo linh vuc.
- Chi tiet thu tuc:
  - Ten thu tuc
  - Ma thu tuc
  - Linh vuc
  - Thanh phan ho so
  - Le phi
  - Thoi han giai quyet
  - Co quan thuc hien
  - Trinh tu thuc hien
  - Mau don/to khai
  - Link nop truc tuyen

Route de xuat:

- `/procedures`
- `/procedures/:id`

### 6.4. Dat lich lam viec

Code hien co nen duoc mo rong theo tai lieu.

Can bo sung vao form:

- Ho va ten
- So dien thoai
- CCCD 12 so
- Noi dung lam viec
- Ngay hen
- Gio hen/khung gio

Can bo sung luong xu ly:

- Kiem tra khung gio con trong.
- Cap so thu tu.
- Sinh phieu hen dien tu.
- Trang thai: pending, approved, rejected, cancelled, completed.
- Ly do tu choi neu co.
- Nhac lich qua Zalo neu duoc phep.

Route hien co co the giu:

- `/create-schedule-appointment`
- `/schedule-appointment-result`

### 6.5. Phan anh, kien nghi

Can bo sung:

- Tao ma phan anh.
- Trang thai xu ly:
  - moi tiep nhan
  - dang xu ly
  - da phan hoi
  - tu choi
  - dong
- Upload nhieu anh.
- Phan loai phan anh.
- Tra cuu lich su phan anh cua nguoi dung.
- Can bo tra loi phan anh tu admin.

Route hien co co the giu:

- `/feedbacks`
- `/feedbacks/:id`
- `/create-feedback`

### 6.6. Kho mau don, to khai

Can bo sung:

- Danh sach bieu mau.
- Tim kiem.
- Loc theo linh vuc/thu tuc.
- Xem file.
- Tai file.
- Gan bieu mau voi thu tuc hanh chinh.

Route de xuat:

- `/forms`
- `/forms/:id`

### 6.7. Kho van ban dien tu

Theo tai lieu can ho tro:

- Nghi quyet Dang uy.
- Nghi quyet HDND.
- Tim kiem theo so van ban.
- Tim kiem theo trich yeu.
- Tim kiem co dau/khong dau.
- Xem truc tuyen.
- Tai file.

Route de xuat:

- `/documents`
- `/documents/:id`

### 6.8. Duong day nong

Can bo sung:

- Nhom so dien thoai:
  - Lanh dao UBND
  - Trung tam phuc vu hanh chinh cong
  - So khan cap
  - Bo phan mot cua
- Click de goi truc tiep.
- Admin cau hinh danh sach so dien thoai.

Route de xuat:

- `/hotlines`

### 6.9. Ban do tru so

Can bo sung:

- Dia chi tru so.
- Link Google Maps.
- Nut chi duong.
- Gio lam viec.

Route de xuat:

- `/location`

### 6.10. Lich cong tac

Can bo sung:

- Lich lam viec lanh dao.
- Lich hop.
- Lich tiep cong dan.
- Loc theo ngay/tuan.
- Chi tiet su kien.

Route de xuat:

- `/work-schedule`

### 6.11. Khao sat hai long

Can bo sung:

- Form khao sat 3-5 cau hoi.
- Cau hoi rating.
- Cau hoi text tuy chon.
- Gui an danh hoac gan user neu can.
- Backend tong hop bao cao.

Route de xuat:

- `/survey`

### 6.12. Quy hoach, du an, dau thau

Giai doan dau co the lam bang webview/link ngoai. Sau do chuyen thanh native UI neu co backend du lieu.

Route de xuat:

- `/planning`
- `/projects`
- `/biddings`

### 6.13. Thu vien phap luat

Module tra cuu van ban quy pham phap luat theo linh vuc, kem dien giai de hieu
va AI ho tro tom tat.

Phan biet voi muc 6.7 (Kho van ban dien tu): muc 6.7 luu van ban noi bo dia
phuong (nghi quyet Dang uy/HDND). Thu vien phap luat luu van ban phap luat chung
(Luat, Nghi dinh, Thong tu, Quyet dinh...) phuc vu nguoi dan tra cuu phap ly.

Can bo sung:

- Danh sach van ban theo linh vuc (dat dai, ho tich, kinh doanh, lao dong, BHXH,
  xay dung, moi truong, an sinh xa hoi...).
- Tim kiem co dau/khong dau theo tieu de, so hieu, linh vuc.
- Loc theo linh vuc va loai van ban.
- Chi tiet van ban:
  - Tieu de
  - So hieu van ban
  - Loai van ban (Luat, Nghi dinh, Thong tu, Quyet dinh, Cong van...)
  - Linh vuc
  - Co quan ban hanh
  - Ngay ban hanh / ngay hieu luc
  - Trang thai hieu luc (con hieu luc / het hieu luc / sua doi bo sung)
  - Noi dung hoac file dinh kem (xem/tai)
  - Dien giai de hieu (bien tap vien soan)
  - Tom tat AI (co kiem duyet truoc khi hien thi)

Yeu cau ve AI tom tat:

- Chi tom tat dua tren tai lieu chinh thong da kiem duyet.
- Tom tat la noi dung tham khao; can co disclaimer "doi chieu van ban goc".
- Co the cache ket qua tom tat de tranh goi AI lap lai.
- Co buoc duyet/khoa tom tat truoc khi public neu can.

Route de xuat:

- `/legal-library`
- `/legal-library/:id`

### 6.14. Dieu huong dich vu cong

Trung tam dieu huong giup nguoi dan truy cap nhanh cac nen tang/dich vu so lien
quan ma khong roi trai nghiem Mini App. Khac voi muc 6 (cong DVC chi 1 link),
day la mot man hinh tap hop nhieu lien ket co phan nhom va cau hinh duoc.

Cac lien ket toi thieu theo mo ta:

- Cong Dich vu cong Quoc gia (dichvucong.gov.vn)
- VNeID
- iHanoi
- eTax Mobile
- Fanpage Facebook phuong/xa
- Trang/Cong thong tin dien tu (TTDT) phuong/xa
- Zalo OA phuong/xa

Co the mo rong: VssID (BHXH so), So suc khoe dien tu, cong DVC tinh/thanh pho.

Can bo sung:

- Moi lien ket co: icon, ten, mo ta ngan, nhom phan loai, thu tu hien thi,
  trang thai bat/tat.
- Co che mo lien ket:
  - Uu tien deep link mo app neu da cai (app scheme/universal link).
  - Fallback mo web bang Zalo webview hoac trinh duyet ngoai.
  - Mo store cai dat neu chua co app (neu xac dinh duoc).
- Admin cau hinh danh sach lien ket, nhom, thu tu va bat/tat theo tung dia phuong.

Luu y:

- Mot so app (VNeID, eTax Mobile) co the khong ho tro deep link tren moi thiet bi;
  can fallback ro rang va thong bao than thien khi khong mo duoc.
- Khong nhung token/thong tin ca nhan vao URL khi dieu huong.

Route de xuat:

- `/public-services` (hoac `/service-hub`)

### 6.15. Trang chu thong minh

Mo rong trang chu (muc 6.1) them khu vuc tong quan - thong ke de tang tinh minh
bach va tao "dashboard gan dan" theo mo ta giai phap.

Can bo sung khu vuc thong ke tren trang chu:

- Thong tin phuong/xa: ten, dia ban quan ly.
- Thong ke dan so: so dan, so ho, dien tich (admin cau hinh).
- Thong ke dich vu cong: so ho so tiep nhan, da xu ly, ti le dung han (neu co
  du lieu; co the tong hop tu module dat lich/ho so).
- Muc do hai long cua nguoi dan: chi so tong hop tu module khao sat (muc 6.11),
  hien dang so/phan tram hoac bieu do don gian.

Nguon du lieu:

- Mot phan tinh: admin nhap (dan so, dien tich).
- Mot phan dong/tu dong tong hop:
  - Hai long tu `/survey`.
  - Ho so/lich hen tu `/appointments`.
  - Phan anh tu `/feedbacks`.
- Co the cache snapshot theo ngay de tranh tinh toan nang moi lan mo app.

Yeu cau hien thi:

- Dang the so lieu (stat cards) hoac bieu do nhe.
- Co trang thai khi chua co du lieu (empty state), khong hien so 0 gay hieu nham.
- Admin bat/tat tung chi so hien thi.

Route:

- Hien thi ngay tren trang chu `/` (khong can route rieng).
- Tuy chon: `/dashboard` cho ban day du neu can.

## 7. Yeu cau backend va admin CMS

Code hien tai chi la frontend. De van hanh that, can co backend/API va admin CMS.

### 7.1. API public cho Mini App

Nhom API can co:

- Organization
- News
- Procedures
- Forms/Documents
- Appointments
- Feedback
- Profiles
- Hotlines
- Work schedules
- Surveys
- Planning/projects/bidding
- Chatbot
- Legal documents (thu vien phap luat)
- Service links (dieu huong dich vu cong)
- Home stats (so lieu trang chu)

### 7.2. Admin CMS

Can co giao dien quan tri cho can bo:

- Quan ly thong tin dia phuong.
- Quan ly banner/tin tuc.
- Quan ly thu tuc hanh chinh.
- Quan ly mau don/to khai.
- Quan ly van ban/nghi quyet.
- Quan ly lich hen.
- Quan ly phan anh va tra loi phan anh.
- Quan ly lich cong tac.
- Quan ly danh ba/duong day nong.
- Quan ly khao sat.
- Quan ly quy hoach/du an/dau thau.
- Cau hinh chatbot source data.
- Quan ly thu vien phap luat (van ban, dien giai, duyet tom tat AI).
- Cau hinh lien ket dieu huong dich vu cong (nhom, thu tu, bat/tat).
- Cau hinh so lieu trang chu (dan so, dien tich, chi so hien thi).

### 7.3. Phan quyen admin

Vai tro de xuat:

| Role | Quyen |
| --- | --- |
| Super Admin | Quan ly toan bo he thong |
| Organization Admin | Quan ly du lieu cua mot dia phuong |
| Content Editor | Quan ly tin tuc, van ban, thu tuc |
| Appointment Officer | Xu ly lich hen |
| Feedback Officer | Xu ly phan anh |
| Viewer/Reporter | Xem bao cao |

## 8. Data model de xuat

### 8.1. Organization

```ts
type Organization = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  mapUrl?: string;
  miniAppId?: string;
};
```

### 8.2. NewsArticle

```ts
type NewsArticle = {
  id: string;
  organizationId: string;
  title: string;
  summary?: string;
  content: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  category?: string;
  publishedAt: string;
  status: "draft" | "published" | "archived";
};
```

### 8.3. Procedure

```ts
type Procedure = {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  category: string;
  dossierRequirements: string;
  fee?: string;
  processingTime?: string;
  agency?: string;
  processSteps?: string;
  onlineSubmissionUrl?: string;
  formIds?: string[];
};
```

### 8.4. Appointment

```ts
type Appointment = {
  id: string;
  organizationId: string;
  userId?: string;
  fullName: string;
  phoneNumber: string;
  citizenId: string;
  content: string;
  appointmentDate: string;
  appointmentTime: string;
  queueNumber?: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  rejectedReason?: string;
};
```

### 8.5. Feedback

```ts
type Feedback = {
  id: string;
  organizationId: string;
  userId?: string;
  code: string;
  typeId: string;
  title: string;
  content: string;
  imageUrls?: string[];
  status: "new" | "processing" | "responded" | "rejected" | "closed";
  response?: string;
  createdAt: string;
  respondedAt?: string;
};
```

### 8.6. PublicDocument

```ts
type PublicDocument = {
  id: string;
  organizationId: string;
  documentNo: string;
  title: string;
  summary?: string;
  type: "party_resolution" | "council_resolution" | "form" | "planning" | "other";
  issuedDate?: string;
  fileUrl: string;
};
```

### 8.7. Hotline

```ts
type Hotline = {
  id: string;
  organizationId: string;
  group: string;
  title: string;
  personName?: string;
  role?: string;
  phoneNumber: string;
  order: number;
};
```

### 8.8. Survey

```ts
type Survey = {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "closed";
};
```

### 8.9. LegalDocument

```ts
type LegalDocument = {
  id: string;
  organizationId: string;
  documentNo: string;
  title: string;
  docType: "law" | "decree" | "circular" | "decision" | "official_letter" | "other";
  field: string; // linh vuc: dat dai, ho tich, lao dong...
  issuingBody?: string;
  issuedDate?: string;
  effectiveDate?: string;
  effectiveStatus: "effective" | "expired" | "amended";
  content?: string;
  fileUrl?: string;
  plainExplanation?: string; // dien giai de hieu
  aiSummary?: string; // tom tat AI, da kiem duyet
  aiSummaryStatus?: "draft" | "approved";
  status: "draft" | "published" | "archived";
};
```

### 8.10. ServiceLink

```ts
type ServiceLink = {
  id: string;
  organizationId: string;
  group: string; // nhom: dich vu cong, dinh danh, thue, mang xa hoi...
  title: string;
  description?: string;
  iconUrl?: string;
  appScheme?: string; // deep link mo app
  webUrl: string; // fallback web
  storeUrl?: string; // mo store neu chua cai app
  order: number;
  enabled: boolean;
};
```

### 8.11. HomeStats

```ts
type HomeStats = {
  organizationId: string;
  population?: number;
  households?: number;
  areaKm2?: number;
  dossiersReceived?: number;
  dossiersResolved?: number;
  onTimeRate?: number; // %
  satisfactionScore?: number; // tu khao sat
  satisfactionResponses?: number;
  updatedAt: string;
  source?: "manual" | "aggregated"; // nhap tay hay tu dong tong hop
};
```

## 9. API contract de xuat

### 9.1. Organization

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/by-mini-app/:miniAppId` | Lay thong tin dia phuong theo Mini App ID |

### 9.2. News

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/articles` | Danh sach tin |
| GET | `/articles/:id` | Chi tiet tin |

### 9.3. Procedures

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/procedures` | Danh sach/tim kiem thu tuc |
| GET | `/procedures/:id` | Chi tiet thu tuc |

### 9.4. Appointments

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/appointments/slots` | Lay khung gio trong |
| POST | `/organizations/:orgId/appointments` | Tao lich hen |
| GET | `/appointments/:id` | Chi tiet lich hen |
| GET | `/me/appointments` | Lich hen cua nguoi dung |

### 9.5. Feedback

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/feedback-types` | Loai phan anh |
| POST | `/organizations/:orgId/feedbacks` | Tao phan anh |
| GET | `/me/feedbacks` | Danh sach phan anh cua nguoi dung |
| GET | `/feedbacks/:id` | Chi tiet phan anh |

### 9.6. Documents

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/documents` | Tim kiem van ban/mau don |
| GET | `/documents/:id` | Chi tiet van ban |

### 9.7. Chatbot

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| POST | `/chatbot/sessions` | Tao chat session |
| POST | `/chatbot/messages` | Gui cau hoi va nhan cau tra loi |

### 9.8. Legal Library

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/legal-documents` | Tim kiem/loc van ban phap luat |
| GET | `/legal-documents/:id` | Chi tiet van ban (kem dien giai, tom tat AI) |
| POST | `/legal-documents/:id/summary` | (Admin) sinh/cap nhat tom tat AI |

### 9.9. Service Links

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/service-links` | Danh sach lien ket dieu huong dich vu cong |

### 9.10. Home Stats

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/organizations/:orgId/home-stats` | So lieu thong ke hien tren trang chu |

## 10. Yeu cau bao mat va du lieu ca nhan

Du an xu ly nhieu du lieu nhay cam:

- Ho ten
- So dien thoai
- CCCD
- Noi dung phan anh
- Lich hen voi chinh quyen
- Ho so hanh chinh

Can bo sung:

- HTTPS bat buoc.
- Token that tu Zalo, khong dung fallback dev trong production.
- Phan quyen API.
- Validate input o backend va frontend.
- Rate limit API tao phan anh, dat lich, chatbot.
- Audit log cho admin.
- Chinh sach luu tru/xoa du lieu ca nhan.
- Khong log token/CCCD/noi dung nhay cam.
- Upload file/anh can gioi han dung luong va loai file.

## 11. Van de ky thuat can sua trong code hien tai

### 11.1. Dang dung mock service trong store

Can thay import tu:

```ts
@service/services.mock
```

sang:

```ts
@service/services
```

hoac tao co che chon service theo environment.

### 11.2. Cau hinh API dang trong

Can bo sung:

```env
VITE_BASE_URL=https://api.example.gov.vn
VITE_MINI_APP_ID=<zalo-mini-app-id>
```

Va tao `.env.example` de dev khac cau hinh.

### 11.3. Token fallback khong an toan

Trong `src/service/zalo.ts` hien co fallback:

```ts
const token = (await getAccessToken({})) || "ACCESS_TOKEN";
```

Can bo fallback nay truoc production.

### 11.4. Unauthorized retry dang bi comment

Trong `src/service/request.ts`, logic retry sau khi refresh token dang bi comment. Can bat lai neu backend yeu cau token moi.

### 11.5. Loi typo `pargeSize`

Trong `src/service/services.ts` co nhieu cho dung `pargeSize`. Can xac nhan voi backend. Neu backend dung `pageSize`, can sua lai.

### 11.6. Form dat lich thieu truong

Tai lieu yeu cau:

- Ho ten
- So dien thoai
- CCCD
- Noi dung lam viec
- Ngay hen
- Gio hen

Code hien thieu CCCD va gio hen.

### 11.7. Encoding tieng Viet

Nhieu chuoi trong code/config bi mojibake, vi du `Dá»‹ch Vá»¥ CÃ´ng`. Can chuan hoa UTF-8.

### 11.8. Chua co test

Khong thay file `.test` hoac `.spec`. Can bo sung test toi thieu cho:

- Form validation
- Service request
- Store actions
- Component render chinh

## 12. Roadmap de xuat

### Phase 1: Hoan thien loi dang co

Muc tieu: app chay duoc voi backend that cho cac chuc nang co san.

Cong viec:

- Sua encoding tieng Viet.
- Tao `.env.example`.
- Cau hinh `VITE_BASE_URL`, `VITE_MINI_APP_ID`.
- Chuyen store tu mock sang API that.
- Hoan thien request/token retry.
- Hoan thien trang chu voi du lieu organization/tin tuc.
- Hoan thien dat lich:
  - CCCD
  - gio hen
  - khung gio
  - phieu hen
  - trang thai
- Hoan thien phan anh:
  - loai phan anh
  - upload anh
  - ma phan anh
  - trang thai
- Hoan thien tra cuu ho so.
- Them test co ban.

### Phase 2: Bo sung cac module dich vu cong thiet yeu

Muc tieu: dat du nhom chuc nang co gia tri cao trong tai lieu.

Cong viec:

- Module thu tuc hanh chinh.
- Module mau don/to khai.
- Module duong day nong.
- Module ban do tru so.
- Module kho van ban dien tu.
- Module lich cong tac.
- Module khao sat hai long.
- Cap nhat menu trang chu nhieu trang.

### Phase 3: Module nang cao va tich hop

Muc tieu: dat muc san pham hoan chinh theo proposal.

Cong viec:

- Chatbot AI dich vu cong.
- Quy hoach.
- Du an dau tu.
- Dau thau.
- Crawl/sync data.
- Dashboard bao cao.
- Nhac lich qua Zalo.
- Fallback chatbot sang can bo/OA.

### Phase 4: San sang production

Muc tieu: co the trien khai van hanh thuc te.

Cong viec:

- Security review.
- Performance review.
- Logging va monitoring.
- Backup du lieu.
- Admin audit log.
- Phan quyen admin.
- Kiem thu UAT theo tung luong nguoi dung.
- Tai lieu huong dan van hanh.

## 13. Backlog uu tien

### P0 - Bat buoc truoc khi production

- Sua encoding tieng Viet.
- Bo token fallback dev.
- Cau hinh API environment.
- Thay mock service bang API that.
- Hoan thien form dat lich theo tai lieu.
- Them validation CCCD/SDT.
- Them trang thai lich hen va phan anh.
- Them backend/admin toi thieu.
- Them test smoke/build/lint.

### P1 - Chuc nang gia tri cao

- Thu tuc hanh chinh chi tiet.
- Kho mau don/to khai.
- Duong day nong.
- Kho van ban dien tu.
- Lich cong tac.
- Khao sat hai long.
- Ban do tru so.
- Dieu huong dich vu cong (DVCQG, VNeID, iHanoi, eTax, fanpage, TTDT).
- Trang chu thong minh (dashboard thong ke + hai long).

### P2 - Chuc nang nang cao

- Chatbot AI.
- Thu vien phap luat (dien giai + AI tom tat).
- Quy hoach.
- Du an.
- Dau thau.
- Crawl/sync data.
- Bao cao thong ke.

## 14. Tieu chi nghiem thu de xuat

### 14.1. Nguoi dan

- Mo Mini App tren Zalo thanh cong.
- Xem duoc trang chu voi ten/logo dia phuong.
- Xem duoc tin tuc moi nhat.
- Tim duoc thu tuc hanh chinh.
- Dat lich lam viec va nhan phieu hen.
- Gui phan anh kem anh.
- Tra cuu trang thai ho so/phan anh/lich hen.
- Goi duoc duong day nong.
- Xem/tai duoc van ban hoac mau don.

### 14.2. Can bo quan tri

- Dang nhap admin thanh cong.
- Tao/sua/xoa tin tuc.
- Cap nhat thu tuc, mau don, van ban.
- Duyet/tu choi lich hen.
- Tra loi phan anh.
- Xem bao cao khao sat.
- Cau hinh hotline, ban do, menu tien ich.

### 14.3. Ky thuat

- Build production thanh cong.
- Lint/typecheck khong loi nghiem trong.
- API co auth/rate limit.
- Khong dung mock data trong production.
- Khong hardcode secret/token.
- Co log va audit cho thao tac quan tri.

## 15. Ket luan

Code hien tai la nen tang frontend tot cho Zalo Mini App dich vu cong nhung moi o muc sample/prototype. Tai lieu Word mo ta mot san pham rong hon, can them backend, admin CMS, API that va nhieu module nghiep vu.

Huong trien khai hop ly la:

1. Hoan thien cac luong da co va thay mock bang API that.
2. Bo sung module dich vu cong thiet yeu theo tai lieu.
3. Xay chatbot AI va cac module nang cao.
4. Dong goi production voi bao mat, test, admin va tai lieu van hanh.
