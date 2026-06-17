# Excel Import Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a fullstack Excel import feature for Administrative Procedures with duplicate collision detection and user confirmation for overwriting.

**Architecture:** Backend (NestJS) will parse uploaded Excel files using `xlsx` and `multer`, offering preview and execute endpoints. Frontend (React) will have a dedicated `/admin/import` route to upload files, review conflicts, and confirm the import.

**Tech Stack:** NestJS, Prisma, React, xlsx, multer

---

### Task 1: Setup Backend Dependencies

**Files:**
- Modify: `backend-nestjs/package.json`

**Step 1: Install packages**
```bash
cd backend-nestjs
npm install xlsx @nestjs/platform-express multer
npm install -D @types/multer
```

### Task 2: Implement Procedures Service Logic

**Files:**
- Modify: `backend-nestjs/src/procedures/procedures.service.ts`

**Step 1: Write the minimal implementation**
Add `xlsx` parsing, `previewImport` (to detect conflicts), and `executeImport` (to save data with overwrite logic).

```typescript
import * as xlsx from 'xlsx';

// Add to ProceduresService
async previewImport(buffer: Buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  const existingCodes = (await this.prisma.administrativeProcedure.findMany({ select: { code: true } })).map(p => p.code);
  
  const conflicts = data.filter((row: any) => existingCodes.includes(row['Mã thủ tục']));
  const newRecords = data.filter((row: any) => !existingCodes.includes(row['Mã thủ tục']));
  
  return { newCount: newRecords.length, conflictCount: conflicts.length, conflicts };
}

async executeImport(buffer: Buffer, overwrite: boolean) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  let successCount = 0;
  for (const row of data) {
    const code = row['Mã thủ tục'];
    if (!code) continue;

    const payload = {
      title: row['Tên thủ tục'] || '',
      description: row['Mô tả'] || '',
      fee: row['Lệ phí']?.toString() || '',
      duration: row['Thời gian']?.toString() || '',
      process_steps: row['Các bước'] || '',
      is_active: true
    };

    if (overwrite) {
      await this.prisma.administrativeProcedure.upsert({
        where: { code },
        update: payload,
        create: { code, ...payload }
      });
      successCount++;
    } else {
      const exists = await this.prisma.administrativeProcedure.findUnique({ where: { code } });
      if (!exists) {
        await this.prisma.administrativeProcedure.create({ data: { code, ...payload } });
        successCount++;
      }
    }
  }
  return { successCount };
}
```

**Step 2: Commit**
```bash
git add backend-nestjs/src/procedures/procedures.service.ts backend-nestjs/package.json backend-nestjs/package-lock.json
git commit -m "feat(backend): add service logic for excel import"
```

### Task 3: Implement Procedures Controller

**Files:**
- Modify: `backend-nestjs/src/procedures/procedures.controller.ts`

**Step 1: Write the minimal implementation**
Add endpoints for `/import/preview` and `/import/execute` using `FileInterceptor`.

```typescript
import { UseInterceptors, UploadedFile, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// Add to ProceduresController
@Post('import/preview')
@UseInterceptors(FileInterceptor('file'))
async previewImport(@UploadedFile() file: Express.Multer.File) {
  return this.proceduresService.previewImport(file.buffer);
}

@Post('import/execute')
@UseInterceptors(FileInterceptor('file'))
async executeImport(
  @UploadedFile() file: Express.Multer.File,
  @Body('overwrite') overwriteStr: string
) {
  const overwrite = overwriteStr === 'true';
  return this.proceduresService.executeImport(file.buffer, overwrite);
}
```

**Step 2: Commit**
```bash
git add backend-nestjs/src/procedures/procedures.controller.ts
git commit -m "feat(backend): add endpoints for excel import"
```

### Task 4: Admin Import UI (Frontend)

**Files:**
- Create: `frontend-zalo/src/pages/AdminImport.tsx`
- Modify: `frontend-zalo/src/App.tsx`

**Step 1: Write the minimal implementation**
Create the Admin UI with a file input, preview table, and confirm button.

```tsx
// frontend-zalo/src/pages/AdminImport.tsx
import { useState } from 'react';
import axios from 'axios';

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [overwrite, setOverwrite] = useState(false);

  const handlePreview = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('http://localhost:3000/procedures/import/preview', formData);
    setPreview(res.data);
  };

  const handleExecute = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('overwrite', overwrite.toString());
    const res = await axios.post('http://localhost:3000/procedures/import/execute', formData);
    alert(`Thành công! Đã nhập ${res.data.successCount} thủ tục.`);
    setPreview(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Nhập dữ liệu Thủ tục từ Excel</h1>
      <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handlePreview} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Preview</button>
      
      {preview && (
        <div className="mt-4 p-4 border rounded">
          <p>Mới: {preview.newCount} | Trùng: {preview.conflictCount}</p>
          <label className="flex items-center space-x-2 mt-2">
            <input type="checkbox" checked={overwrite} onChange={e => setOverwrite(e.target.checked)} />
            <span>Ghi đè thủ tục bị trùng</span>
          </label>
          <button onClick={handleExecute} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">Xác nhận Nhập</button>
        </div>
      )}
    </div>
  );
}
```

Add route in `App.tsx`:
```tsx
import AdminImport from './pages/AdminImport';
// Add to Routes: <Route path="/admin/import" element={<AdminImport />} />
```

**Step 2: Commit**
```bash
git add frontend-zalo/src/
git commit -m "feat(frontend): create admin excel import UI"
```
