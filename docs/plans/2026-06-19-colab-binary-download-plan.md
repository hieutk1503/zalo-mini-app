# Colab Binary Download Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Chuyển đổi mã nguồn `colab_ollama_ngrok.ipynb` để tải trực tiếp lõi thực thi của Ollama (binary) thay vì dùng script tự động, khắc phục triệt để lỗi "ollama: command not found" do giới hạn đường dẫn trên Colab.

**Architecture:** Sử dụng `curl -L https://ollama.com/download/ollama-linux-amd64 -o ollama` để tải file `.exe/binary` nguyên bản về chính thư mục hiện tại của Colab (`./ollama`). Khởi chạy Cloudflare Tunnel và Ollama song song dưới nền.

**Tech Stack:** Python, Bash, Google Colab.

---

### Task 1: Rewrite colab_ollama_ngrok.ipynb

**Files:**
- Modify: `ai-service/scripts/colab_ollama_ngrok.ipynb`

**Step 1: Sửa đổi nội dung file Jupyter Notebook**

Tạo lại toàn bộ nội dung JSON của file `.ipynb`, trong đó thay thế phần cài đặt Ollama bằng việc tải trực tiếp binary:

```python
import os
import time
import subprocess
import threading
import re

print("1. Đang tải LÕI phần mềm Ollama (Bản Portable)...")
os.system("curl -L https://ollama.com/download/ollama-linux-amd64 -o ollama")
os.system("chmod +x ollama")

print("2. Đang khởi chạy máy chủ Ollama dưới nền...")
os.system("OLLAMA_HOST=0.0.0.0 ./ollama serve > ollama.log 2>&1 &")
time.sleep(3)

print("3. Đang tải đường hầm Cloudflare...")
os.system("wget -q -c -nc https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64")
os.system("chmod +x cloudflared-linux-amd64")

def run_cloudflared():
    os.system("./cloudflared-linux-amd64 tunnel --url http://localhost:11434 > cloudflare.log 2>&1")

threading.Thread(target=run_cloudflared, daemon=True).start()

print("4. Đang tạo link Public (Chờ 8 giây)...")
time.sleep(8)

url = None
try:
    with open('cloudflare.log', 'r') as f:
        content = f.read()
        match = re.search(r'(https://[a-zA-Z0-9-]+\.trycloudflare\.com)', content)
        if match:
            url = match.group(1)
except Exception as e:
    pass

print("\n==================================================")
if url:
    print(f"🔥 LINK KẾT NỐI (Hãy copy): {url}")
    print("\n👉 Dán vào file .env ở máy tính của bạn: OLLAMA_HOST=" + url)
else:
    print("Đang tạo link, hãy đợi vài giây rồi mở file 'cloudflare.log' để copy link nhé.")
print("==================================================\n")

print("5. Bắt đầu tải mô hình AI...")
print("-> Đang kéo nomic-embed-text...")
os.system("./ollama pull nomic-embed-text")
print("-> Đang kéo qwen2.5:7b...")
os.system("./ollama pull qwen2.5:7b")
print("\n✅ HOÀN TẤT TẤT CẢ! Google Colab đã sẵn sàng nhận tin nhắn.")
```

**Step 2: Commit file thay đổi**

```bash
git add ai-service/scripts/colab_ollama_ngrok.ipynb
git commit -m "fix(ai): use direct portable binary for ollama on colab"
```
