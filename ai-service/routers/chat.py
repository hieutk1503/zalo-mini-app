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

        # 2. Embed query
        embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=search_query)
        query_embedding = embed_resp["embedding"]

        # 3. Search context
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

        # 4. Create prompt for Qwen
        system_prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. Dựa vào các thông tin sau đây (bao gồm thủ tục, tin tức, văn bản):
{context}

Hãy trả lời câu hỏi hiện tại của người dùng. Trả lời ngắn gọn, súc tích và dễ hiểu. Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa.
"""
        messages = [{"role": "system", "content": system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        messages.append({"role": "user", "content": req.query})

        # 5. Send to Qwen
        response = ollama.chat(model='qwen2.5', messages=messages)

        return {
            "answer": response['message']['content'], 
            "context_used": context,
            "suggested_action": suggested_action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
