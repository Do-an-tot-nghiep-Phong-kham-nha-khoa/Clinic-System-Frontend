import { useEffect, useRef, useState } from "react";
import "./chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (msg?: string) => {
    const messageToSend = msg ?? input.trim();
    if (!messageToSend) return;

    const userMsg: Message = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();
      const botMsg: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = { role: "assistant", content: "Lỗi kết nối server." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (val.trim()) sendMessage(val.trim());
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (debounceTimer) clearTimeout(debounceTimer);
      sendMessage();
    }
  };

  return (
    <div className="chat-root">
      <div className="chat-window" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">Chào! Hãy nhập câu hỏi của bạn.</div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.role}`}>
            <div className="bubble">
              <div className="meta">
                <span className="speaker">{m.role === "user" ? "Bạn" : "Bot"}</span>
              </div>
              <div className="content">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="bubble">
              <div className="content">...</div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Gõ tin nhắn và nhấn Enter để gửi (Shift+Enter xuống dòng)"
          rows={2}
          disabled={isLoading}
        />
        <button
          className="chat-send"
          onClick={() => {
            if (debounceTimer) clearTimeout(debounceTimer);
            sendMessage();
          }}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}
