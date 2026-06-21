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
            
            # CACHE MISS - HYBRID STREAMING WITH TOOL CALLS
            tools = [{
                'type': 'function',
                'function': {
                    'name': 'search_database',
                    'description': 'Gọi hàm này khi người dùng hỏi về thủ tục hành chính, pháp luật, hồ sơ, giấy tờ, hoặc quy định.',
                    'parameters': {
                        'type': 'object',
                        'properties': {
                            'query': {
                                'type': 'string',
                                'description': 'Câu truy vấn để tìm kiếm trong cơ sở dữ liệu',
                            },
                        },
                        'required': ['query'],
                    },
                },
            }]

            system_prompt = (
                "Bạn là trợ lý ảo AI hỗ trợ Dịch vụ công Tự Lạn Smart. "
                "CHỈ THỰC HIỆN TRẢ LỜI BẰNG TIẾNG VIỆT (VIETNAMESE). "
                "TUYỆT ĐỐI KHÔNG SỬ DỤNG TIẾNG TRUNG QUỐC (CHINESE), TIẾNG ANH (ENGLISH) HOẶC BẤT KỲ NGÔN NGỮ NÀO KHÁC.\n"
                "Trả lời ngắn gọn, lịch sự và chính xác. Nếu người dùng hỏi về thủ tục hành chính, hãy dùng công cụ search_database."
            )

            messages = [{"role": "system", "content": system_prompt}]
            for msg in req.history:
                messages.append({"role": msg.role, "content": msg.content})
            
            user_query_enforced = f"{req.query}\n\n[LƯU Ý QUAN TRỌNG: BẮT BUỘC trả lời bằng Tiếng Việt (Vietnamese).]"
            messages.append({"role": "user", "content": user_query_enforced})

            import asyncio

            # LẦN 1: GỌI ẨN (stream=False)
            response = ollama_client.chat(
                model='qwen2.5:3b', 
                messages=messages, 
                tools=tools,
                options={"temperature": 0.1}, 
                stream=False
            )
            
            tool_calls = response.get('message', {}).get('tool_calls', [])
            suggested_action = None
            full_answer = ""
            
            if tool_calls:
                print(f"[Tool Call Triggered] {tool_calls}")
                # NHÁNH 1: CÓ GỌI DATABASE (RAG)
                for tool in tool_calls:
                    if tool['function']['name'] == 'search_database':
                        search_query = tool['function']['arguments'].get('query', req.query)
                        context, suggested_action = search_database(search_query)
                        
                        messages.append(response['message'])
                        messages.append({
                            'role': 'tool',
                            'content': f"THÔNG TIN THAM KHẢO:\n{context}"
                        })
                        break
                        
                # LẦN 2: GỌI STREAM (stream=True)
                final_response_stream = ollama_client.chat(
                    model='qwen2.5:3b', 
                    messages=messages, 
                    options={"temperature": 0.1}, 
                    stream=True
                )
                
                for chunk in final_response_stream:
                    if await request.is_disconnected():
                        break
                    text_chunk = chunk['message']['content']
                    if not full_answer and text_chunk.startswith("søker"):
                        text_chunk = text_chunk.replace("søker", "").lstrip()
                    full_answer += text_chunk
                    yield {
                        "event": "message",
                        "data": json.dumps({"chunk": text_chunk, "action": suggested_action}, ensure_ascii=False)
                    }
            else:
                print("[Fake Streaming]")
                # NHÁNH 2: FAKE STREAM (Giao tiếp thường)
                full_answer = response.get('message', {}).get('content', '')
                if not full_answer and response.get('message', {}).get('content', '').startswith("søker"):
                    full_answer = full_answer.replace("søker", "").lstrip()
                if full_answer:
                    import re
                    words = re.findall(r'\S+|\s+', full_answer)
                    for word in words:
                        if await request.is_disconnected():
                            break
                        yield {
                            "event": "message",
                            "data": json.dumps({"chunk": word, "action": None}, ensure_ascii=False)
                        }
                        await asyncio.sleep(0.02)

            # Save to Cache after streaming completes
            if full_answer.strip():
                query_id = str(uuid.uuid4())
                set_cached_answer(query_id, query_vector, full_answer.strip(), suggested_action)
                
            yield {"event": "done", "data": "[DONE]"}

        return EventSourceResponse(event_generator())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
