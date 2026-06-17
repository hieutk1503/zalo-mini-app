import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là Trợ lý AI Tự Lạn Smart. Tôi có thể giúp gì cho bạn về thủ tục hành chính?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Xin lỗi, AI đang gặp sự cố kết nối. Vui lòng thử lại sau.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl overflow-hidden shadow-inner">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-5 p-4 pb-24 no-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
            {msg.isBot && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div className={`max-w-[75%] p-3.5 shadow-sm ${msg.isBot ? 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100' : 'bg-primary text-white rounded-2xl rounded-br-sm'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>

            {!msg.isBot && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Cong+Dan&background=e0f2fe&color=0369a1" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-primary/40 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-primary rounded-full typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-20 left-0 w-full px-4">
        <div className="glass-panel p-2 rounded-full flex items-center gap-2 shadow-lg shadow-gray-200/50 border border-white">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Bạn muốn hỏi gì?" 
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${input.trim() && !isLoading ? 'bg-primary text-white hover:scale-105 shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-400'}`}>
            <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
