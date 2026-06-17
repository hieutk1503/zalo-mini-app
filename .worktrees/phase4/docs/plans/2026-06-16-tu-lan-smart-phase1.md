# Tu Lạn Smart Phase 1 Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Khởi tạo cấu trúc dự án (Monorepo), thiết lập các dịch vụ cốt lõi (NestJS Backend, Python AI Service, Frontend Zalo Mini App) và môi trường cơ sở dữ liệu (PostgreSQL qua Docker Compose).

**Architecture:** Monorepo chứa 3 thư mục độc lập giao tiếp qua mạng: `frontend-zalo`, `backend-nestjs`, `ai-service`. Các service dùng PostgreSQL lưu trữ.

**Tech Stack:** zmp-cli (React), NestJS (TypeScript), FastAPI (Python), PostgreSQL, Docker Compose.

---

### Task 1: Thiết lập thư mục gốc và file Readme

**Files:**
- Create: `README.md`
- Create: `docker-compose.yml`

**Step 1: Write the failing test**
Không áp dụng TDD cho file cấu hình gốc. Chúng ta sẽ tạo trực tiếp cấu trúc thư mục.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo file `README.md`:
```markdown
# Tu Lạn Smart - Zalo Mini App

Dự án tương tác số chính quyền và người dân.
Gồm 3 components:
- `frontend-zalo`: Zalo Mini App (React)
- `backend-nestjs`: Main API (NestJS/TypeScript)
- `ai-service`: Chatbot API (FastAPI/Python)
```

Tạo file `docker-compose.yml` để chạy PostgreSQL:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: tu-lan-postgres
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: password
      POSTGRES_DB: tu_lan_smart
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

**Step 4: Run test to verify it passes**
Chạy lệnh kiểm tra cú pháp docker:
Run: `docker-compose config`
Expected: PASS (In ra cấu hình docker hợp lệ)

**Step 5: Commit**
```bash
git add README.md docker-compose.yml
git commit -m "chore: setup project root and docker-compose"
```

---

### Task 2: Khởi tạo Backend NestJS & Prisma

**Files:**
- Create: `backend-nestjs/`

**Step 1: Write the failing test**
N/A cho việc khởi tạo scaffolding.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Chạy các lệnh tạo dự án NestJS:
```bash
# Cài đặt Nest CLI nếu chưa có (chạy global)
# npm i -g @nestjs/cli

# Tạo dự án mới
nest new backend-nestjs --package-manager npm --strict --skip-git

# Đi vào thư mục và cài đặt Prisma
cd backend-nestjs
npm install prisma --save-dev
npx prisma init
```

Cập nhật `backend-nestjs/prisma/schema.prisma` để trỏ tới database ở Task 1:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Cập nhật `backend-nestjs/.env`:
```env
DATABASE_URL="postgresql://root:password@localhost:5432/tu_lan_smart?schema=public"
```

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npm run build`
Expected: PASS (Build success)

**Step 5: Commit**
```bash
git add backend-nestjs/
git commit -m "chore: init nestjs backend and prisma"
```

---

### Task 3: Khởi tạo AI Service (Python FastAPI)

**Files:**
- Create: `ai-service/main.py`
- Create: `ai-service/requirements.txt`

**Step 1: Write the failing test**

Tạo file `ai-service/test_main.py`:
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Service is running"}
```

**Step 2: Run test to verify it fails**
Run: `cd ai-service && pytest`
Expected: FAIL (main module not found)

**Step 3: Write minimal implementation**

Tạo file `ai-service/requirements.txt`:
```txt
fastapi
uvicorn
pytest
httpx
```

Tạo file `ai-service/main.py`:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}
```

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pip install -r requirements.txt && pytest`
Expected: PASS

**Step 5: Commit**
```bash
git add ai-service/
git commit -m "chore: init python fastapi ai-service"
```

---

### Task 4: Khởi tạo Zalo Mini App Frontend

**Files:**
- Create: `frontend-zalo/`

**Step 1: Write the failing test**
N/A cho scaffolding dự án Zalo.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Khởi tạo dự án Zalo:
```bash
# Cài đặt ZMP CLI (nếu chưa có)
# npm install -g zmp-cli

# Khởi tạo dự án
zmp init frontend-zalo
# (Chọn React, JavaScript/TypeScript tuỳ theo thiết lập tự động, hoặc chạy non-interactive)
```
*(Ghi chú: Bước này cần chạy thực tế tuỳ vào zmp-cli)*

**Step 4: Run test to verify it passes**
Kiểm tra package.json đã được sinh ra:
Run: `cat frontend-zalo/package.json`
Expected: Hiển thị cấu trúc package.json của zmp

**Step 5: Commit**
```bash
git add frontend-zalo/
git commit -m "chore: init zalo mini app frontend"
```
