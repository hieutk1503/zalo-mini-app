# Tu Lạn Smart Phase 5 Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Tích hợp hệ thống từ Zalo Frontend qua Backend NestJS (Gateway) tới AI Service (Python). Hoàn thiện luồng dữ liệu end-to-end cho ứng dụng Tự Lạn Smart.

**Architecture:** Frontend (React) -> Backend (NestJS) -> AI Service (FastAPI) -> Qwen Model (Ollama).

---

### Task 1: Cấu hình CORS và Cài đặt thư viện HTTP cho NestJS

**Files:**
- Modify: `backend-nestjs/src/main.ts`
- Modify: `backend-nestjs/package.json`

**Step 1: Write the failing test**
Chưa có CORS nên request từ frontend sẽ bị trình duyệt chặn (CORS Error). 

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Chạy cài đặt thư viện gọi API (Axios):
```bash
cd backend-nestjs
npm install @nestjs/axios axios
```

Bật tính năng CORS ở `backend-nestjs/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Kích hoạt CORS cho Frontend
  app.enableCors({
    origin: '*', // Trong môi trường thực tế nên trỏ đúng domain frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npx @nestjs/cli build`
Expected: PASS

**Step 5: Commit**
```bash
git add backend-nestjs/
git commit -m "feat(backend): enable cors and install axios"
```

---

### Task 2: Xây dựng Chat Module (API Gateway) trong NestJS

**Files:**
- Create: `backend-nestjs/src/chat/chat.module.ts`
- Create: `backend-nestjs/src/chat/chat.service.ts`
- Create: `backend-nestjs/src/chat/chat.controller.ts`
- Modify: `backend-nestjs/src/app.module.ts`

**Step 1: Write the failing test**
Gọi `POST /chat/query` tới NestJS sẽ trả về 404 Not Found.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Lệnh tạo nhanh bằng Nest CLI:
```bash
cd backend-nestjs
npx @nestjs/cli generate module chat
npx @nestjs/cli generate service chat
npx @nestjs/cli generate controller chat
```

Cập nhật `backend-nestjs/src/chat/chat.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [HttpModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
```

Cập nhật `backend-nestjs/src/chat/chat.service.ts`:
```typescript
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  private aiServiceUrl = 'http://127.0.0.1:8000'; // Hardcode tạm hoặc dùng process.env.AI_SERVICE_URL

  constructor(private readonly httpService: HttpService) {}

  async askAi(query: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/chat/query`, { query }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException('Lỗi khi kết nối với AI Service', 500);
    }
  }
}
```

Cập nhật `backend-nestjs/src/chat/chat.controller.ts`:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  async queryChat(@Body('query') query: string) {
    return this.chatService.askAi(query);
  }
}
```

**Step 4: Run test to verify it passes**
Run: `cd backend-nestjs && npx @nestjs/cli build`
Expected: PASS

**Step 5: Commit**
```bash
git add backend-nestjs/src/
git commit -m "feat(backend): implement chat gateway module"
```

---

### Task 3: Kết nối API thực tế từ Zalo Frontend

**Files:**
- Create: `frontend-zalo/.env`
- Modify: `frontend-zalo/src/pages/Chatbot.tsx`

**Step 1: Write the failing test**
Chatbot frontend hiện tại đang dùng `setTimeout` giả lập.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo file `frontend-zalo/.env`:
```env
VITE_API_URL=http://localhost:3000
```

Sửa lại `frontend-zalo/src/pages/Chatbot.tsx`:
```tsx
import { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là Trợ lý AI Tự Lạn Smart. Tôi có thể giúp gì cho bạn về thủ tục hành chính?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/chat/query`, { query: input });
      
      const botMessage = { id: Date.now() + 1, text: response.data.answer, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Xin lỗi, AI đang gặp sự cố kết nối. Vui lòng thử lại sau.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-zalo-blue text-white rounded-tr-none'}`}>
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-tl-none p-3 text-sm italic">Đang suy nghĩ...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-auto pt-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi..." 
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zalo-blue/50 text-sm"
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading}
          className={`text-white p-2 rounded-full transition ${isLoading ? 'bg-gray-400' : 'bg-zalo-blue hover:bg-blue-700'}`}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `cd frontend-zalo && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add frontend-zalo/
git commit -m "feat(ui): integrate real api connection for chatbot"
```
