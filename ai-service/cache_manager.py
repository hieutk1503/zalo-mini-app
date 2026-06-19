import os
import json
import numpy as np
import redis
from redis.commands.search.field import VectorField, TextField
from redis.commands.search.query import Query
from redis.commands.search.indexDefinition import IndexDefinition, IndexType

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Connect to Redis
try:
    client = redis.Redis.from_url(REDIS_URL, decode_responses=False)
except Exception as e:
    print(f"Failed to connect to Redis: {e}")
    client = None

INDEX_NAME = "idx:semantic_cache"

def init_redis_index():
    if not client:
        return
    try:
        client.ft(INDEX_NAME).info()
    except Exception:
        # Create index if it doesn't exist
        print("Creating Redis Vector Index for Semantic Cache...")
        schema = (
            TextField("answer"),
            TextField("suggested_action"),
            VectorField("embedding", "FLAT", {"TYPE": "FLOAT32", "DIM": 768, "DISTANCE_METRIC": "COSINE"})
        )
        client.ft(INDEX_NAME).create_index(
            schema, 
            definition=IndexDefinition(prefix=["cache:"], index_type=IndexType.HASH)
        )

def get_cached_answer(vector: list[float], threshold=0.05):
    """
    Search Redis for a similar query embedding.
    Returns dict with answer and suggested_action if found within threshold.
    """
    if not client:
        return None
    
    try:
        query = (
            Query("*=>[KNN 1 @embedding $vec AS score]")
            .sort_by("score")
            .return_fields("answer", "suggested_action", "score")
            .dialect(2)
        )
        vec_bytes = np.array(vector, dtype=np.float32).tobytes()
        res = client.ft(INDEX_NAME).search(query, query_params={"vec": vec_bytes})
        
        if res.docs and float(res.docs[0].score) < threshold:
            answer_text = res.docs[0].answer.decode('utf-8') if isinstance(res.docs[0].answer, bytes) else res.docs[0].answer
            action_text = res.docs[0].suggested_action.decode('utf-8') if isinstance(res.docs[0].suggested_action, bytes) else res.docs[0].suggested_action
            
            print(f"🚀 Semantic Cache HIT! (Score: {res.docs[0].score})")
            return {
                "answer": answer_text,
                "suggested_action": json.loads(action_text) if action_text else None
            }
    except Exception as e:
        print(f"Redis search error: {e}")
    
    return None

def set_cached_answer(query_id: str, vector: list[float], answer: str, suggested_action: dict = None):
    """
    Save the newly generated answer into Redis Semantic Cache.
    """
    if not client:
        return
        
    try:
        vec_bytes = np.array(vector, dtype=np.float32).tobytes()
        
        # Redis hashes require all fields to be properly stringified/bytes
        mapping = {
            "answer": answer,
            "suggested_action": json.dumps(suggested_action) if suggested_action else "",
            "embedding": vec_bytes
        }
        
        client.hset(f"cache:{query_id}", mapping=mapping)
        client.expire(f"cache:{query_id}", 86400) # Cache expires in 24 hours
        print(f"💾 Saved to Semantic Cache: {query_id}")
    except Exception as e:
        print(f"Redis save error: {e}")
