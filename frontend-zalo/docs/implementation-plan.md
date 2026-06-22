# Ke hoach thuc hien hoan thien Zalo Mini App dich vu cong

## 1. Muc tieu

Muc tieu cua ke hoach nay la dua du an `mna-zaui-egov-sample` tu trang thai template/prototype thanh mot Zalo Mini App dich vu cong co the chay that tren nen tang Zalo Mini App, co backend/API, admin CMS, du lieu that va cac module theo tai lieu yeu cau.

Pham vi bao gom:

- Hoan thien frontend Mini App hien co.
- Sua cac van de ky thuat can thiet de chay tren Zalo Mini App.
- Thiet ke va xay backend API.
- Xay admin CMS cho can bo quan tri.
- Bo sung cac module nghiep vu con thieu.
- Kiem thu, bao mat, deploy va ban giao van hanh.

## 2. Nguyen tac thuc hien

- Uu tien hoan thien cac luong dang co truoc khi xay module moi.
- Khong dua mock data vao production.
- Moi module moi can co API contract, UI, validation, loading/error/empty state va tieu chi nghiem thu.
- Du lieu ca nhan nhu ho ten, so dien thoai, CCCD, noi dung phan anh phai duoc bao ve.
- Cac tinh nang co the trien khai theo 2 muc:
  - Muc 1: link/webview de kip van hanh.
  - Muc 2: native UI + backend quan tri.
- Uu tien su dung component va pattern san co trong codebase.

## 3. Tong quan lo trinh

| Phase | Muc tieu | Ket qua chinh |
| --- | --- | --- |
| Phase 0 | Chuan hoa nen tang | App chay local on dinh, cau hinh dung, het loi encoding nghiem trong |
| Phase 1 | Hoan thien chuc nang loi | Trang chu, tin tuc, dat lich, phan anh, tra cuu ho so chay voi API that |
| Phase 2 | Xay backend va admin CMS | Co API, database, admin quan tri du lieu |
| Phase 3 | Bo sung module dich vu cong thiet yeu | Thu tuc, mau don, van ban, hotline, ban do, lich cong tac, khao sat, dieu huong DVC, trang chu thong minh |
| Phase 4 | Bo sung module nang cao | Chatbot AI, thu vien phap luat (AI tom tat), quy hoach, du an, dau thau, sync/crawl data |
| Phase 5 | Production readiness | Security, test, monitoring, deploy Zalo, UAT, ban giao |

## 4. Phase 0 - Chuan hoa nen tang

### 4.1. Muc tieu

Dam bao project co the cai dat, chay local, build va cau hinh dung cho Zalo Mini App.

### 4.2. Cong viec

#### 4.2.1. Kiem tra moi truong

- Cai Node.js phien ban phu hop.
- Cai Zalo Mini App CLI: `zmp-cli`.
- Kiem tra lenh:

```bash
npm install
npm start
```

- Kiem tra lenh deploy:

```bash
zmp login
zmp deploy
```

#### 4.2.2. Tao file cau hinh mau

Tao `.env.example`:

```env
VITE_BASE_URL=https://api.example.vn
VITE_MINI_APP_ID=your-zalo-mini-app-id
VITE_TOKEN=
```

Cap nhat tai lieu setup local:

- Cach cai dependency.
- Cach chay local.
- Cach chay tren Zalo app.
- Cach deploy.
- Cac bien moi truong bat buoc.

#### 4.2.3. Sua encoding tieng Viet

Sua cac chuoi dang bi mojibake trong:

- `package.json`
- `app-config.json`
- `zmp-cli.json`
- `src/constants/utinities.ts`
- Cac page/component co text tieng Viet
- `src/mock/db.json`

Vi du:

```json
"Dá»‹ch Vá»¥ CÃ´ng"
```

can thanh:

```json
"Dich Vu Cong"
```

hoac dung tieng Viet co dau neu dam bao UTF-8 on dinh.

#### 4.2.4. Chuan hoa cau hinh Zalo Mini App

Kiem tra `app-config.json`:

