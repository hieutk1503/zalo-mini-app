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
      setMessages(prev => [...prev, { id: Date.now(), text: "Tôi đang xử lý câu hỏi của bạn. Tính năng RAG sẽ được kết nối ở Phase 5.", isBot: true }]);
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
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
