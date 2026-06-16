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

        # 2. Tìm ngữ cảnh
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
        prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. Dựa vào thông tin thủ tục sau:
{context}
Hãy trả lời câu hỏi: {req.query}
Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ trực tiếp với bộ phận một cửa.
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
