# Frontend Migration & Integration Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Replace `frontend-zalo` with the Zalo E-Gov Sample (`ward-mini-app-zalo/mna-zaui-egov-sample`), porting over our AI Chat and Admin features.

**Architecture:** We will clear `frontend-zalo`, copy the new template over, and re-inject the specific AI logic and Admin interfaces we built into the Zalo mini app structure. We will integrate the AI directly into the Zalo `Chatbot` page.

**Tech Stack:** React, Vite, Tailwind CSS, Zalo UI (zmp-ui), Axios

## User Review Required
> [!IMPORTANT]
> The current floating Chat widget will be removed and AI capabilities will be exclusively available via the `Chatbot` page in the new app.
> The Admin pages will be hidden under `/admin` routing, maintaining existing JWT authentication logic.

---

### Task 1: Create worktree
**Files:**
- Run commands

**Step 1: Create git worktree**
Run: `git worktree add .worktrees/frontend-migration -b feature/frontend-migration`
Expected: PASS

---

### Task 2: Replace Base Template
**Files:**
- Modify: `frontend-zalo/*`

**Step 1: Delete old frontend contents and copy new template**
```bash
cd .worktrees/frontend-migration/frontend-zalo
Remove-Item -Recurse -Force * -Exclude node_modules, .env
Copy-Item -Recurse -Force ../../ward-mini-app-zalo/mna-zaui-egov-sample/* .
```

**Step 2: Install dependencies**
```bash
npm install axios react-markdown remark-gfm react-router-dom lucide-react clsx tailwind-merge date-fns
```

**Step 3: Commit**
```bash
git add .
git commit -m "chore: bootstrap frontend-zalo with mna-zaui-egov-sample"
```

---

### Task 3: Port Admin Pages
**Files:**
- Create: `frontend-zalo/src/pages/Admin/AdminLogin.tsx`
- Create: `frontend-zalo/src/pages/Admin/AdminNews.tsx`
- Modify: `frontend-zalo/src/components/router.tsx` or equivalent main router.

**Step 1: Port Admin components**
Copy the previously written `AdminLogin.tsx` and `AdminNews.tsx` into the new `pages/Admin` folder, adjusting imports for Tailwind and `lucide-react`.

**Step 2: Configure Admin Routing**
Find the main ZMP Router definition (e.g., in `app.tsx` or `pages/index.tsx`) and add `<Route path="/admin" element={<AdminLogin />} />` and `<Route path="/admin/news" element={<AdminNews />} />`.

**Step 3: Commit**
```bash
git add .
git commit -m "feat: port Admin UI to new frontend"
```

---

### Task 4: Integrate AI Chatbot
**Files:**
- Modify: `frontend-zalo/src/pages/Chatbot/index.tsx` (or equivalent file)

**Step 1: Connect to AI Service**
Rewrite the Chatbot page's message handling to connect to `http://localhost:8000/api/chat/query` using the streaming logic (`fetch` + `Reader`) we previously built. Ensure markdown parsing is applied to the messages.

**Step 2: Commit**
```bash
git add .
git commit -m "feat: hook Chatbot page to AI Service"
```

---

### Task 5: Connect News API
**Files:**
- Modify: `frontend-zalo/src/pages/News/index.tsx` (or equivalent data fetcher)

**Step 1: Update News Data Source**
Replace mock data with an API call to `http://localhost:3000/news`.

**Step 2: Commit**
```bash
git add .
git commit -m "feat: connect News page to NestJS backend"
```
