/* eslint-disable no-alert */
import React, { useEffect, useRef, useState, Component } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import { Header, Page, useNavigate } from "zmp-ui";
import { API_BASE_URL } from "../../lib/config";

type ChatRole = "user" | "assistant";

type Message = {
    id: number;
    text: string;
    isBot: boolean;
    action?: { type: string; id: number };
};

const STORAGE_KEY = "chatHistory";

const greeting: Message = {
    id: 1,
    text: "Xin chào! Tôi là Trợ lý AI Tự Lạn Smart. Tôi có thể hỗ trợ bạn tra cứu thủ tục hành chính, hồ sơ, lệ phí và quy trình thực hiện.",
    isBot: true,
};

function isValidMessage(value: unknown): value is Message {
    const message = value as Partial<Message>;
    return (
        !!message &&
        typeof message.id === "number" &&
        typeof message.text === "string" &&
        typeof message.isBot === "boolean"
    );
}

function migrateMessage(value: unknown, index: number): Message | null {
    if (isValidMessage(value)) return value;

    const legacy = value as { role?: string; content?: string };
    if (typeof legacy?.content !== "string") return null;

    return {
        id: Date.now() + index,
        text: legacy.content,
        isBot: legacy.role === "bot" || legacy.role === "assistant",
    };
}

function loadMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [greeting];

    try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return [greeting];

        const migrated = parsed
            .map((item, index) => migrateMessage(item, index))
            .filter(Boolean) as Message[];

        return migrated.length > 0 ? migrated : [greeting];
    } catch {
        return [greeting];
    }
}

function toHistory(messages: Message[]): { role: ChatRole; content: string }[] {
    return messages
        .filter(message => message.id !== greeting.id && message.text.trim())
        .slice(-4)
        .map(message => ({
            role: message.isBot ? "assistant" : "user",
            content: message.text,
        }));
}

function ChatbotContent() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>(loadMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async () => {
        const query = input.trim();
        if (!query || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: query,
            isBot: false,
        };

        const history = toHistory(messages);
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const botMessageId = Date.now() + 1;

        try {
            const response = await fetch(`${API_BASE_URL}/chat/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, history }),
            });

            if (!response.ok) {
                throw new Error(`Chat API error: ${response.status}`);
            }

            // Tạo tin nhắn rỗng ban đầu để nhận luồng chữ
            setMessages(prev => [
                ...prev,
                {
                    id: botMessageId,
                    text: "",
                    isBot: true,
                },
            ]);

            // Tắt hiệu ứng loading 3 dấu chấm vì chữ sẽ bắt đầu hiện ra
            setIsLoading(false);

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No readable stream");
            const decoder = new TextDecoder("utf-8");

            let done = false;
            let partialData = "";

            while (!done) {
                // eslint-disable-next-line no-await-in-loop
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    partialData += decoder.decode(value, { stream: true });
                    const lines = partialData.split('\n');
                    partialData = lines.pop() || '';

                    // eslint-disable-next-line no-restricted-syntax
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.slice(6).trim();
                            if (dataStr === '[DONE]') {
                                done = true;
                                break;
                            }
                            try {
                                const data = JSON.parse(dataStr);
                                if (data.chunk) {
                                    setMessages(prev =>
                                        prev.map(m =>
                                            m.id === botMessageId
                                                ? {
                                                      ...m,
                                                      text: m.text + data.chunk,
                                                      action: data.action || m.action,
                                                  }
                                                : m
                                        )
                                    );
                                }
                            } catch (e) {
                                // Bỏ qua chunk bị lỗi JSON
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const exists = prev.some(m => m.id === botMessageId);
                if (exists) {
                    return prev.map(m =>
                        m.id === botMessageId
                            ? {
                                  ...m,
                                  text: "Xin lỗi, hiện chưa kết nối được trợ lý AI. Vui lòng thử lại sau.",
                              }
                            : m
                    );
                }
                return [
                    ...prev,
                    {
                        id: botMessageId,
                        text: "Xin lỗi, hiện chưa kết nối được trợ lý AI. Vui lòng thử lại sau.",
                        isBot: true,
                    },
                ];
            });
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa lịch sử trò chuyện?")) {
            return;
        }

        setMessages([greeting]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([greeting]));
    };

    return (
        <Page className="min-h-screen bg-gray-50 flex flex-col">
            <Header title="Trợ lý AI Tự Lạn" showBackIcon />

            <div className="flex-1 min-h-0 bg-white flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-main text-white flex items-center justify-center shadow-sm">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">Chat OA - Trợ lý AI</h1>
                            <p className="text-xs text-gray-500">Hỏi đáp dịch vụ công 24/7</p>
                        </div>
                    </div>

                    {messages.length > 1 && (
                        <button
                            type="button"
                            onClick={handleClearHistory}
                            className="w-9 h-9 rounded-full bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center"
                            aria-label="Xóa lịch sử"
                        >
                            <Trash2 size={17} />
                        </button>
                    )}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-4 p-4 no-scrollbar">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${
                                message.isBot ? "justify-start" : "justify-end"
                            }`}
                        >
                            {message.isBot && (
                                <div className="w-8 h-8 rounded-full bg-main text-white flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                            )}

                            <div
                                className={`max-w-[78%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed shadow-sm ${
                                    message.isBot
                                        ? "bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100"
                                        : "bg-main text-white rounded-br-sm"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{message.text}</p>

                                {message.action?.type === "PROCEDURE" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/procedures/${message.action?.id}`)
                                        }
                                        className="mt-3 w-full rounded-xl bg-white text-main border border-red-100 px-3 py-2 text-xs font-semibold"
                                    >
                                        Xem chi tiết thủ tục
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start items-end gap-2">
                            <div className="w-8 h-8 rounded-full bg-main text-white flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-red-300 rounded-full typing-dot" />
                                <div className="w-2 h-2 bg-red-400 rounded-full typing-dot" />
                                <div className="w-2 h-2 bg-main rounded-full typing-dot" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-gray-100 pb-[calc(env(safe-area-inset-bottom)+12px)]">
                    <div className="bg-gray-50 p-1.5 rounded-full flex items-center gap-2 border border-gray-200">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") { handleSend().catch(() => undefined); }
                            }}
                            placeholder="Bạn muốn hỏi gì?"
                            className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => { handleSend().catch(() => undefined); }}
                            disabled={isLoading || !input.trim()}
                            className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                                input.trim() && !isLoading
                                    ? "bg-main text-white shadow-md"
                                    : "bg-gray-200 text-gray-400"
                            }`}
                            aria-label="Gửi tin nhắn"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </Page>
    );
}

class ChatbotErrorBoundary extends Component<{children: React.ReactNode}, {error: any}> {
    constructor(props: {children: React.ReactNode}) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (
                <Page className="min-h-screen bg-gray-50 p-4">
                    <Header title="Lỗi Chatbot" showBackIcon />
                    <div className="mt-20 p-4 bg-red-100 text-red-800 rounded break-words">
                        <h2 className="font-bold">Đã xảy ra lỗi:</h2>
                        <pre className="text-xs whitespace-pre-wrap">{error.message}</pre>
                        <pre className="text-xs whitespace-pre-wrap mt-2">{error.stack}</pre>
                    </div>
                </Page>
            );
        }
        return children;
    }
}

export default function ChatbotPage() {
    return (
        <ChatbotErrorBoundary>
            <ChatbotContent />
        </ChatbotErrorBoundary>
    );
}
