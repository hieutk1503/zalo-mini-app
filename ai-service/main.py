from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, embeddings
from cache_manager import init_redis_index

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(embeddings.router, prefix="/api/embeddings")
app.include_router(chat.router, prefix="/api/chat")

@app.on_event("startup")
def startup_event():
    print("Initializing AI Service...")
    init_redis_index()

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}
