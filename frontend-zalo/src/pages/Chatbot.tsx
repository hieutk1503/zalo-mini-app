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
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
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
