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