- `app.title`
- `statusBarColor`
- `textColor`
- `leftButton`
- `hideIOSSafeAreaBottom`

Kiem tra `zmp-cli.json`:

- `name`
- `framework`
- `package`
- `cssPreProcessor`
- `includeTailwind`

Can dam bao Mini App ID duoc cau hinh dung trong `.env.development` va `.env.production`.

#### 4.2.5. Kiem tra build/lint/typecheck

Them hoac xac nhan cac script:

```bash
npm run lint
npm run format
npm run build:css
```

Neu chua co script build production ro rang, can xac nhan lenh build qua `zmp deploy` hoac them script rieng neu can.

### 4.3. Deliverable

- `.env.example`
- README/setup guide cap nhat
- Project chay duoc local bang `npm start`
- App hien thi tieng Viet dung
- Cau hinh Mini App ID/API ro rang

### 4.4. Tieu chi nghiem thu

- `npm install` thanh cong.
- `npm start` mo duoc dev server.
- App hien thi man hinh trang chu.
- Khong con cac chuoi mojibake o cac man hinh chinh.
- Co tai lieu huong dan chay local.

## 5. Phase 1 - Hoan thien chuc nang loi cua Mini App

### 5.1. Muc tieu

Hoan thien cac chuc nang da co trong code va ket noi voi API that thay vi mock data.

### 5.2. Chuyen tu mock service sang API service

#### Cong viec

- Tao co che service theo environment:
  - Development co the dung mock neu can.
  - Production bat buoc dung API that.
- Sua cac store slice dang import `@service/services.mock`:
  - `organizationSlice.ts`
  - `feedbackSlice.ts`
  - `scheduleSlice.ts`
  - `profileSlice.ts`
  - `informationGuideSlice.ts`

#### Huong de xuat

Tao file:

```text
src/service/index.ts
```

Noi dung y tuong:

```ts
export * from "./services";
```

Neu can mock trong dev:

```ts
export * from import.meta.env.VITE_USE_MOCK === "true"
  ? "./services.mock"
  : "./services";
```

Luu y: TypeScript khong ho tro export conditional truc tiep nhu tren, can thiet ke lai bang adapter ro rang.

### 5.3. Hoan thien request/auth

#### Cong viec

- Bo fallback token `"ACCESS_TOKEN"` trong `src/service/zalo.ts`.
- Bat lai retry request sau khi refresh token trong `src/service/request.ts`.
- Xu ly loi API:
  - Unauthorized
  - Network error
  - Rate limit
  - Validation error
- Bo sung timeout neu can.
- Khong log token hoac du lieu nhay cam.

#### Tieu chi nghiem thu

- Khong con token gia trong production.
- Khi token het han, app co the lay lai token va retry mot lan.
- Loi API hien snackbar/thong bao ro rang.

### 5.4. Trang chu

#### Cong viec frontend

- Lay organization theo `VITE_MINI_APP_ID`.
- Hien logo/ten/mo ta dia phuong.
- Hien banner/tin tuc moi.
- Hien menu tien ich theo cau hinh backend.
- Ho tro menu nhieu trang, toi da 6 item/trang theo tai lieu.
- Them cac item can co:
  - Chatbot AI
  - Thu tuc hanh chinh
  - Mau don/to khai
  - Nop ho so truc tuyen
  - Quy hoach
  - Du an
  - Dau thau
  - Phan anh
  - Tin tuc
  - Tru so
  - YouTube
  - Lich cong tac
  - Khao sat
  - Gioi thieu

#### Cong viec backend

- API lay organization.
- API lay utility menu.
- API lay banner/tin tuc noi bat.

#### Tieu chi nghiem thu

- Trang chu hien dung du lieu cua dia phuong.
- Menu co the cau hinh tu backend.
- Item co link/path/webview hoat dong dung.

### 5.5. Tin tuc - su kien

#### Cong viec frontend

- Danh sach tin tuc.
- Chi tiet tin tuc.
- Banner/slideshow.
- Loading skeleton.
- Empty state.
- Mo link ngoai bang Zalo webview neu can.

