import React, { useState, useEffect, useRef } from "react";
import api from "../services/Api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && !conversationId) {
      createConversation();
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const createConversation = async () => {
    try {
      const res = await api.post("/chatbot/new-conversation");
      setConversationId(res.data.conversationId);
      // initial assistant msg
      setMessages([{ role: "assistant", content: "Xin chào! Tôi là trợ lý ảo..." , timestamp: new Date() }]);
    } catch (err) {
      console.error("Create conv err", err);
      setErrorMsg("Không thể tạo cuộc trò chuyện. Vui lòng thử lại.");
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    setErrorMsg("");
    const userMessage = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // basic client-side rate limiting: max 6 messages / minute
    // implement simple counter:
    // (in production use server-side enforcement or Redis)
    try {
      const res = await api.post("/chatbot/chat", { message: userMessage.content, conversationId });
      if (res.data?.success) {
        setMessages(prev => [...prev, { role: "assistant", content: res.data.message, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra.", timestamp: new Date() }]);
        setErrorMsg(res.data?.message || "Lỗi từ server");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const status = err?.response?.status;
      if (status === 429) {
        setErrorMsg("Bạn gửi quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.");
      } else {
        setErrorMsg("Lỗi kết nối. Vui lòng thử lại.");
      }
      setMessages(prev => [...prev, { role: "assistant", content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)}>{open ? "✕" : "💬"}</button>

      {open && (
        <div className="chat-window">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <div className="text">{m.content}</div>
                <div className="time">{new Date(m.timestamp).toLocaleTimeString('vi-VN')}</div>
              </div>
            ))}
            {loading && <div className="msg assistant">Đang suy nghĩ...</div>}
            <div ref={bottomRef} />
          </div>

          {errorMsg && <div className="error">{errorMsg}</div>}

          <form onSubmit={sendMessage} className="input-area">
            <input value={input} onChange={e => setInput(e.target.value)} disabled={loading} placeholder="Nhập tin nhắn..." />
            <button type="submit" disabled={loading || !input.trim()}>Gửi</button>
          </form>
        </div>
      )}
    </>
  );
}
