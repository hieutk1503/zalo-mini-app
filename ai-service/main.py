from fastapi import FastAPI
from routers import embeddings, chat

app = FastAPI()

app.include_router(embeddings.router, prefix="/api/embeddings")
app.include_router(chat.router, prefix="/api/chat")

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}
