# Thiết kế Nâng cấp Kiến trúc AI: Context Harness & Distillation

## 1. Mục tiêu (Goals)
Nâng cấp kiến trúc RAG hiện tại của hệ thống Tự Lạn Smart theo chuẩn **Context Harness**, giải quyết bài toán tràn token, kiểm soát an toàn nội dung, đồng thời đề xuất cách tích hợp **Dataset Distillation** và **Knowledge Distillation** để tối ưu hóa hiệu năng LLM chạy trên máy nội bộ (Local GPU).

## 1.5. So sánh Kiến trúc Hiện tại và Hướng Triển khai (Context Harness)

Dưới đây là bảng phân tích chi tiết sự khác biệt cốt lõi giữa hệ thống hiện tại (Naive RAG) và hệ thống dự kiến triển khai (Context Harness + Distillation).

| Tiêu chí | Hệ thống Hiện tại (Naive RAG) | Hướng Triển khai Mới (Context Harness) | Lợi ích mang lại |
| :--- | :--- | :--- | :--- |
| **Data Processing (Xử lý dữ liệu)** | Cắt văn bản thô (PDF/Text) và đẩy thẳng vào Vector DB (`pgvector`). Dữ liệu mang nhiều nhiễu. | **Dataset Distillation:** Dùng LLM lớn tổng hợp kho tài liệu thành các cặp Q&A cực kỳ súc tích trước khi đưa vào DB. | Tăng vọt độ chính xác khi tìm kiếm. AI sẽ đọc Q&A thay vì đọc văn bản luật dài dòng. |
| **Retrieval (Truy xuất)** | Chỉ dùng tìm kiếm Semantic (Vector Similarity) với giới hạn cứng `LIMIT 3`. | Kết hợp **Hybrid Search** (Vector + BM25) lấy Top 10, sau đó dùng Reranker lọc lại Top 3. | Khắc phục điểm mù của Vector Search khi tìm các mã số Quyết định, tên người, biển số xe. |
| **Context Compression (Nén ngữ cảnh)** | Không có. Nối thẳng 3 văn bản dài bằng dấu `\n` rồi nhét vào Prompt. Rất tốn token. | **Context Harness:** Đi qua một bước "máy ép". Dùng thuật toán NLP hoặc LLM nhỏ tóm tắt lại 3 văn bản thành các keyword/ý chính. | Giảm 60-80% lượng token rác đưa vào Prompt. Tránh lỗi "Lost in the Middle" của LLM. |
| **LLM Inference (Đầu máy suy luận)** | Dùng chung 1 model `qwen2.5` nặng 7B-8B parameter. Máy laptop card 6GB VRAM bị quá tải, trả lời chậm. | **Knowledge Distillation:** Fine-tune một model siêu nhẹ (VD: `Qwen-1.5B`) bằng dataset tự sinh, chuyên trả lời hành chính. | Giải phóng hoàn toàn RAM/GPU. Tốc độ sinh chữ (Inference) tăng gấp 3 đến 5 lần. |
| **Guardrails (Kiểm soát an toàn)** | Chỉ dùng System Prompt nhắc nhở. Dễ bị tấn công Prompt Injection (bắt AI quên lệnh cũ). | **Harness Policies:** Dùng bộ lọc Regex hoặc mô hình kiểm duyệt chặn đứng mọi câu hỏi/câu trả lời không liên quan. | Đảm bảo an toàn tuyệt đối khi đưa ra phục vụ công dân (Enterprise-ready). |
| **Bộ nhớ (Memory)** | Ném toàn bộ lịch sử chat từ Frontend lên mỗi lượt, làm phình to Prompt theo thời gian. | **Harness Memory:** Chỉ giữ lại 3-5 lượt chat gần nhất, cộng thêm biến User Profile (Zalo ID, Vị trí). | Tối ưu băng thông, đảm bảo ngữ cảnh cá nhân hóa mà không làm nghẽn mô hình. |

---

## 2. Thiết kế Context Harness (Bộ điều phối ngữ cảnh)

Hệ thống hiện tại đang lấy thô `LIMIT 3` vector và đưa thẳng vào Prompt. Để nâng cấp, chúng ta cần xây dựng một "Bộ não trung gian" đứng trước LLM.

