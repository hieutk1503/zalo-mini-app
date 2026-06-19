# Ollama Tool Calling Architecture Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Refactor the RAG pipeline to use a 100% Local Agent architecture. Remove the Gemini Router dependency and utilize native Tool Calling (Function Calling) provided by Qwen 2.5 via the Ollama SDK. 

**Architecture:** 
- User query and history are sent directly to `qwen2.5` along with a defined `search_knowledge_base(search_query)` tool.
- Qwen evaluates the context. If it determines a database search is needed, it outputs a `tool_call` with a standardized `search_query`.
- The Python system intercepts the `tool_call`, executes the PGVector search using the `nomic-embed-text` embeddings, and returns the context back to Qwen as a `tool` role message.
- Qwen generates the final natural language response based on the tool's output. If no search is needed, it answers directly.

**Tech Stack:** Python, FastAPI, Ollama (Native Tool Calling), PostgreSQL (pgvector).

---

### Task 1: Clean up obsolete Gemini dependencies

**Files:**
- Modify: `ai-service/requirements.txt`
- Modify: `ai-service/routers/chat.py`

**Step 1: Write the failing test**
N/A - This is a cleanup step.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
- Remove `requests` (or `google-generativeai`) from `requirements.txt`.
- Remove the Gemini imports and `os.getenv("GEMINI_API_KEY")` logic from `chat.py`.

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pip install -r requirements.txt`

**Step 5: Commit**
```bash
git add ai-service/requirements.txt ai-service/routers/chat.py
git commit -m "refactor(ai): remove gemini router and prepare for ollama tool calling"
```

### Task 2: Implement Native Ollama Tool Calling

**Files:**
- Modify: `ai-service/routers/chat.py`

**Step 1: Write the failing test**
Create a simple `test_tool_calling.py` script to verify Qwen 2.5 triggers the tool.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**
Update `chat.py` with the Agentic Tool Calling loop:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import ollama
from database import get_db_connection

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []

def search_database(query: str):
    # Embed query
    embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=query)
    query_embedding = embed_resp["embedding"]

    conn = get_db_connection()
    cur = conn.cursor()
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
    
    suggested_action = None
    if rows and rows[0]["source_type"] == "PROCEDURE":
        suggested_action = {"type": "PROCEDURE", "id": rows[0]["source_id"]}
        
    return context if context else "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu.", suggested_action

@router.post("/query")
def chat_with_rag(req: ChatRequest):
    try:
        # Define the available tools for the model
        tools = [{
            "type": "function",
            "function": {
                "name": "search_knowledge_base",
                "description": "Tìm kiếm các quy định, thủ tục hành chính, tin tức từ cơ sở dữ liệu dịch vụ công. LUÔN sử dụng công cụ này khi cần trả lời các câu hỏi về thủ tục, hồ sơ, giấy tờ pháp lý.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_query": {
                            "type": "string",
                            "description": "Câu truy vấn chuẩn hóa bằng tiếng Việt để tìm kiếm tài liệu."
                        }
                    },
                    "required": ["search_query"]
                }
            }
        }]

        system_prompt = "Bạn là trợ lý ảo AI hỗ trợ Dịch vụ công Tự Lạn Smart. Nếu người dùng hỏi về thủ tục, hãy TỰ ĐỘNG gọi công cụ search_knowledge_base để tìm tài liệu rồi mới trả lời. Nếu không có thông tin, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa. Hãy trả lời ngắn gọn, lịch sự."

        messages = [{"role": "system", "content": system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": req.query})

        # 1. First interaction with Qwen
        response = ollama.chat(
            model='qwen2.5',
            messages=messages,
            tools=tools
        )
        
        message = response.get('message', {})
        context = ""
        suggested_action = None
        intent = "chat"
        standard_query = ""

        # 2. Check if Qwen decided to use a tool
        if message.get('tool_calls'):
            for tool_call in message['tool_calls']:
                if tool_call['function']['name'] == 'search_knowledge_base':
                    intent = "search"
                    standard_query = tool_call['function']['arguments']['search_query']
                    
                    # Execute tool
                    context, suggested_action = search_database(standard_query)
                    
                    # Add model's tool call request and the tool's output to history
                    messages.append(message)
                    messages.append({
                        "role": "tool",
                        "content": context,
                        "name": "search_knowledge_base"
                    })
            
            # 3. Final interaction to generate the natural language answer
            final_response = ollama.chat(model='qwen2.5', messages=messages)
            answer = final_response['message']['content']
        else:
            # Model didn't use any tools, it just chatted normally
            answer = message.get('content', '')

        return {
            "answer": answer, 
            "context_used": context,
            "suggested_action": suggested_action,
            "debug_router": {
                "intent": intent,
                "standard_query": standard_query
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 4: Run test to verify it passes**
Run the server and send a test POST request to `/query`.

**Step 5: Commit**
```bash
git add ai-service/routers/chat.py
git commit -m "feat(ai): implement agentic rag using native ollama tool calling"
```
