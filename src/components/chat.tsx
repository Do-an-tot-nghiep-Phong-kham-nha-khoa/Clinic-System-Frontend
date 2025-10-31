import { useEffect, useRef, useState } from "react";
import "./chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg: Message = { role: "assistant", content: "Lỗi kết nối server." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-root">
      <div className="chat-window" ref={scrollRef} aria-live="polite">
        {messages.length === 0 && <div className="chat-empty">Chào! Hãy nhập câu hỏi của bạn.</div>}

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
          aria-label="Nhập tin nhắn"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Gõ tin nhắn và nhấn Enter để gửi (Shift+Enter xuống dòng)"
          rows={2}
          disabled={isLoading}
        />
        <button className="chat-send" onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}
