# AI Chatbot Memory & Actionable UI Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Nâng cấp AI Chatbot để ghi nhớ ngữ cảnh trò chuyện (Conversation Memory) và có khả năng trả về Nút hành động trực tiếp (Actionable UI) để người dân click nộp hồ sơ.

**Architecture:** 
- Giao diện (React) sẽ gửi mảng `history` các tin nhắn cũ kèm `query` mới. Nhận về thêm `suggested_action` để vẽ nút "Nộp hồ sơ".
- Backend (NestJS) tiếp nhận và forward `history` qua AI Service.
- AI Service (FastAPI) nhận `history`. Tối ưu Vector Search bằng cách ghép lịch sử gần nhất với câu hỏi mới. Bổ sung `history` vào mảng messages cho Qwen2.5. Trả về `suggested_action` nếu đoạn văn bản top 1 là một thủ tục hành chính.

**Tech Stack:** React, NestJS, FastAPI, Python, TypeScript

---

### Task 1: Cập nhật AI Service (FastAPI)

**Files:**
- Modify: `ai-service/routers/chat.py`

**Step 1: Viết test (hoặc kịch bản kiểm thử API)**

```python
# ai-service/test_chat_memory.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat_query_with_history():
    response = client.post("/api/chat/query", json={
        "query": "Lệ phí là bao nhiêu?",
        "history": [
            {"role": "user", "content": "Thủ tục cấp bản sao trích lục hộ tịch"},
            {"role": "assistant", "content": "Thủ tục này yêu cầu công dân mang theo CCCD."}
        ]
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    # Kì vọng AI có khả năng trả về suggested_action nếu nó match với procedure
```

**Step 2: Chạy kiểm thử để xác nhận lỗi (Failing)**

Run: `pytest ai-service/test_chat_memory.py`
Expected: FAIL vì `ChatRequest` hiện tại chưa có field `history`.

**Step 3: Cập nhật logic `chat.py`**

```python
from typing import List, Optional, Dict
from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []

@router.post("/query")
def chat_with_rag(req: ChatRequest):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # 1. Tối ưu search: Ghép user query cuối trong history với query hiện tại
        search_query = req.query
        if req.history:
            last_user_msg = next((m.content for m in reversed(req.history) if m.role == 'user'), "")
            if last_user_msg:
                search_query = f"{last_user_msg} {req.query}"

        embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=search_query)
        query_embedding = embed_resp["embedding"]

        # 2. Lấy top 3 context, lưu ý lấy cả source_type và source_id
        cur.execute(
            """
            SELECT source_type, source_id, content_chunk 
            FROM "KnowledgeVector" 
            ORDER BY embedding <=> %s::vector 
            LIMIT 3
            """,
            (str(query_embedding),)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        context = "\n".join([row["content_chunk"] for row in rows])
        
        # Xác định suggested_action từ Top 1 context
        suggested_action = None
        if rows and rows[0]["source_type"] == "PROCEDURE":
            suggested_action = {"type": "PROCEDURE", "id": rows[0]["source_id"]}

        # 3. Prompt & Messages cho Qwen
        system_prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. 
Dựa vào các thông tin sau:
{context}

Hãy trả lời câu hỏi hiện tại của người dùng. Trả lời ngắn gọn, súc tích và dễ hiểu. Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa."""

        messages = [{"role": "system", "content": system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": req.query})

        # 4. Gửi đến Ollama
        response = ollama.chat(model='qwen2.5', messages=messages)

        return {
            "answer": response['message']['content'], 
            "context_used": context,
            "suggested_action": suggested_action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 4: Chạy lại kiểm thử**

Run: `pytest ai-service/test_chat_memory.py`
Expected: PASS

**Step 5: Commit**

```bash
git add ai-service/routers/chat.py ai-service/test_chat_memory.py
git commit -m "feat(ai): support conversation history and actionable ui suggestions"
```

---

### Task 2: Cập nhật Controller/Service Backend (NestJS)

**Files:**
- Modify: `backend-nestjs/src/chat/chat.controller.ts`
- Modify: `backend-nestjs/src/chat/chat.service.ts`

**Step 1: Viết test (hoặc kịch bản kiểm thử API)**
*(Tương tự, NestJS sẽ cần truyền field `history` qua HTTP)*

**Step 2: Cập nhật `chat.service.ts`**
Thêm `history` vào tham số hàm và gửi qua axios:
```typescript
async queryKnowledge(query: string, history?: any[]) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.AI_SERVICE_URL}/api/chat/query`, { 
          query,
          history: history || []
        }),
      );
      return response.data;
    } catch (error) {
      //...
    }
}
```

**Step 3: Cập nhật `chat.controller.ts`**
Nhận `history` từ Body:
```typescript
@Post('query')
async chat(@Body('query') query: string, @Body('history') history?: any[]) {
  if (!query) throw new BadRequestException('Query is required');
  return this.chatService.queryKnowledge(query, history);
}
```

**Step 4: Chạy Build & Test**
Run: `cd backend-nestjs && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add backend-nestjs/src/chat/
git commit -m "feat(backend): forward chat history to ai service"
```

---

### Task 3: Cập nhật Frontend hiển thị Nút Hành Động & Truyền Lịch Sử

**Files:**
- Modify: `frontend-zalo/src/pages/Chatbot.tsx`

**Step 1: Truyền lịch sử Chat**
Bên trong `handleSend`, lọc ra tối đa 4 tin nhắn gần nhất để gửi làm `history`:
```typescript
const chatHistory = messages
  .filter(m => m.id !== 1) // Bỏ qua câu chào mặc định
  .slice(-4) // Lấy 4 câu gần nhất
  .map(m => ({
    role: m.isBot ? 'assistant' : 'user',
    content: m.text
  }));

const response = await axios.post(`${apiUrl}/chat/query`, { 
  query: input,
  history: chatHistory
});
```

**Step 2: Cập nhật state `messages` để lưu trữ thêm `action`**
```typescript
// Định nghĩa lại state
type Message = { id: number; text: string; isBot: boolean; action?: { type: string, id: number } };

// Khi nhận response
const botMessage: Message = { 
  id: Date.now() + 1, 
  text: response.data.answer, 
  isBot: true,
  action: response.data.suggested_action
};
```

**Step 3: Hiển thị Nút Hành Động**
```typescript
import { useNavigate } from 'react-router-dom';
// Bên trong component Chatbot:
const navigate = useNavigate();

// Bên dưới đoạn render msg.text của isBot:
{msg.action && msg.action.type === 'PROCEDURE' && (
  <div className="mt-3 border-t border-gray-100 pt-3">
    <button 
      onClick={() => navigate(`/procedures/${msg.action.id}`)}
      className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      👉 Xem chi tiết & Nộp hồ sơ thủ tục này
    </button>
  </div>
)}
```

**Step 4: Chạy Linter & Build Frontend**
Run: `cd frontend-zalo && npm run lint && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add frontend-zalo/src/pages/Chatbot.tsx
git commit -m "feat(frontend): send chat history and display actionable buttons"
```
