# Tu Lạn Smart Phase 4 Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Xây dựng khung giao diện React cho Zalo Mini App sử dụng Tailwind CSS, tạo màn hình Trang chủ (Home) và màn hình AI Chatbot.

**Architecture:** Sử dụng React Vite TypeScript ở thư mục `frontend-zalo`. Quản lý state với Zustand, style bằng Tailwind CSS, icon với lucide-react. Các tính năng giao tiếp API sẽ được mock ở mức độ giao diện chờ tích hợp ở Phase 5.

---

### Task 1: Cài đặt Tailwind CSS và thư viện UI Core

**Files:**
- Create: `frontend-zalo/tailwind.config.js`
- Create: `frontend-zalo/postcss.config.js`
- Modify: `frontend-zalo/src/index.css`

**Step 1: Write the failing test**
Chạy ứng dụng thử với class tailwind. Nếu chưa cài thì UI không đổi.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Cài đặt package:
```bash
cd frontend-zalo
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react zustand react-router-dom axios
```

Cấu hình `frontend-zalo/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zalo-blue': '#0068ff',
      }
    },
  },
  plugins: [],
}
```

Cập nhật `frontend-zalo/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f5f6;
}
```

**Step 4: Run test to verify it passes**
Run: `cd frontend-zalo && npm run build`
Expected: PASS (Tailwind CSS compile thành công).

**Step 5: Commit**
```bash
git add frontend-zalo/
git commit -m "feat(ui): setup tailwindcss and core ui dependencies"
```

---

### Task 2: Thiết lập Router và Layout cơ bản

**Files:**
- Create: `frontend-zalo/src/App.tsx` (sửa lại)
- Create: `frontend-zalo/src/layouts/MainLayout.tsx`

**Step 1: Write the failing test**
Chưa có route nào định nghĩa.

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo file `frontend-zalo/src/layouts/MainLayout.tsx`:
```tsx
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl relative pb-16">
      <div className="bg-zalo-blue text-white p-4 text-center font-bold text-lg sticky top-0 z-50">
        Tự Lạn Smart
      </div>
      <div className="p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
```

Sửa lại `frontend-zalo/src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>Trang chủ sẽ nằm ở đây</div>} />
          <Route path="chatbot" element={<div>Chatbot sẽ nằm ở đây</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Step 4: Run test to verify it passes**
Run: `cd frontend-zalo && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add frontend-zalo/src/
git commit -m "feat(ui): implement react router and main layout"
```

---

### Task 3: Xây dựng Giao diện Trang chủ (Home Page)

**Files:**
- Create: `frontend-zalo/src/pages/Home.tsx`
- Modify: `frontend-zalo/src/App.tsx`

**Step 1: Write the failing test**
N/A

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo `frontend-zalo/src/pages/Home.tsx`:
```tsx
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, MessageCircle, MapPin } from 'lucide-react';

export default function Home() {
  const menuItems = [
    { icon: <CalendarDays size={24}/>, label: 'Đặt lịch hẹn', path: '/appointments' },
    { icon: <FileText size={24}/>, label: 'Thủ tục HC', path: '/procedures' },
    { icon: <MapPin size={24}/>, label: 'Bản đồ', path: '/map' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-xl font-bold text-zalo-blue mb-2">Xin chào, Công dân!</h2>
        <p className="text-gray-600 text-sm">Chào mừng bạn đến với Cổng tương tác số phường Tự Lạn.</p>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 transition">
            <div className="text-zalo-blue mb-2">{item.icon}</div>
            <span className="text-xs text-center font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Floating Chatbot Button */}
      <Link to="/chatbot" className="fixed bottom-6 right-6 bg-zalo-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
        <MessageCircle size={28} />
      </Link>
    </div>
  );
}
```

Cập nhật `frontend-zalo/src/App.tsx` để thay route `index` bằng `<Home />`.

**Step 4: Run test to verify it passes**
Run: `cd frontend-zalo && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add frontend-zalo/src/
git commit -m "feat(ui): build home page with menus and chatbot fab"
```

---

### Task 4: Xây dựng Giao diện AI Chatbot

**Files:**
- Create: `frontend-zalo/src/pages/Chatbot.tsx`
- Modify: `frontend-zalo/src/App.tsx`

**Step 1: Write the failing test**
N/A

**Step 2: Run test to verify it fails**
N/A

**Step 3: Write minimal implementation**

Tạo `frontend-zalo/src/pages/Chatbot.tsx`:
```tsx
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là Trợ lý AI Tự Lạn Smart. Tôi có thể giúp gì cho bạn về thủ tục hành chính?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, isBot: false }]);
    setInput("");
    
    // Simulate AI typing
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: "Tôi đang xử lý câu hỏi của bạn. Tính năng RAG sẽ được tích hợp ở Phase 5.", isBot: true }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isBot ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-zalo-blue text-white rounded-tr-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-auto pt-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi..." 
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zalo-blue/50 text-sm"
        />
        <button onClick={handleSend} className="bg-zalo-blue text-white p-2 rounded-full hover:bg-blue-700 transition">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
```

Cập nhật `frontend-zalo/src/App.tsx` map route `/chatbot` tới `<Chatbot />`.

**Step 4: Run test to verify it passes**
Run: `cd frontend-zalo && npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add frontend-zalo/src/
git commit -m "feat(ui): implement chatbot interface with mock messages"
```
