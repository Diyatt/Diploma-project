import React, { useState } from "react";
import "./ChatWidget.css";
import api from "../../utils/api";

const urlRegex = /(https?:\/\/[^\s]+)/g;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can we help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post(
        "/ask/",
        { query: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(msgs => [...msgs, { from: "bot", text: res.data.response }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { from: "bot", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  // Helper to render message with links
  const renderMessageText = (text) => {
    const parts = text.split(urlRegex);
    return parts.map((part, idx) => {
      if (urlRegex.test(part)) {
        return (
          <a key={idx} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#3b6ef6', wordBreak: 'break-all' }}>
            {part}
          </a>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <>
      {!open && (
        <div className="chat-widget-btn" onClick={() => setOpen(true)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#3b6ef6">
            <circle cx="12" cy="12" r="12" fill="#3b6ef6"/>
            <path d="M7 10h10M7 14h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      {open && (
        <div className="chat-widget-window">
          <div className="chat-widget-header">
            <span>Chat</span>
            <button className="chat-widget-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-widget-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-widget-message${msg.from === "user" ? " user" : ""}`}
                style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", background: msg.from === "user" ? "#3b6ef6" : "#e6edff", color: msg.from === "user" ? "#fff" : "#3b6ef6" }}
              >
                {renderMessageText(msg.text)}
              </div>
            ))}
            {loading && <div className="chat-widget-message">Loading...</div>}
          </div>
          <div className="chat-widget-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
