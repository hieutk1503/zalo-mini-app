# Tu Lạn Smart Phase 3 Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Xây dựng tính năng AI (RAG) sử dụng mô hình Qwen chạy local qua Ollama, lưu trữ vector vào PostgreSQL (pgvector) bằng Python FastAPI.

**Architecture:** Mở rộng thư mục `ai-service`. Tích hợp thư viện SQLAlchemy để kết nối PostgreSQL. Sử dụng thư viện `ollama` Python client để nhúng văn bản (Embedding) và trả lời câu hỏi (LLM Generation).

---

### Task 1: Cấu hình kết nối PostgreSQL (pgvector) trong Python

**Files:**
- Modify: `ai-service/requirements.txt`
- Create: `ai-service/database.py`

**Step 1: Write the failing test**
Tạo file `ai-service/test_database.py`:
```python
from database import get_db_connection

def test_db_connection():
    conn = get_db_connection()
    assert conn is not None
    conn.close()
```

**Step 2: Run test to verify it fails**
Run: `cd ai-service && pytest test_database.py`
Expected: FAIL (No module named database)

**Step 3: Write minimal implementation**

Cập nhật `ai-service/requirements.txt`:
```txt
fastapi
uvicorn
pytest
httpx
psycopg2-binary
ollama
python-dotenv
```

Tạo file `ai-service/database.py`:
```python
import psycopg2
from psycopg2.extras import RealDictCursor
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://root:password@localhost:5432/tu_lan_smart")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn
```

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pip install -r requirements.txt && pytest test_database.py`
Expected: PASS

**Step 5: Commit**
```bash
git add ai-service/
git commit -m "feat(ai): setup postgres connection for ai service"
```

---

### Task 2: API Đồng bộ văn bản thành Vector (Embedding)

**Files:**
- Create: `ai-service/routers/embeddings.py`
- Modify: `ai-service/main.py`

**Step 1: Write the failing test**
N/A (Cần có Ollama đang chạy local để test full endpoint). Kiểm tra routing cơ bản.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo `ai-service/routers/embeddings.py`:
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ollama
from database import get_db_connection

router = APIRouter()

class SyncRequest(BaseModel):
    procedure_id: int
    content_chunk: str

@router.post("/sync")
def sync_vector(req: SyncRequest):
    try:
        # Gọi model nhúng (ví dụ nomic-embed-text)
        response = ollama.embeddings(model="nomic-embed-text", prompt=req.content_chunk)
        embedding = response["embedding"]
        
        # Lưu vào PostgreSQL pgvector
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO "ProcedureVector" (procedure_id, content_chunk, embedding)
            VALUES (%s, %s, %s)
            """,
            (req.procedure_id, req.content_chunk, embedding)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {"status": "success", "message": "Vector stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

Chỉnh sửa `ai-service/main.py` để nhúng router:
```python
from fastapi import FastAPI
from routers import embeddings

app = FastAPI()

app.include_router(embeddings.router, prefix="/api/embeddings")

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}
```

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pytest test_main.py` (Đảm bảo server không lỗi syntax).
Expected: PASS

**Step 5: Commit**
```bash
git add ai-service/
git commit -m "feat(ai): implement embedding sync endpoint"
```

---

### Task 3: API Chatbot xử lý RAG (Retrieval-Augmented Generation)

**Files:**
- Create: `ai-service/routers/chat.py`
- Modify: `ai-service/main.py`

**Step 1: Write the failing test**
N/A

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo `ai-service/routers/chat.py`:
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ollama
from database import get_db_connection

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/query")
def chat_with_rag(req: ChatRequest):
    try:
        # 1. Embed câu hỏi
        embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=req.query)
        query_embedding = embed_resp["embedding"]

        # 2. Tìm ngữ cảnh (Cosine Distance <=> toán tử <=> trong pgvector)
        conn = get_db_connection()
        cur = conn.cursor()
        # Tìm top 3 thủ tục gần nhất
        cur.execute(
            """
            SELECT content_chunk 
            FROM "ProcedureVector" 
            ORDER BY embedding <=> %s::vector 
            LIMIT 3
            """,
            (str(query_embedding),)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        context = "\n".join([row["content_chunk"] for row in rows])

        # 3. Tạo prompt cho Qwen
        prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công. Dựa vào thông tin thủ tục sau:
        {context}
        Hãy trả lời câu hỏi: {req.query}
        Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ cán bộ.
        """

        # 4. Gửi cho Qwen
        response = ollama.chat(model='qwen2.5', messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ])

        return {"answer": response['message']['content'], "context_used": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

Đưa router vào `ai-service/main.py`:
```python
# Cập nhật thêm trong main.py
from routers import chat
app.include_router(chat.router, prefix="/api/chat")
```

**Step 4: Run test to verify it passes**
Run: `cd ai-service && pytest test_main.py`
Expected: PASS

**Step 5: Commit**
```bash
git add ai-service/
git commit -m "feat(ai): implement RAG chat endpoint using qwen and pgvector"
```
