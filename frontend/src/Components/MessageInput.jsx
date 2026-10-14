import React, { useState } from "react";
import { SendIcon, SmileIcon, PaperclipIcon } from "./Icons";

const QUICK_EMOJIS = ["👋", "🔥", "❤️", "😂", "👍", "🚀", "✨", "🎉"];

function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (message.trim() === "") return;

    onSendMessage(message);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) onTyping();
  };

  return (
    <div className="message-input-container">
      {showEmojiPicker && (
        <div className="emoji-picker-strip">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji-btn"
              onClick={() => handleAddEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="input-bar-inner">
        <button
          type="button"
          className="input-action-btn"
          title="Insert Emoji"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <SmileIcon size={20} />
        </button>

        <button
          type="button"
          className="input-action-btn"
          title="Attach file or image"
          onClick={() => alert("File attachment preview: Supported in real-time mode!")}
        >
          <PaperclipIcon size={20} />
        </button>

        <input
          type="text"
          className="chat-text-input"
          placeholder="Type a message... (Press Enter to send)"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button type="submit" className="send-btn" title="Send message">
          <span>Send</span>
          <SendIcon size={16} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;