### 2.1 Cấu trúc Thư mục Đề xuất
Tạo thêm thư mục `core/` trong `ai-service/` để chứa logic của Harness:
```
ai-service/
├── core/
│   ├── context_harness.py   # Lõi quản lý rắp ráp (Assembly) & Chọn lọc (Selection)
│   ├── context_compress.py  # Thuật toán nén/tóm tắt tài liệu (Compression)
│   ├── guardrails.py        # Kiểm duyệt đầu vào (Prompt) và đầu ra (Policies)
```

### 2.2 Các tiếp cận cho Context Compression (Nén ngữ cảnh)
*Làm sao để lọc bỏ các câu từ thừa trong tài liệu thủ tục hành chính dài 10 trang trước khi đưa cho LLM?*

* **Cách 1 (Nhanh, dùng thuật toán NLP):** Sử dụng thuật toán TF-IDF hoặc BM25 để chỉ trích xuất các câu có chứa từ khóa trùng khớp với câu hỏi của người dùng. Cắt bỏ các câu không liên quan. Ưu điểm: Tốc độ tức thời (0 mili-giây).
* **Cách 2 (Thông minh, dùng LLM nhỏ - Đề xuất):** Sử dụng một model LLM cực nhẹ (như `Qwen-1.5B`) chuyên đóng vai trò "Máy nén". Khi có tài liệu từ Database trả về, model này sẽ tóm tắt 10 trang thành 3 gạch đầu dòng cốt lõi nhất. Đánh đổi: Tăng thời gian xử lý khoảng 1-2 giây.

### 2.3 Các tiếp cận cho Guardrails (Kiểm soát an toàn)
* **Cách 1:** Sử dụng Regex và Danh sách từ khóa cấm (Blacklist). Nhanh nhưng dễ bị qua mặt.
* **Cách 2 (Đề xuất):** Sử dụng thư viện [Nemo-Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) của Nvidia. Cấu hình để AI từ chối trả lời mọi câu hỏi không liên quan đến Hành chính công (Ví dụ: "Viết thơ", "Làm sao để hack").

## 3. Thiết kế tích hợp Distillation (Chưng cất)

*Vấn đề:* Card đồ họa (6GB VRAM) đang quá tải khi gánh model 7B.

### 3.1 Dataset Distillation (Chưng cất Dữ liệu) - Áp dụng cho RAG
Thay vì lưu nguyên văn các file PDF dài dòng vào Database (PostgreSQL) khiến Vector Search hay bị nhiễu.
* **Giải pháp:** Chạy một script *Offline* một lần duy nhất. Dùng model lớn (như ChatGPT hoặc Qwen-72B qua API) để đọc toàn bộ kho tài liệu của Phường Tự Lạn, sau đó "chưng cất" chúng thành **Bộ câu hỏi & Trả lời (Q&A Pairs)** cực kỳ súc tích. 
* **Kết quả:** Vector Database sẽ chỉ lưu các cặp Q&A này. Khi người dân hỏi, hệ thống sẽ search Q&A thay vì search đoạn văn thô. Độ chính xác tăng vọt.

### 3.2 Knowledge Distillation (Chưng cất Tri thức) - Áp dụng cho LLM
* **Mục tiêu:** Tạo ra một model riêng biệt tên là `tulan-smart-1.5B` có khả năng trả lời chính xác như model 7B nhưng chạy siêu mượt trên Laptop.
* **Cách làm:**
  1. Xây dựng bộ dataset tổng hợp (từ bước 3.1).
  2. Dùng bộ dữ liệu này để Fine-tune (LoRA) một model siêu nhỏ gọn (ví dụ `Qwen2.5-1.5B`).
  3. Áp dụng hàm mất mát Knowledge Distillation (bắt model 1.5B học cách nhả ra xác suất từ giống hệt model 7B) trong quá trình train.
* **Kết quả:** Triển khai model 1.5B này lên máy tính cá nhân. Tốc độ sinh chữ có thể lên tới 50 token/s.

## 4. Kế hoạch triển khai (Next Steps)
Nếu kiến trúc này được chấp thuận, luồng công việc tiếp theo sẽ là:
1. Tạo module `core/context_harness.py`. Sửa file `chat.py` để đẩy Context qua Harness trước.
2. Tích hợp bộ chặn từ khóa thô sơ (Guardrails) để kiểm chứng luồng đi.
3. Chạy script tổng hợp Dataset Distillation cho 10 tài liệu mẫu trong DB.

---
**Review & Phản hồi:** Vui lòng xem xét các đánh đổi (Trade-offs) về mặt tốc độ (Latency) ở phần 2.2 trước khi chúng ta tiến hành code thật.
