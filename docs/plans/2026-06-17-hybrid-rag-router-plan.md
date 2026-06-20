# Hybrid RAG Router Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement a Query Router and Rewriter using Gemini 1.5 Flash to improve RAG accuracy before querying the local PostgreSQL vector database and answering with local Qwen2.5.

**Architecture:** Add a pre-processing step in `chat.py`. The user query and history are sent to Gemini 1.5 Flash with a JSON schema. Gemini classifies the intent (`search` or `chat`) and standardizes the query. If `search`, the system embeds the standardized query via Ollama, retrieves context from PGVector, and generates the final answer with Qwen2.5. If the Gemini API fails, it falls back to the existing manual history concatenation.

**Tech Stack:** Python, FastAPI, Ollama, google-generativeai, PostgreSQL (pgvector).

---

### Task 1: Add dependencies and configuration

**Files:**
- Modify: `ai-service/requirements.txt`
- Modify: `ai-service/.env` (Assume this exists or needs to be created)

**Step 1: Write the failing test**
N/A for dependency installation, but we will test the import in the next steps.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
Add `google-generativeai` to `requirements.txt`.
Add `GEMINI_API_KEY=your_api_key_here` to `.env`.

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pip install -r requirements.txt`

**Step 5: Commit**
```bash
git add ai-service/requirements.txt
git commit -m "chore(ai): add google-generativeai dependency"
```

### Task 2: Implement Gemini Router Logic

**Files:**
- Modify: `ai-service/routers/chat.py`

**Step 1: Write the failing test**
Create a small test script or just test the endpoint directly. We'll rely on integration testing via Swagger or cURL.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
Update `chat.py` to include the Gemini routing logic:
```python
import os
import json
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
# ... existing imports ...

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

# ... inside chat_with_rag ...
        # 1. Router & Rewriter via Gemini
        search_query = req.query
        intent = "search" # Default fallback
        
        try:
            if os.getenv("GEMINI_API_KEY"):
                generation_config = {"response_mime_type": "application/json"}
                model = genai.GenerativeModel("gemini-1.5-flash", generation_config=generation_config)
                
                history_text = "\n".join([f"{m.role}: {m.content}" for m in req.history[-3:]]) if req.history else "Không có"
                
                prompt = f"""Bạn là một bộ định tuyến (Router) cho chatbot Hành chính công.
Lịch sử chat gần nhất:
{history_text}

Câu hỏi hiện tại của người dùng: "{req.query}"

Nhiệm vụ:
1. Xác định 'intent': Nếu câu hỏi cần tra cứu thủ tục/quy định, trả về "search". Nếu chỉ là câu giao tiếp/chào hỏi bình thường, trả về "chat".
2. Viết lại câu hỏi 'standard_query': Nếu intent là "search", hãy dựa vào lịch sử chat để viết lại câu hỏi hiện tại thành một câu truy vấn chuẩn mực, đầy đủ ngữ cảnh bằng văn phong hành chính. Nếu intent là "chat", giữ nguyên câu hỏi.

Chỉ trả về JSON định dạng sau:
{{"intent": "search", "standard_query": "..."}}
"""
                response = model.generate_content(prompt)
                router_result = json.loads(response.text)
                intent = router_result.get("intent", "search")
                search_query = router_result.get("standard_query", req.query)
        except Exception as e:
            print(f"Gemini Router Error: {e}, falling back to manual concatenation")
            if req.history:
                last_user_msg = next((m.content for m in reversed(req.history) if m.role == 'user'), "")
                if last_user_msg:
                    search_query = f"{last_user_msg} {req.query}"

        # 2. Embed query (Only if intent is search)
        context = ""
        suggested_action = None
        if intent == "search":
            embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=search_query)
            query_embedding = embed_resp["embedding"]
            # ... existing pgvector search ...
            # ... context string building ...
```
Also update the `system_prompt` for Qwen to use the `search_query` or original query appropriately.

**Step 4: Run test to verify it passes**
Run the server and send a test POST request to `/query`.

**Step 5: Commit**
```bash
git add ai-service/routers/chat.py
git commit -m "feat(ai): integrate Gemini 1.5 flash for query routing and rewriting"
```