#### Cong viec backend/admin

- CRUD tin tuc.
- Upload thumbnail/banner.
- Trang thai draft/published.
- Sap xep theo ngay dang.

#### Route de xuat

- `/news`
- `/news/:id`

#### Tieu chi nghiem thu

- Nguoi dan xem duoc danh sach tin.
- Nguoi dan xem duoc chi tiet tin.
- Admin tao/sua/an hien tin duoc.

### 5.6. Dat lich lam viec

#### Cong viec frontend

Mo rong form hien tai:

- Ho va ten
- So dien thoai
- CCCD 12 so
- Noi dung lam viec
- Ngay hen
- Gio hen/khung gio

Bo sung validation:

- Ho ten bat buoc.
- So dien thoai dung dinh dang Viet Nam.
- CCCD dung 12 so.
- Ngay hen khong nam trong qua khu.
- Gio hen phai nam trong khung gio lam viec.

Bo sung man hinh ket qua:

- Ma lich hen
- So thu tu
- Ngay/gio hen
- Trang thai
- Huong dan den UBND
- Nut chup/lui/lien he neu can

#### Cong viec backend/admin

- API lay khung gio trong.
- API tao lich hen.
- API lay lich hen cua nguoi dung.
- Admin duyet/tu choi lich hen.
- Cau hinh khung gio lam viec.
- Chong trung slot neu so luong slot co gioi han.

#### Trang thai lich hen

- `pending`
- `approved`
- `rejected`
- `cancelled`
- `completed`

#### Tieu chi nghiem thu

- Nguoi dan tao lich hen thanh cong.
- He thong sinh ma lich hen/so thu tu.
- Admin duyet hoac tu choi lich hen.
- Nguoi dan xem lai trang thai lich hen.

### 5.7. Phan anh - kien nghi

#### Cong viec frontend

- Danh sach phan anh cua nguoi dung.
- Tao phan anh:
  - Tieu de
  - Noi dung
  - Loai phan anh
  - Anh dinh kem
- Chi tiet phan anh:
  - Ma phan anh
  - Trang thai
  - Noi dung da gui
  - Anh da gui
  - Phan hoi cua can bo
  - Thoi gian phan hoi

#### Cong viec backend/admin

- CRUD loai phan anh.
- API tao phan anh.
- API upload anh.
- Admin tiep nhan/phan cong/tra loi.
- Log lich su xu ly.

#### Trang thai de xuat

- `new`
- `processing`
- `responded`
- `rejected`
- `closed`

#### Tieu chi nghiem thu

- Nguoi dan gui phan anh thanh cong.
- Co ma phan anh.
- Admin xem va tra loi phan anh.
- Nguoi dan xem duoc phan hoi.

### 5.8. Tra cuu ho so

#### Cong viec frontend

- Form nhap ma ho so.
- Danh sach ket qua.
- Chi tiet ho so.
- Timeline xu ly.
- Thong bao neu khong tim thay.

#### Cong viec backend

- API tra cuu ho so theo ma.
- Dong bo du lieu ho so tu he thong nguon neu co.

#### Tieu chi nghiem thu

- Tim ho so bang ma.
- Xem trang thai va lich su xu ly.
- Hien thong bao ro khi khong co du lieu.

## 6. Phase 2 - Backend va Admin CMS

### 6.1. Muc tieu

Xay nen tang backend va admin de Mini App co du lieu that va can bo co the van hanh.

### 6.2. Thanh phan he thong

| Thanh phan | Mo ta |
| --- | --- |
| Public API | API cho Zalo Mini App |
| Admin API | API cho CMS |
| Admin Web | Giao dien quan tri |
| Database | Luu du lieu chinh |
| File Storage | Luu anh, van ban, mau don |
| Auth/Admin RBAC | Dang nhap va phan quyen can bo |
| Audit Log | Ghi lai thao tac quan tri |

### 6.3. Database schema can co

Bang toi thieu:

