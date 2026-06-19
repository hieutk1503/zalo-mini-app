import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



type Message = { id: number; text: string; isBot: boolean; action?: { type: string, id: number } };

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
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
      const chatHistory = messages
        .filter(m => m.id !== 1)
        .slice(-4)
        .map(m => ({
          role: m.isBot ? 'assistant' : 'user',
          content: m.text
        }));

      // Directly call AI service for SSE Streaming
      const AI_SERVICE_URL = 'http://localhost:8000/api';
      const response = await fetch(`${AI_SERVICE_URL}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, history: chatHistory })
      });

      if (!response.body) throw new Error('ReadableStream not supported.');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      const newBotMessageId = Date.now() + 1;
      
      let botResponseText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            const dataStr = line.substring(6);
            try {
              const data = JSON.parse(dataStr);
              botResponseText += data.chunk;
              
              setMessages(prev => {
                const messageExists = prev.some(m => m.id === newBotMessageId);
                
                if (!messageExists) {
                  setIsLoading(false);
                  return [...prev, { id: newBotMessageId, text: botResponseText, isBot: true, action: data.action }];
                } else {
                  return prev.map(m => 
                    m.id === newBotMessageId 
                      ? { ...m, text: botResponseText, action: data.action || m.action } 
                      : m
                  );
                }
              });
            } catch (e) {
              console.error("Parse error", e);
            }
          }
        }
      }
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
              
              {msg.action && msg.action.type === 'PROCEDURE' && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button 
                    onClick={() => navigate(`/procedures/${msg.action!.id}`)}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    👉 Xem chi tiết & Nộp hồ sơ
                  </button>
                </div>
              )}
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
