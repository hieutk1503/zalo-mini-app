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
        # 1. Embed query
        embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=req.query)
        query_embedding = embed_resp["embedding"]

        # 2. Search context
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT content_chunk 
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

        # 3. Create prompt for Qwen
        prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. Dựa vào các thông tin sau đây (bao gồm thủ tục, tin tức, văn bản):
{context}
Hãy trả lời câu hỏi: {req.query}
Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa. Trả lời ngắn gọn, súc tích và dễ hiểu.
"""

        # 4. Send to Qwen
        response = ollama.chat(model='qwen2.5', messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ])

        return {"answer": response['message']['content'], "context_used": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