- `organizations`
- `official_accounts`
- `users`
- `admin_users`
- `admin_roles`
- `news_articles`
- `utility_menu_items`
- `procedures`
- `procedure_forms`
- `appointments`
- `feedbacks`
- `feedback_types`
- `profiles`
- `public_documents`
- `hotlines`
- `work_schedules`
- `surveys`
- `survey_questions`
- `survey_answers`
- `planning_documents`
- `projects`
- `biddings`
- `legal_documents`
- `service_links`
- `home_stats`
- `file_assets`
- `audit_logs`

### 6.4. API public toi thieu

#### Organization

- `GET /organizations/by-mini-app/:miniAppId`
- `GET /organizations/:orgId/menu`

#### News

- `GET /organizations/:orgId/articles`
- `GET /articles/:id`

#### Appointment

- `GET /organizations/:orgId/appointments/slots`
- `POST /organizations/:orgId/appointments`
- `GET /me/appointments`
- `GET /appointments/:id`

#### Feedback

- `GET /organizations/:orgId/feedback-types`
- `POST /organizations/:orgId/feedbacks`
- `GET /me/feedbacks`
- `GET /feedbacks/:id`

#### Profiles

- `GET /organizations/:orgId/profiles/search`
- `GET /profiles/:id`

#### Files/Documents

- `GET /organizations/:orgId/documents`
- `GET /documents/:id`

### 6.5. Admin CMS toi thieu

#### Module admin bat buoc

- Dang nhap admin.
- Quan ly thong tin dia phuong.
- Quan ly menu tien ich.
- Quan ly tin tuc.
- Quan ly thu tuc hanh chinh.
- Quan ly mau don/to khai.
- Quan ly lich hen.
- Quan ly phan anh.
- Quan ly hotline.
- Quan ly van ban.
- Quan ly lich cong tac.
- Quan ly khao sat.
- Quan ly tai khoan admin va phan quyen.

#### Tieu chi nghiem thu

- Admin tao/sua/xoa/an hien du lieu.
- Mini App cap nhat du lieu sau khi admin publish.
- Moi thao tac quan trong co audit log.

## 7. Phase 3 - Module dich vu cong thiet yeu

### 7.1. Thu tuc hanh chinh

#### Frontend

- Route `/procedures`
- Route `/procedures/:id`
- Tim kiem co dau/khong dau.
- Loc theo linh vuc.
- Xem chi tiet thu tuc.
- Link nop ho so truc tuyen.
- Link mau don/to khai lien quan.

#### Admin

- CRUD thu tuc.
- Import thu tuc tu file Excel/CSV neu can.
- Gan mau don.
- Gan link nop truc tuyen.

### 7.2. Kho mau don, to khai

#### Frontend

- Route `/forms`
- Danh sach mau don.
- Tim kiem/loc.
- Xem/tai file.

#### Admin

- Upload file.
- Gan file voi thu tuc.
- Quan ly phien ban file.

### 7.3. Kho van ban dien tu

#### Frontend

- Route `/documents`
- Tim kiem theo so van ban, trich yeu, ngay ban hanh.
- Loc theo loai:
  - Nghi quyet Dang uy
  - Nghi quyet HDND
  - Van ban khac
- Xem/tai file.

#### Admin

- Upload van ban.
- Gan metadata.
- Publish/unpublish.

### 7.4. Duong day nong

#### Frontend

- Route `/hotlines`
- Nhom so dien thoai.
- Click de goi.

#### Admin

- CRUD hotline.
- Sap xep thu tu hien thi.

### 7.5. Ban do tru so

#### Frontend

- Route `/location`
- Hien dia chi.
- Nut mo Google Maps.
- Gio lam viec.

#### Admin

- Cau hinh dia chi, toa do, map URL, gio lam viec.

### 7.6. Lich cong tac

#### Frontend

- Route `/work-schedule`
- Xem lich theo ngay/tuan.
- Loc theo lanh dao/phong ban.

#### Admin

- CRUD lich cong tac.
- Import lich tu file neu can.

### 7.7. Khao sat hai long

#### Frontend

- Route `/survey`
- Form cau hoi rating/text.
- Gui ket qua.
- Thong bao cam on.

