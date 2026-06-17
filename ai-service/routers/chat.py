import os
import json
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import ollama
from database import get_db_connection

router = APIRouter()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []

@router.post("/query")
def chat_with_rag(req: ChatRequest):
    try:
        # 1. Router & Rewriter via Gemini
        search_query = req.query
        intent = "search" # Default fallback
        
        try:
            if os.getenv("GEMINI_API_KEY"):
                # Use application/json for structured output
                generation_config = {"response_mime_type": "application/json"}
                model = genai.GenerativeModel("gemini-1.5-flash", generation_config=generation_config)
                
                history_text = "\n".join([f"{m.role}: {m.content}" for m in req.history[-3:]]) if req.history else "Không có"
                
                prompt = f"""Bạn là một bộ định tuyến (Router) cho chatbot Hành chính công.
Lịch sử chat gần nhất:
{history_text}

Câu hỏi hiện tại của người dùng: "{req.query}"

Nhiệm vụ:
1. Xác định 'intent': Nếu câu hỏi cần tra cứu thủ tục/quy định pháp luật, trả về "search". Nếu chỉ là câu giao tiếp/chào hỏi bình thường, trả về "chat".
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

        context = ""
        suggested_action = None

        # 2. Embed query & Search Context (Only if intent is search)
        if intent == "search":
            embed_resp = ollama.embeddings(model="nomic-embed-text", prompt=search_query)
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

            if rows and rows[0]["source_type"] == "PROCEDURE":
                suggested_action = {"type": "PROCEDURE", "id": rows[0]["source_id"]}

        # 4. Create prompt for Qwen
        if intent == "search":
            system_prompt = f"""Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. Dựa vào các thông tin sau đây (bao gồm thủ tục, tin tức, văn bản):
{context}

Hãy trả lời câu hỏi hiện tại của người dùng. Trả lời ngắn gọn, súc tích và dễ hiểu. Nếu không có thông tin trong ngữ cảnh, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa."""
        else:
            system_prompt = "Bạn là trợ lý ảo hỗ trợ Dịch vụ công Tự Lạn Smart. Hãy giao tiếp thân thiện với người dùng."

        messages = [{"role": "system", "content": system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Use the standard query (or original query) for generating answer
        messages.append({"role": "user", "content": search_query})

        # 5. Send to Qwen
        response = ollama.chat(model='qwen2.5', messages=messages)

        return {
            "answer": response['message']['content'], 
            "context_used": context,
            "suggested_action": suggested_action,
            "debug_router": {
                "intent": intent,
                "standard_query": search_query
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
