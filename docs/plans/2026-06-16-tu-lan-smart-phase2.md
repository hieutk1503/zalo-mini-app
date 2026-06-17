# Tu Lạn Smart Phase 2 Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Thiết lập Cơ sở dữ liệu bằng Prisma, cấu hình `pgvector` cho AI, và xây dựng nền tảng API cốt lõi trong NestJS.

**Architecture:** Mở rộng dự án NestJS ở Phase 1. Khai báo toàn bộ các model dữ liệu (Citizen, Admin, AdministrativeProcedure, ProcedureVector, Appointment, Feedback, News, Document). Triển khai Auth module và các CRUD API cơ bản.

---

### Task 1: Khai báo Prisma Schema cho toàn bộ dự án

**Files:**
- Modify: `backend-nestjs/prisma/schema.prisma`

**Step 1: Write the failing test**
Chưa có test cho schema. Kiểm tra syntax prisma là test chính.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Mở `backend-nestjs/prisma/schema.prisma` và bổ sung cấu hình `pgvector` cùng các Models (Citizen, Admin, AdministrativeProcedure, ProcedureVector, Appointment, Feedback, News, Document).

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}

model Citizen {
  id           Int           @id @default(autoincrement())
  zalo_id      String        @unique
  full_name    String?
  phone        String?
  cccd         String?
  avatar_url   String?
  appointments Appointment[]
  feedbacks    Feedback[]
  created_at   DateTime      @default(now())
}

model Admin {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  password_hash String
  full_name     String
  role          String   @default("CAN_BO")
  created_at    DateTime @default(now())
}

model AdministrativeProcedure {
  id            Int               @id @default(autoincrement())
  code          String            @unique
  title         String
  description   String?
  fee           String?
  duration      String?
  process_steps String?
  is_active     Boolean           @default(true)
  vectors       ProcedureVector[]
  created_at    DateTime          @default(now())
}

model ProcedureVector {
  id            Int                     @id @default(autoincrement())
  procedure_id  Int
  procedure     AdministrativeProcedure @relation(fields: [procedure_id], references: [id])
  content_chunk String
  embedding     Unsupported("vector")?
  created_at    DateTime                @default(now())
}

model Appointment {
  id               Int      @id @default(autoincrement())
  ticket_number    String   @unique
  citizen_id       Int
  citizen          Citizen  @relation(fields: [citizen_id], references: [id])
  appointment_date DateTime
  time_slot        String
  content          String
  status           String   @default("PENDING")
  created_at       DateTime @default(now())
}

model Feedback {
  id          Int      @id @default(autoincrement())
  citizen_id  Int
  citizen     Citizen  @relation(fields: [citizen_id], references: [id])
  content     String
  image_urls  String?
  status      String   @default("NEW")
  admin_reply String?
  created_at  DateTime @default(now())
}

model News {
  id           Int      @id @default(autoincrement())
  title        String
  content      String
  thumbnail    String?
  published_at DateTime @default(now())
}

model Document {
  id          Int      @id @default(autoincrement())
  document_no String   @unique
  abstract    String
  file_url    String
  type        String
  created_at  DateTime @default(now())
}
```

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npx prisma format`
Expected: PASS (Prisma format thành công, syntax hợp lệ)

**Step 5: Commit**
```bash
git add backend-nestjs/prisma/schema.prisma
git commit -m "feat(db): define core prisma schema and pgvector"
```

---

### Task 2: Setup Database Migration và Khởi tạo Module NestJS

**Files:**
- Modify: `docker-compose.yml` (nếu cần bật extension, nhưng postgres:15 có thể cần image `pgvector/pgvector:pg15`)
- Create: `backend-nestjs/src/prisma/prisma.module.ts`
- Create: `backend-nestjs/src/prisma/prisma.service.ts`

**Step 1: Write the failing test**
Run: `cd backend-nestjs && npm run start` (Thiếu PrismaService)

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Sửa `docker-compose.yml` (ở root) để dùng image `pgvector/pgvector:pg15` thay vì `postgres:15`.
Trong `docker-compose.yml`:
Thay đổi `image: postgres:15` thành `image: pgvector/pgvector:pg15`.

Tạo `backend-nestjs/src/prisma/prisma.service.ts`:
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

Tạo `backend-nestjs/src/prisma/prisma.module.ts`:
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Khai báo vào `backend-nestjs/src/app.module.ts`:
Thêm `PrismaModule` vào `imports`.

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npx prisma generate && npm run build`
Expected: PASS (Build thành công)

**Step 5: Commit**
```bash
git add .
git commit -m "feat(core): setup pgvector image and nestjs prisma service"
```

---

### Task 3: Tạo REST API Scaffold cho Thủ Tục Hành Chính (Procedures)

**Files:**
- Create: `backend-nestjs/src/procedures/`

**Step 1: Write the failing test**
N/A cho code generation.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Dùng Nest CLI để sinh module:
```bash
cd backend-nestjs
npx nest g resource procedures --no-spec
```
(Chọn REST API, generate CRUD).

Cập nhật `backend-nestjs/src/procedures/procedures.service.ts` để tiêm `PrismaService` và gọi CRUD từ bảng `AdministrativeProcedure`.

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.administrativeProcedure.findMany();
  }

  findOne(id: number) {
    return this.prisma.administrativeProcedure.findUnique({ where: { id } });
  }
}
```

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add backend-nestjs/src/procedures/ backend-nestjs/src/app.module.ts
git commit -m "feat(api): scaffold procedures module"
```
