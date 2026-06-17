from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat_query_with_history():
    response = client.post("/api/chat/query", json={
        "query": "Lệ phí là bao nhiêu?",
        "history": [
            {"role": "user", "content": "Thủ tục cấp bản sao trích lục hộ tịch"},
            {"role": "assistant", "content": "Thủ tục này yêu cầu công dân mang theo CCCD."}
        ]
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