#### Admin

- Tao khao sat.
- Tao cau hoi.
- Xem bao cao tong hop.
- Export Excel/CSV.

### 7.8. Dieu huong dich vu cong

Tham chieu muc 6.14 cua `requirements-analysis.md`.

#### Frontend

- Route `/public-services` (hoac `/service-hub`).
- Hien danh sach lien ket theo nhom (icon, ten, mo ta).
- Mo lien ket: uu tien deep link app, fallback Zalo webview/trinh duyet ngoai,
  mo store neu chua cai (neu xac dinh duoc).
- Thong bao than thien khi khong mo duoc app.

#### Admin

- CRUD lien ket dich vu cong.
- Cau hinh nhom, thu tu hien thi, bat/tat tung lien ket.
- Cau hinh san cac lien ket pho bien: DVCQG, VNeID, iHanoi, eTax Mobile,
  fanpage, TTDT, OA.

#### Tieu chi nghiem thu

- Nguoi dan mo duoc cac dich vu ngoai tu mot man hinh.
- Lien ket loi/khong mo duoc co fallback ro rang.
- Khong nhung token/thong tin ca nhan vao URL dieu huong.

### 7.9. Trang chu thong minh

Tham chieu muc 6.15 cua `requirements-analysis.md`.

#### Frontend

- Bo sung khu vuc thong ke tren trang chu `/`:
  - Thong tin phuong/xa, dan so, so ho, dien tich.
  - So lieu dich vu cong (ho so tiep nhan/da xu ly/dung han) neu co.
  - Muc do hai long tu khao sat (so/phan tram hoac bieu do nhe).
- The so lieu (stat cards) + empty state khi chua co du lieu.

#### Backend/admin

- API `GET /organizations/:orgId/home-stats`.
- Admin nhap so lieu tinh (dan so, dien tich) va bat/tat tung chi so.
- Tong hop tu dong: hai long tu `/survey`, ho so/lich hen tu `/appointments`,
  phan anh tu `/feedbacks`; co the cache snapshot theo ngay.

#### Tieu chi nghiem thu

- Trang chu hien so lieu dia phuong dung cau hinh.
- Chi so hai long khop voi du lieu khao sat.
- Khong hien so 0 gay hieu nham khi chua co du lieu.

## 8. Phase 4 - Module nang cao

### 8.1. Chatbot AI dich vu cong

#### Phuong an 1: Webview chatbot

- Nhanh trien khai.
- Chatbot chay tren web rieng.
- Mini App mo bang `openWebview`.

#### Phuong an 2: Native chat UI

- Trai nghiem tot hon.
- Can API chatbot rieng.
- Co the luu session trong backend.

#### Backend chatbot can co

- Kho source data:
  - Thu tuc hanh chinh
  - FAQ
  - Hotline
  - Link nop ho so
- RAG/search theo cau hoi.
- Fallback khi khong tra loi duoc.
- Rate limit.
- Log an danh neu can.

#### Tieu chi nghiem thu

- Nguoi dan hoi bang tieng Viet.
- Chatbot tra loi dung thu tuc co trong kho du lieu.
- Neu khong co cau tra loi, chatbot de xuat lien he bo phan mot cua.

### 8.2. Quy hoach

#### Giai doan 1

- Mo link/webview ban do quy hoach.

#### Giai doan 2

- Native list van ban quy hoach.
- Tim kiem/loc.
- Link ban do theo khu vuc.

### 8.3. Du an dau tu

- Danh sach du an.
- Chi tiet du an.
- Tien do.
- Chu dau tu.
- Trang thai.
- Tai lieu lien quan.

### 8.4. Dau thau

- Danh sach thong bao moi thau.
- Ket qua lua chon nha thau.
- Tim kiem/loc.
- Link nguon dau thau neu co.

### 8.5. Crawl/sync data

Neu du lieu lay tu nguon ngoai:

- Xac dinh nguon du lieu.
- Xac dinh tan suat dong bo.
- Luu raw data va normalized data.
- Co log crawl.
- Co co che review truoc publish neu can.

