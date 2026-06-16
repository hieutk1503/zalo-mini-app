from fastapi import FastAPI
from routers import embeddings

app = FastAPI()

app.include_router(embeddings.router, prefix="/api/embeddings")

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}
