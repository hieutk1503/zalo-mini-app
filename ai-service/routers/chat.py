from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict
import ollama
from ollama import Client
import json
import uuid
import os
from database import get_db_connection
from sse_starlette.sse import EventSourceResponse
from cache_manager import get_cached_answer, set_cached_answer
from core.context_harness import compress_context, check_guardrails

router = APIRouter()

OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
ollama_client = Client(host=OLLAMA_HOST)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []

def search_database(query: str):
    embed_resp = ollama_client.embeddings(model="nomic-embed-text", prompt=query)
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
    
    raw_docs = [row["content_chunk"] for row in rows]
    context = compress_context(query, raw_docs, max_sentences=5)
    
    suggested_action = None
    if rows and rows[0]["source_type"] == "PROCEDURE":
        suggested_action = {"type": "PROCEDURE", "id": rows[0]["source_id"]}
        
    return context if context else "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu.", suggested_action

@router.post("/query")
async def chat_with_rag(req: ChatRequest, request: Request):
    try:
        # Check Guardrails first
        if check_guardrails(req.query):
            async def guardrail_generator():
                yield {
                    "event": "message",
                    "data": json.dumps({
                        "chunk": "Xin lỗi, tôi không thể trả lời câu hỏi có nội dung nhạy cảm hoặc không phù hợp.",
                        "action": None
                    }, ensure_ascii=False)
                }
                yield {"event": "done", "data": "[DONE]"}
            return EventSourceResponse(guardrail_generator())

        # 0. Embed user's exact query to check Semantic Cache
        embed_resp = ollama_client.embeddings(model="nomic-embed-text", prompt=req.query)
        query_vector = embed_resp["embedding"]
        
        cached = get_cached_answer(query_vector)
        
        async def event_generator():
            # If CACHE HIT
            if cached:
                yield {
                    "event": "message",
                    "data": json.dumps({
                        "chunk": cached["answer"],
                        "action": cached["suggested_action"]
                    }, ensure_ascii=False)
                }
                yield {"event": "done", "data": "[DONE]"}
                return
            
            # CACHE MISS - Optimized Single Streaming Workflow
            # 1. Always search database first
            context, suggested_action = search_database(req.query)
            
            system_prompt = (
                "Bạn là trợ lý ảo AI hỗ trợ Dịch vụ công Tự Lạn Smart. "
                "CHỈ THỰC HIỆN TRẢ LỜI BẰNG TIẾNG VIỆT (VIETNAMESE). "
                "TUYỆT ĐỐI KHÔNG SỬ DỤNG TIẾNG TRUNG QUỐC (CHINESE), TIẾNG ANH (ENGLISH) HOẶC BẤT KỲ NGÔN NGỮ NÀO KHÁC.\n"
                "Trả lời ngắn gọn, lịch sự và chính xác. Nếu có thông tin tham khảo sau đây, hãy dựa vào đó để trả lời:\n"
                f"THÔNG TIN THAM KHẢO:\n{context}"
            )

            messages = [{"role": "system", "content": system_prompt}]
            for msg in req.history:
                messages.append({"role": msg.role, "content": msg.content})
            
            # Củng cố yêu cầu tiếng Việt ở ngay câu hỏi cuối cùng
            user_query_enforced = f"{req.query}\n\n[LƯU Ý QUAN TRỌNG: Bạn BẮT BUỘC phải trả lời bằng ngôn ngữ Tiếng Việt (Vietnamese). TUYỆT ĐỐI KHÔNG dùng chữ Hán (Chinese) hay bất kỳ ngôn ngữ nào khác.]"
            messages.append({"role": "user", "content": user_query_enforced})

            # 2. Stream immediately
            final_response_stream = ollama_client.chat(
                model='qwen2.5:3b', 
                messages=messages, 
                options={"temperature": 0.1}, 
                stream=True
            )
            
            full_answer = ""
            for chunk in final_response_stream:
                if await request.is_disconnected():
                    break
                
                text_chunk = chunk['message']['content']
                if not full_answer and text_chunk.startswith("søker"):
                    text_chunk = text_chunk.replace("søker", "").lstrip()
                
                full_answer += text_chunk
                
                yield {
                    "event": "message",
                    "data": json.dumps({
                        "chunk": text_chunk,
                        "action": suggested_action
                    }, ensure_ascii=False)
                }

            # Save to Cache after streaming completes
            if full_answer.strip():
                query_id = str(uuid.uuid4())
                set_cached_answer(query_id, query_vector, full_answer.strip(), suggested_action)
                
            yield {"event": "done", "data": "[DONE]"}

        return EventSourceResponse(event_generator())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
