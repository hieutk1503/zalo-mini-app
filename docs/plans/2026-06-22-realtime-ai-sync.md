# Realtime AI Sync Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement real-time synchronization between PostgreSQL (NestJS) and the AI Vector Database (FastAPI/Redis) whenever an admin creates, updates, or deletes a News article.

**Architecture:**
- **AI Service:** Modify `POST /sync` to act as an UPSERT (delete old vector before insert). Add `DELETE /sync/{source_type}/{source_id}` to handle item deletions.
- **NestJS:** Update `AiSyncService` to expose public methods `syncItem` and `deleteItem`. Inject `AiSyncService` into `NewsService` and trigger these methods asynchronously after database mutations.

**Tech Stack:** FastAPI, Python, NestJS, Prisma.

---

### Task 1: Create worktree and setup

**Step 1: Create git worktree**
Run: `git fetch && git worktree add .worktrees/realtime-ai-sync -b feature/realtime-ai-sync`

---

### Task 2: Update AI Service API

**Files:**
- Modify: `ai-service/routers/embeddings.py`

**Step 1: Write minimal implementation**
- Modify `sync_vector`: Before `INSERT INTO`, run `DELETE FROM "KnowledgeVector" WHERE source_type=%s AND source_id=%s`.
- Add a new endpoint `delete_vector(source_type: str, source_id: int)` which runs the `DELETE` query.

**Step 2: Run server to verify**
(It auto-reloads via uvicorn). 
Expected: No syntax errors in Python terminal.

**Step 3: Commit**
Run: `git add ai-service/routers/embeddings.py`
Run: `git commit -m "feat(ai): support upsert and delete for individual vectors"`

---

### Task 3: Update AiSyncService in NestJS

**Files:**
- Modify: `backend-nestjs/src/ai-sync/ai-sync.service.ts`

**Step 1: Write minimal implementation**
- Rename/Make public `syncItem(sourceType: string, sourceId: number, contentChunk: string)` (formerly `sendToAi`).
- Add `deleteItem(sourceType: string, sourceId: number)` which calls `axios.delete` to the new AI service endpoint.

**Step 2: Commit**
Run: `git add backend-nestjs/src/ai-sync/ai-sync.service.ts`
Run: `git commit -m "feat(backend): expose real-time sync methods in AiSyncService"`

---

### Task 4: Hook NewsService to AiSyncService

**Files:**
- Modify: `backend-nestjs/src/news/news.module.ts` (to import `AiSyncModule`)
- Modify: `backend-nestjs/src/news/news.service.ts`

**Step 1: Write minimal implementation**
- In `NewsModule`, import `AiSyncModule` (and make sure `AiSyncModule` exports `AiSyncService`).
- In `NewsService`, inject `AiSyncService`.
- In `create` and `update`: after Prisma succeeds, call `this.aiSyncService.syncItem('NEWS', result.id, \`[Tin tức: \${result.title}] Nội dung: \${result.content}\`)`. Note: Don't await it, or do await it safely since `syncItem` catches errors.
- In `remove`: call `this.aiSyncService.deleteItem('NEWS', id)`.

**Step 2: Commit**
Run: `git add backend-nestjs/src/news/news.module.ts backend-nestjs/src/news/news.service.ts backend-nestjs/src/ai-sync/ai-sync.module.ts`
Run: `git commit -m "feat(news): automatically sync news to AI vector db on mutation"`

---

### Task 5: Final Verification

**Step 1: Verify NestJS compiles**
Run: `cd backend-nestjs && npm run build`

**Step 2: Merge branch**
Run `.agent/skills/finishing-a-development-branch/SKILL.md` to merge.