### 8.6. Thu vien phap luat

Tham chieu muc 6.13 cua `requirements-analysis.md`. Xep o Phase 4 vi co thanh
phan AI tom tat va kho du lieu lon.

#### Frontend

- Route `/legal-library`, `/legal-library/:id`.
- Tim kiem co dau/khong dau, loc theo linh vuc/loai van ban.
- Chi tiet van ban: metadata, file, dien giai de hieu, tom tat AI.
- Disclaimer "tom tat tham khao, doi chieu van ban goc".

#### Backend/admin

- CRUD van ban phap luat, gan linh vuc/loai/hieu luc.
- Soan dien giai de hieu.
- Sinh tom tat AI (`POST /legal-documents/:id/summary`), duyet truoc khi public.
- Cache ket qua tom tat de tranh goi AI lap lai.

#### Yeu cau AI

- Tom tat chi dua tren nguon da kiem duyet (khong tu bia).
- Co buoc duyet `draft -> approved` cho tom tat truoc khi hien thi.

#### Tieu chi nghiem thu

- Nguoi dan tra cuu van ban phap luat theo linh vuc.
- Xem duoc dien giai de hieu va tom tat AI da duyet.
- Tom tat luon kem disclaimer va link/file van ban goc.

## 9. Phase 5 - Kiem thu, bao mat, deploy va ban giao

### 9.1. Kiem thu frontend

- Kiem tra tren dev browser.
- Kiem tra tren Zalo app Android.
- Kiem tra tren Zalo app iOS.
- Kiem tra man hinh nho.
- Kiem tra safe area iOS.
- Kiem tra back navigation.
- Kiem tra webview/link ngoai.

### 9.2. Kiem thu nghiep vu

Luong bat buoc:

- Mo Mini App tu Zalo.
- Xem trang chu.
- Xem tin tuc.
- Tim thu tuc.
- Dat lich.
- Xem phieu hen.
- Gui phan anh.
- Xem phan hoi phan anh.
- Tra cuu ho so.
- Goi hotline.
- Tai mau don/van ban.
- Lam khao sat.

### 9.3. Kiem thu admin

- Dang nhap admin.
- Tao tin tuc.
- Publish tin tuc.
- Tao thu tuc.
- Upload mau don.
- Duyet lich hen.
- Tra loi phan anh.
- Tao hotline.
- Tao van ban.
- Xem bao cao khao sat.

### 9.4. Security checklist

- Khong hardcode secret/token.
- Khong dung token fallback trong production.
- Tat mock data trong production.
- API co auth.
- Admin co RBAC.
- Upload file co gioi han type/size.
- Validate input frontend va backend.
- Rate limit endpoint nhay cam:
  - feedback
  - appointment
  - chatbot
  - upload
- Khong log CCCD/token/noi dung nhay cam.
- Co audit log admin.

### 9.5. Deploy Zalo Mini App

#### Chuan bi

- Mini App ID that.
- Thong tin app:
  - Ten app
  - Icon
  - Mo ta
  - Anh preview neu Zalo yeu cau
- Domain backend production.
- Chinh sach quyen truy cap user info.

#### Lenh deploy

```bash
zmp login
zmp deploy
```

Hoac:

```bash
npm run deploy
```

#### Sau deploy

- Quet QR preview.
- Test tren thiet bi that.
- Gui xet duyet/phat hanh theo quy trinh Zalo.

### 9.6. Ban giao van hanh

Tai lieu can ban giao:

- Huong dan cai dat/chay local.
- Huong dan deploy.
- Huong dan cau hinh environment.
- Huong dan su dung admin CMS.
- Huong dan xu ly lich hen.
- Huong dan xu ly phan anh.
- Huong dan cap nhat tin tuc/thu tuc/van ban.
- Tai lieu API.
- Tai lieu backup/restore.

## 10. Ke hoach sprint de xuat

### Sprint 1 - Chuan hoa va setup

Thoi luong de xuat: 1 tuan

Cong viec:

