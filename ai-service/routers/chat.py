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

        system_prompt = "Bạn là trợ lý ảo AI hỗ trợ Dịch vụ công Tự Lạn Smart. LUÔN LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT. Nếu người dùng hỏi về thủ tục hoặc quy định, hãy TỰ ĐỘNG gọi công cụ search_knowledge_base để tìm tài liệu rồi mới trả lời. Nếu không có thông tin, hãy yêu cầu người dùng liên hệ trực tiếp bộ phận một cửa. Trả lời ngắn gọn, lịch sự."

        messages = [{"role": "system", "content": system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": req.query})

        # 1. First interaction with Qwen
        response = ollama.chat(
            model='qwen2.5',
            messages=messages,
            tools=tools,
            options={"temperature": 0.1} # Lower temperature to prevent hallucinating other languages
        )
        
        message = response.get('message', {})
        context = ""
        suggested_action = None
        intent = "chat"
        standard_query = ""

        # Fallback parsing in case Qwen outputs raw JSON tool call inside the text content
        content_text = message.get('content', '')
        if not message.get('tool_calls') and content_text and '"search_knowledge_base"' in content_text:
            import json, re
            match = re.search(r'\{.*"name":\s*"search_knowledge_base".*\}', content_text, re.DOTALL)
            if match:
                try:
                    parsed = json.loads(match.group(0))
                    if 'arguments' in parsed and 'search_query' in parsed['arguments']:
                        message['tool_calls'] = [{
                            'function': {
                                'name': 'search_knowledge_base',
                                'arguments': parsed['arguments']
                            }
                        }]
                except Exception:
                    pass

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
            final_response = ollama.chat(model='qwen2.5', messages=messages, options={"temperature": 0.3})
            answer = final_response['message']['content']
        else:
            # Model didn't use any tools, it just chatted normally
            answer = message.get('content', '')

        # Clean up any weird prefixes like "søker" or Russian text if the model hallucinated
        if answer.startswith("søker"):
            answer = answer.replace("søker", "").strip()

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
