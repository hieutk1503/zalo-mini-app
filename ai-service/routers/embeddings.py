from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import ollama
from database import get_db_connection

router = APIRouter()

class SyncRequest(BaseModel):
    source_type: str
    source_id: int
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
            INSERT INTO "KnowledgeVector" (source_type, source_id, content_chunk, embedding)
            VALUES (%s, %s, %s, %s)
            """,
            (req.source_type, req.source_id, req.content_chunk, embedding)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {"status": "success", "message": "Vector stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear")
def clear_vectors():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM "KnowledgeVector"')
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success", "message": "All vectors cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