- Sua encoding.
- Tao `.env.example`.
- Cap nhat README/setup.
- Xac nhan chay local.
- Bo token fallback.
- Chuan hoa request error handling.
- Lap API contract chi tiet cho Phase 1.

Ket qua:

- App demo chay on dinh.
- Tai lieu setup ro rang.
- San sang ket noi backend.

### Sprint 2 - Backend loi va organization/news

Thoi luong de xuat: 1-2 tuan

Cong viec:

- Thiet ke database loi.
- Xay API organization.
- Xay API news.
- Xay admin organization/news.
- Ket noi frontend trang chu/tin tuc voi API.

Ket qua:

- Trang chu lay du lieu that.
- Admin quan ly tin tuc.

### Sprint 3 - Dat lich lam viec

Thoi luong de xuat: 1-2 tuan

Cong viec:

- Bo sung form CCCD/gio hen.
- API slot lich hen.
- API tao lich hen.
- Admin duyet/tu choi lich hen.
- Man hinh ket qua lich hen.
- Test validation.

Ket qua:

- Luong dat lich hoan chinh end-to-end.

### Sprint 4 - Phan anh va tra cuu ho so

Thoi luong de xuat: 1-2 tuan

Cong viec:

- API feedback.
- API feedback type.
- Upload anh.
- Admin tra loi phan anh.
- API tra cuu ho so.
- UI chi tiet ho so/timeline.

Ket qua:

- Luong phan anh va tra cuu ho so hoan chinh.

### Sprint 5 - Thu tuc, mau don, van ban

Thoi luong de xuat: 2 tuan

Cong viec:

- Module thu tuc hanh chinh.
- Module mau don/to khai.
- Module kho van ban.
- Admin CRUD/import/upload.
- Tim kiem co dau/khong dau.

Ket qua:

- Nguoi dan tra cuu thu tuc va tai mau don/van ban.

### Sprint 6 - Hotline, ban do, lich cong tac, khao sat

Thoi luong de xuat: 1-2 tuan

Cong viec:

- Module hotline.
- Module ban do tru so.
- Module lich cong tac.
- Module khao sat.
- Module dieu huong dich vu cong (DVCQG, VNeID, iHanoi, eTax, fanpage, TTDT).
- Trang chu thong minh (dashboard thong ke + hai long).
- Admin quan ly cac module.

Ket qua:

- Hoan thien nhom tien ich thiet yeu trong tai lieu.

### Sprint 7 - Chatbot AI va module nang cao

Thoi luong de xuat: 2-4 tuan tuy pham vi

Cong viec:

- Chon phuong an chatbot webview/native.
- Xay chatbot API.
- Nap source thu tuc/FAQ.
- Them fallback lien he can bo.
- Module thu vien phap luat (dien giai + AI tom tat co duyet).
- Module quy hoach/du an/dau thau.
- Crawl/sync data neu can.

Ket qua:

- Co chatbot AI dich vu cong.
- Co cac module nang cao theo tai lieu.

### Sprint 8 - UAT va production

Thoi luong de xuat: 1-2 tuan

Cong viec:

- Test tren Zalo Android/iOS.
- Security review.
- Performance review.
- Fix bug UAT.
- Deploy staging/production.
- Chuan bi ho so phat hanh Zalo.
- Ban giao tai lieu van hanh.

Ket qua:

- App san sang phat hanh/van hanh.

## 11. Phan cong vai tro de xuat

| Vai tro | Trach nhiem |
| --- | --- |
| Product Owner | Xac nhan pham vi, uu tien, nghiem thu |
| BA | Lam ro yeu cau, viet acceptance criteria |
| UI/UX | Thiet ke flow va man hinh Mini App |
| Frontend Dev | Xay Mini App React/ZMP |
| Backend Dev | API, database, auth, file storage |
| Admin Dev | CMS quan tri |
| AI Engineer | Chatbot AI/RAG |
| QA | Test functional, regression, device testing |
| DevOps | Deploy, env, monitoring, backup |
| Security Reviewer | Review auth, PII, upload, admin |

## 12. RACI tom tat

