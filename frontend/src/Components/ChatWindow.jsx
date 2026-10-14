import React, { useEffect, useRef } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { PhoneIcon, VideoIcon, MoreVerticalIcon, ArrowLeftIcon } from "./Icons";

function ChatWindow({
  activeUser,
  messages,
  onSendMessage,
  isTyping,
  onBackToList,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!activeUser) {
    return (
      <main className="chat-window" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Select a conversation</p>
          <p style={{ fontSize: "0.9rem" }}>Choose a contact from the left sidebar to start chatting</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-window">
      {/* Header */}
      <header className="chat-header">
        <div className="header-user-info">
          <button
            className="back-to-list-btn"
            onClick={onBackToList}
            title="Back to contacts"
          >
            <ArrowLeftIcon size={20} />
          </button>

          <div className="avatar-wrapper">
            <div
              className="avatar"
              style={{
                width: 44,
                height: 44,
                background: activeUser.gradient || "var(--grad-primary)",
              }}
            >
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <span
              className={`online-badge ${activeUser.online ? "online" : "offline"}`}
            />
          </div>

          <div className="header-text">
            <h3>{activeUser.name}</h3>
            <span className={`header-status ${activeUser.online ? "" : "offline"}`}>
              {activeUser.online ? "● Active Now" : "○ Last seen recently"}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn"
            title="Voice Call"
            onClick={() => alert(`Starting voice call with ${activeUser.name}...`)}
          >
            <PhoneIcon size={18} />
          </button>
          <button
            className="icon-btn"
            title="Video Call"
            onClick={() => alert(`Starting video call with ${activeUser.name}...`)}
          >
            <VideoIcon size={18} />
          </button>
          <button
            className="icon-btn"
            title="More Options"
            onClick={() => alert("Options: Mute, Block, Clear Chat")}
          >
            <MoreVerticalIcon size={18} />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="messages-container">
        <div className="date-divider">
          <span>Today</span>
        </div>

        {messages.map((msg) => (
          <Message
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            time={msg.time}
            isOwn={msg.isOwn}
          />
        ))}

        {isTyping && (
          <div className="typing-indicator" title={`${activeUser.name} is typing...`}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
}

export default ChatWindow;
