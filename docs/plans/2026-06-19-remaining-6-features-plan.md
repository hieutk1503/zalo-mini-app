# Remaining 6 Features Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement the 6 remaining features (Planning, Investment, Bidding, Schedule, Form Templates, Surveys) using isolated database tables and RESTful endpoints.

**Architecture:** We will update the Prisma schema to add 6 new tables: `Planning`, `InvestmentProject`, `Bidding`, `WorkSchedule`, `FormTemplate`, and `Survey`. We will then create 6 NestJS modules with standard CRUD operations, and integrate them into the React frontend.

**Tech Stack:** NestJS, Prisma, PostgreSQL, React (Vite), TailwindCSS.

---

### Task 1: Update Prisma Schema

**Files:**
- Modify: `backend-nestjs/prisma/schema.prisma`

**Step 1: Write the minimal implementation**

```prisma
model Planning {
  id         Int      @id @default(autoincrement())
  title      String
  content    String   @db.Text
  image      String?
  file_url   String?
  created_at DateTime @default(now())
}

model InvestmentProject {
  id           Int      @id @default(autoincrement())
  project_name String
  description  String   @db.Text
  status       String
  start_date   DateTime?
  end_date     DateTime?
  budget       Decimal?
  created_at   DateTime @default(now())
}

model Bidding {
  id                Int      @id @default(autoincrement())
  package_name      String
  price             Decimal?
  start_date        DateTime?
  end_date          DateTime?
  requirements_file String?
  created_at        DateTime @default(now())
}

model WorkSchedule {
  id         Int      @id @default(autoincrement())
  title      String
  event_date DateTime
  time       String?
  location   String?
  attendees  String?
  created_at DateTime @default(now())
}

model FormTemplate {
  id           Int        @id @default(autoincrement())
  name         String
  file_url     String
  procedure_id Int?
  procedure    Procedure? @relation(fields: [procedure_id], references: [id])
  created_at   DateTime   @default(now())
}

model Survey {
  id           Int      @id @default(autoincrement())
  rating       Int
  comment      String?  @db.Text
  user_zalo_id String?
  created_at   DateTime @default(now())
}
```

*Note: You also need to add `form_templates FormTemplate[]` to the `Procedure` model.*

**Step 2: Run Prisma push**

Run: `cd backend-nestjs && npx prisma db push && npx prisma generate`
Expected: Database updated successfully.

**Step 3: Commit**

```bash
git add backend-nestjs/prisma/schema.prisma
git commit -m "feat(db): add schema for 6 remaining features"
```

---

### Task 2: Create NestJS Modules

**Files:**
- Create: backend-nestjs/src/planning/*, investment/*, bidding/*, work-schedule/*, form-template/*, survey/*

**Step 1: Generate modules**

Run:
```bash
cd backend-nestjs
npx nest g resource planning --no-spec
npx nest g resource investment --no-spec
npx nest g resource bidding --no-spec
npx nest g resource work-schedule --no-spec
npx nest g resource form-template --no-spec
npx nest g resource survey --no-spec
```

**Step 2: Implement CRUD for Planning (Example - repeat for others)**

```typescript
// src/planning/planning.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanningService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.planning.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.planning.findUnique({ where: { id } });
  }
}
```

**Step 3: Commit**

```bash
git add backend-nestjs/src
git commit -m "feat(backend): generate and implement CRUD modules for remaining features"
```

---

### Task 3: Build React Frontend Pages

**Files:**
- Create: `frontend-zalo/src/pages/Planning.tsx`, `Investment.tsx`, `Bidding.tsx`, `WorkSchedule.tsx`, `Forms.tsx`
- Modify: `frontend-zalo/src/pages/ProcedureDetail.tsx` (Add Form download button)
- Modify: `frontend-zalo/src/App.tsx` (Add Routes)

**Step 1: Create Planning Page (Example)**

```tsx
import React, { useEffect, useState } from 'react';
import { Page, Box, Text, List } from 'zmp-ui';
import api from '../lib/api';

export default function Planning() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/planning').then(res => setData(res.data));
  }, []);

  return (
    <Page className="bg-gray-100">
      <Box className="p-4 bg-white shadow-sm mb-2">
        <Text size="xLarge" className="font-bold text-primary">Thông tin quy hoạch</Text>
      </Box>
      <List>
        {data.map((item: any) => (
          <List.Item key={item.id} title={item.title} subTitle={new Date(item.created_at).toLocaleDateString()} />
        ))}
      </List>
    </Page>
  );
}
```

**Step 2: Update App Routes**

Add routing in `App.tsx` for the new pages.

**Step 3: Commit**

```bash
git add frontend-zalo/src
git commit -m "feat(frontend): add pages for planning, investment, bidding, forms, schedules"
```

---

### Task 4: Survey Modal Integration

**Files:**
- Create: `frontend-zalo/src/components/SurveyModal.tsx`
- Modify: `frontend-zalo/src/pages/Appointments.tsx`

**Step 1: Create SurveyModal Component**

Create a modal that pops up after successful appointment booking, using Zalo UI `Modal`, submitting data to `POST /survey`.

**Step 2: Commit**

```bash
git add frontend-zalo/src/components/SurveyModal.tsx frontend-zalo/src/pages/Appointments.tsx
git commit -m "feat(frontend): integrate survey modal after appointment booking"
```