| Hang muc | PO | BA | FE | BE | Admin | QA | DevOps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chot yeu cau | A | R | C | C | C | C | I |
| UI Mini App | C | C | R | C | I | C | I |
| API/backend | C | C | C | R | C | C | I |
| Admin CMS | C | C | C | R | R | C | I |
| Test/UAT | A | C | C | C | C | R | I |
| Deploy | A | I | C | C | I | C | R |

Chu thich:

- R: Responsible
- A: Accountable
- C: Consulted
- I: Informed

## 13. Rủi ro va giai phap

| Rui ro | Anh huong | Giai phap |
| --- | --- | --- |
| Chua co backend/API that | App chi chay demo | Uu tien Phase 2 som, chot API contract truoc |
| Du lieu thu tuc/van ban chua san sang | Chatbot/search kem chinh xac | Lap mau import va quy trinh lam sach du lieu |
| Zalo Mini App co gioi han SDK/quyen | Mot so luong khong chay nhu web thuong | Test som tren thiet bi that |
| Xu ly CCCD/SDT khong an toan | Rui ro du lieu ca nhan | Security review, ma hoa, audit log, han che log |
| Encoding tieng Viet loi | Giao dien khong dung | Chuan hoa UTF-8 ngay Sprint 1 |
| Chatbot tra loi sai | Anh huong uy tin | Dung RAG theo source duyet, fallback khi khong chac chan |
| Crawl du lieu nguon ngoai khong on dinh | Du lieu thieu/sai | Co job log, retry, manual review truoc publish |

## 14. Definition of Done

Mot task/module duoc xem la hoan thanh khi:

- Co UI hoan thien theo flow da chot.
- Co API hoac mock contract ro rang.
- Co loading, empty, error state.
- Co validation input.
- Co xu ly quyen/token neu can.
- Co test toi thieu cho logic quan trong.
- Chay duoc tren Zalo Mini App dev/preview.
- Khong co loi lint/type nghiem trong.
- Co acceptance criteria duoc PO/BA xac nhan.
- Co tai lieu su dung/cau hinh neu module can van hanh.

## 15. Checklist truoc production

- [ ] Sua het text mojibake.
- [ ] Co `.env.production` dung.
- [ ] Co Mini App ID that.
- [ ] Khong import `services.mock` trong production.
- [ ] Khong hardcode token/secret.
- [ ] Backend production co HTTPS.
- [ ] Admin co auth va RBAC.
- [ ] Upload co gioi han file.
- [ ] API co rate limit.
- [ ] Co audit log admin.
- [ ] Test tren Android.
- [ ] Test tren iOS.
- [ ] Test deploy bang `zmp deploy`.
- [ ] Co tai lieu van hanh.
- [ ] Co quy trinh backup/restore.
- [ ] Co nguoi phu trach xu ly phan anh/lich hen sau khi launch.

## 16. Thu tu thuc hien khuyen nghi

Thu tu uu tien nen la:

1. Chuan hoa project va sua loi nen tang.
2. Xay backend loi va admin toi thieu.
3. Ket noi frontend voi API that.
4. Hoan thien dat lich va phan anh.
5. Bo sung thu tuc, mau don, van ban.
6. Bo sung hotline, ban do, lich cong tac, khao sat, dieu huong DVC, trang chu thong minh.
7. Bo sung chatbot AI va thu vien phap luat (AI tom tat).
8. Bo sung quy hoach, du an, dau thau.
9. Kiem thu, security review, deploy Zalo.

## 17. Ket luan

Du an hien tai co nen frontend phu hop de phat trien Zalo Mini App dich vu cong, nhung can mot ke hoach trien khai theo tung phase de tranh mo rong qua nhanh khi chua co backend va du lieu that.

Uu tien cao nhat la lam cho cac luong loi chay end-to-end:

- Trang chu
- Tin tuc
- Dat lich
- Phan anh
- Tra cuu ho so
- Thu tuc hanh chinh

Sau khi cac luong loi on dinh, co the mo rong sang chatbot AI va cac module cong khai thong tin nhu quy hoach, du an, dau thau.
