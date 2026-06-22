# Homepage Upgrade Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Rewrite the `Home.tsx` page using Tailwind v4 to mimic the Zalo e-Gov sample UI (Hero Header, Stat Cards, Categorized Tile Grids, Featured News).

**Architecture:** Single file `Home.tsx` (with internal functional components for simplicity, as it's a UI refactor). We will retain the `axios` call for fetching news.

**Tech Stack:** React 19, TailwindCSS v4, Lucide React.

---

### Task 1: Create worktree and setup

**Files:**
- Create branch: `feature/home-upgrade`

**Step 1: Create git worktree**

Run: `git fetch && git worktree add .worktrees/home-upgrade -b feature/home-upgrade`

**Step 2: Commit**
(No commit needed for worktree creation)

---

### Task 2: Implement Hero Header & Stat Cards

**Files:**
- Modify: `frontend-zalo/src/pages/Home.tsx`

**Step 1: Write minimal implementation**
Replace the top part of `Home.tsx` with a new `HeroHeader` component and `StatCards` component.
- The `HeroHeader` will have a dark red/blue gradient background.
- The `StatCards` will display dummy data (Dân số: 14.390, Diện tích: 67,68 km²) using negative margin to overlap the Hero Header.

**Step 2: Run dev server to verify**
Run: `cd frontend-zalo && npm run dev`
Expected: UI shows new header.

**Step 3: Commit**
Run: `git add frontend-zalo/src/pages/Home.tsx`
Run: `git commit -m "feat(home): add hero header and stat cards"`

---

### Task 3: Implement Categorized Tile Grids

**Files:**
- Modify: `frontend-zalo/src/pages/Home.tsx`

**Step 1: Write minimal implementation**
Replace the old `menuItems` flat array with two arrays:
- `citizenTiles` (Đặt lịch hẹn, Phản ánh, Thủ tục, Kho văn bản, Đường dây nóng, Bản đồ, Dịch vụ công)
- `businessTiles` (Quy hoạch, Dự án, Đấu thầu, Kho mẫu đơn, Lịch công tác)
Render them in two separate sections with headings. Use pastel backgrounds for icons.

**Step 2: Run dev server to verify**
Expected: Icons are grouped logically.

**Step 3: Commit**
Run: `git commit -am "feat(home): add categorized tile grids"`

---

### Task 4: Refactor News Section

**Files:**
- Modify: `frontend-zalo/src/pages/Home.tsx`

**Step 1: Write minimal implementation**
Refactor the news mapping to use a `FeaturedNews` card style. Keep the API call.

**Step 2: Run dev server to verify**
Expected: News list renders beautifully with API data.

**Step 3: Commit**
Run: `git commit -am "feat(home): refactor news section"`

---

### Task 5: Final Verification

**Step 1: Verify all links work**
Ensure all paths (`/appointments`, `/procedures`, etc.) match the `App.tsx` routes.

**Step 2: Cleanup and Finish**
Run `.agent/skills/finishing-a-development-branch/SKILL.md` to merge.
