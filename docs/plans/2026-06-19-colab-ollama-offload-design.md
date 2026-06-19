# Thiết kế Đưa Ollama lên Google Colab (Offload Inference)

## 1. Context & Goals
**Vấn đề:** 
Hệ thống AI Chatbot hiện tại (Qwen2.5-7B) chạy trên Laptop có Card RTX 3050 (6GB VRAM) bị thiếu bộ nhớ (Out-Of-Memory) khi xử lý Context dài từ RAG, dẫn đến tốc độ trả lời rất chậm (1-2 tokens/s).

**Mục tiêu:**
Chuyển riêng phần xử lý nặng nhất là **Mô hình ngôn ngữ (Ollama)** lên **Google Colab** (sử dụng GPU T4 16GB VRAM miễn phí), trong khi toàn bộ mã nguồn `ai-service`, CSDL (Postgres, Redis) và dữ liệu mật vẫn giữ an toàn dưới máy tính nội bộ.

---

## 2. Thiết kế Cấu trúc

### 2.1 Môi trường Cloud (Google Colab)
Chúng ta sẽ tạo một Notebook `.ipynb` trên Colab để:
1. Tải và cài đặt phần mềm Ollama (phiên bản Linux).
2. Kéo mô hình (Pull model): `qwen2.5:7b` và `nomic-embed-text`.
3. Cài đặt và khởi chạy **Ngrok** để tạo luồng kết nối Internet (Tunneling) bộc lộ cổng `11434` của Ollama ra bên ngoài.
*Ví dụ URL trả về:* `https://abc-xyz.ngrok-free.app`

### 2.2 Môi trường Local (`ai-service` trên Laptop)
Sửa đổi mã nguồn Python của `ai-service` để không dùng Ollama cục bộ nữa mà trỏ lên đường link Ngrok của Colab.

**Chi tiết sửa đổi:**
Trong file `routers/chat.py` và các file liên quan có gọi hàm `ollama.chat` hay `ollama.embeddings`:
* Thay vì gọi trực tiếp: `ollama.chat(...)`
* Chúng ta sẽ khởi tạo client mới: 
  ```python
  from ollama import Client
  import os

  OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
  client = Client(host=OLLAMA_HOST)
  
  response = client.chat(...)
  ```

---

## 3. Data Flow (Luồng dữ liệu)
1. **User** gõ tin nhắn vào Mini App Zalo.
2. Tin nhắn đi tới `backend-nestjs`, gọi sang `ai-service` (đều chạy ở Laptop).
3. `ai-service` lấy lịch sử chat, lấy ngữ cảnh từ **PostgreSQL** trên Laptop, sau đó kết hợp thành một Prompt lớn.
4. `ai-service` gửi Prompt (qua kết nối mạng Ngrok) lên **Google Colab**.
5. Card đồ họa T4 trên Colab suy luận và sinh Text siêu tốc (khoảng 30 tokens/s), sau đó trả kết quả dạng luồng (Streaming) về cho `ai-service`.
6. `ai-service` chuyển tiếp luồng chữ này cho Zalo Mini App.

---

## 4. Rủi ro & Cách khắc phục (Trade-offs)
- **Thời gian chạy của Colab:** Google Colab phiên bản miễn phí sẽ tự động tắt sau khoảng 12 giờ chạy liên tục hoặc sau 90 phút nếu tắt trình duyệt.
  * *Khắc phục:* Phương án này đặc biệt lý tưởng cho giai đoạn Development (viết code, test thử, làm đồ án/demo nghiệm thu). Khi chạy Production thật, chúng ta sẽ cần thuê VPS GPU.
- **Tính bảo mật của Ngrok:** Link Ngrok sẽ thay đổi mỗi khi bạn Restart Colab. Do đó, bạn sẽ cần copy link mới và dán vào file `.env` của `ai-service` mỗi sáng.
