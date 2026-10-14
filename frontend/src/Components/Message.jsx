import React from "react";

function Message({ text, sender, time, isOwn, status = "read" }) {
  return (
    <div className={`message ${isOwn ? "own" : ""}`}>
      <div className="message-content">
        <p>{text}</p>
      </div>
      <div className="message-meta">
        <span>{time}</span>
        {isOwn && (
          <span className="check-marks" title="Delivered & Read">
            ✓✓
          </span>
        )}
      </div>
    </div>
  );
}

export default Message;