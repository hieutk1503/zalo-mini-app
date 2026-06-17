# Interaction & Appointments Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Triển khai Backend API và Frontend UI cho nhóm tính năng Đặt lịch làm việc và Phản ánh hiện trường sử dụng Soft Auth.

**Architecture:** Sử dụng Prisma cho DB, NestJS Controllers/Services cho API, React (Vite) + Tailwind cho UI. Lưu `zalo_id` ở localStorage để định danh (Soft Auth).

**Tech Stack:** NestJS, Prisma, React, Zustand, TailwindCSS

---

### Task 1: Thiết lập Soft Auth Middleware / Guard (Backend)

**Files:**
- Create: `src/auth/soft-auth.guard.ts`
- Create: `src/auth/current-user.decorator.ts`
- Modify: `src/app.module.ts`

**Step 1: Write the Auth Guard**
```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SoftAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const zaloId = request.headers['x-zalo-id'];
    const fullName = request.headers['x-full-name'] || 'Công dân';
    const phone = request.headers['x-phone'] || '';

    if (!zaloId) {
      throw new UnauthorizedException('Thiếu zalo_id');
    }

    let citizen = await this.prisma.citizen.findUnique({ where: { zalo_id: zaloId } });
    if (!citizen) {
      citizen = await this.prisma.citizen.create({
        data: { zalo_id: zaloId, full_name: fullName, phone: phone },
      });
    }

    request.user = citizen;
    return true;
  }
}
```

**Step 2: Cập nhật AppModule để đăng ký AuthModule (nếu cần)**
Thêm `AuthGuard` vào Providers nếu muốn áp dụng Global, hoặc chỉ inject vào Controller của Appointment.

### Task 2: API Đặt lịch làm việc (Appointments)

**Files:**
- Create: `src/appointments/appointments.module.ts`
- Create: `src/appointments/appointments.controller.ts`
- Create: `src/appointments/appointments.service.ts`

**Step 1: Write logic Service**
```typescript
async createAppointment(citizenId: number, data: { date: Date, timeSlot: string, content: string }) {
  const ticketNumber = `TL-${Math.floor(1000 + Math.random() * 9000)}`;
  return this.prisma.appointment.create({
    data: {
      ticket_number: ticketNumber,
      citizen_id: citizenId,
      appointment_date: new Date(data.date),
      time_slot: data.timeSlot,
      content: data.content,
      status: 'PENDING'
    }
  });
}

async getMyAppointments(citizenId: number) {
  return this.prisma.appointment.findMany({ where: { citizen_id: citizenId }, orderBy: { created_at: 'desc' } });
}
```

**Step 2: Write Controller**
Gắn `@UseGuards(SoftAuthGuard)` và expose endpoint `POST /appointments` & `GET /appointments`.

### Task 3: API Phản ánh hiện trường (Feedbacks)

**Files:**
- Create: `src/feedbacks/feedbacks.module.ts`
- Create: `src/feedbacks/feedbacks.controller.ts`
- Create: `src/feedbacks/feedbacks.service.ts`

**Step 1: Write logic Service & Controller**
Tương tự Task 2, tạo endpoint `POST /feedbacks` (nhận `content`, `imageUrls`) và `GET /feedbacks` (trả về danh sách).

### Task 4: Frontend - Tích hợp Soft Auth Store (Zustand)

**Files:**
- Create: `src/store/authStore.ts`

**Step 1: Write Zustand Store**
```typescript
import { create } from 'zustand';

interface AuthState {
  zaloId: string | null;
  fullName: string | null;
  phone: string | null;
  login: (id: string, name: string, phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  zaloId: localStorage.getItem('zalo_id'),
  fullName: localStorage.getItem('full_name'),
  phone: localStorage.getItem('phone'),
  login: (id, name, phone) => {
    localStorage.setItem('zalo_id', id);
    localStorage.setItem('full_name', name);
    localStorage.setItem('phone', phone);
    set({ zaloId: id, fullName: name, phone });
  },
  logout: () => {
    localStorage.clear();
    set({ zaloId: null, fullName: null, phone: null });
  }
}));
```

**Step 2: Interceptor Axios**
Tạo file `src/lib/axios.ts` để tự động đính kèm header `x-zalo-id` vào mọi request gửi đi.

### Task 5: Frontend - Auth Modal & Trang Đặt Lịch (Appointments)

**Files:**
- Create: `src/components/AuthModal.tsx`
- Create: `src/pages/Appointments.tsx`

**Step 1: Auth Modal**
Nếu `zaloId` bị null, chặn người dùng bằng một Modal bắt buộc nhập Tên và SĐT. Sinh random ID (ví dụ: `ZALO-98765`) khi bấm lưu.

**Step 2: Appointments Page**
Form gồm Datepicker, Dropdown chọn giờ, Textarea nội dung. Bấm "Gửi" -> Call POST `/appointments`. Show Ticket Modal khi thành công.

### Task 6: Frontend - Trang Phản ánh (Feedbacks) & Cá nhân (Profile)

**Files:**
- Create: `src/pages/Feedbacks.tsx`
- Create: `src/pages/Profile.tsx`

**Step 1: Feedbacks Page**
Form nhập nội dung phản ánh. Hiển thị danh sách lịch sử ở ngay bên dưới hoặc chia Tab.

**Step 2: Profile Page**
Hiển thị thông tin cá nhân hiện tại. Liệt kê tổng hợp danh sách Lịch hẹn và Phản ánh của user đó.
