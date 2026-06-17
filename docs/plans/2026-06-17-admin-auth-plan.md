# Admin Authentication Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Provide a secure JWT-based login and Role-Based Access Control (RBAC) system for Admin users.

**Architecture:** Backend (NestJS) issues JWT upon successful login. Frontend (React) stores token and uses Axios interceptor to append `Authorization: Bearer <token>` for protected admin requests. Protected APIs use a custom `AdminAuthGuard`.

**Tech Stack:** NestJS, `@nestjs/jwt`, `bcrypt`, React, Axios.

---

### Task 1: Setup Backend Auth & Seed First Admin

**Files:**
- Create: `backend-nestjs/prisma/seed.ts` (if missing) or simple script.
- Modify: `backend-nestjs/package.json`

**Step 1: Install Dependencies**
Run: `npm i @nestjs/jwt bcrypt && npm i -D @types/bcrypt` in `backend-nestjs`
Expected: Installation completes successfully.

**Step 2: Seed First Admin**
Create an admin script or use Prisma studio to insert a default Admin:
`email`: `admin@visssoft.vn`, `password_hash`: (bcrypt hash of `123456`), `role`: `SUPER_ADMIN`

### Task 2: Implement Admin Auth Module (Backend)

**Files:**
- Create: `backend-nestjs/src/admin-auth/admin-auth.module.ts`
- Create: `backend-nestjs/src/admin-auth/admin-auth.service.ts`
- Create: `backend-nestjs/src/admin-auth/admin-auth.controller.ts`

**Step 1: Write Controller & Service**
Create `AdminAuthService` with `login()` method checking bcrypt password.
Create `AdminAuthController` to expose `POST /admin-auth/login`.

**Step 2: Register Module**
Import `AdminAuthModule` and `JwtModule.register()` inside `app.module.ts`.

### Task 3: Implement AdminAuthGuard

**Files:**
- Create: `backend-nestjs/src/admin-auth/admin-auth.guard.ts`
- Modify: `backend-nestjs/src/procedures/procedures.controller.ts`

**Step 1: Write Guard**
Implement `CanActivate` using `JwtService.verifyAsync()`. Check if `user.role` is valid.

**Step 2: Apply Guard to Import APIs**
Add `@UseGuards(AdminAuthGuard)` to `@Post('import/preview')` and `@Post('import/execute')`.

**Step 3: Test Guard**
Run: `curl -X POST http://localhost:3000/procedures/import/preview`
Expected: 401 Unauthorized.

### Task 4: Admin Login UI (Frontend)

**Files:**
- Create: `frontend-zalo/src/pages/AdminLogin.tsx`
- Modify: `frontend-zalo/src/App.tsx`

**Step 1: Create Login Component**
Write React component with Email & Password input. Call `POST /admin-auth/login`. Save token to `localStorage` on success, navigate to `/admin/import`.

**Step 2: Add Route**
Add `<Route path="admin/login" element={<AdminLogin />} />` to `App.tsx`.

### Task 5: Setup Axios Interceptor

**Files:**
- Create: `frontend-zalo/src/lib/axiosAdmin.ts`
- Modify: `frontend-zalo/src/pages/AdminImport.tsx`

**Step 1: Create Interceptor**
Create an Axios instance that reads `localStorage.getItem('admin_token')` and attaches it to Headers. If response is 401, redirect to `/admin/login`.

**Step 2: Use in AdminImport**
Replace `axios.post` with the new intercepted instance in `AdminImport.tsx`.

**Step 3: Final Test**
Run servers. Try to upload without login -> Redirect to login.
Login -> Upload successfully.
