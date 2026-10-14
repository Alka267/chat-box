import React, { useState } from "react";
import { SearchIcon } from "./Icons";

function ChatList({ users, activeUser, onSelectUser, isMobileListOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'online' | 'unread'

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.lastMessage && u.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === "online") return u.online;
    if (filter === "unread") return (u.unread || 0) > 0;
    return true;
  });

  return (
    <aside className={`chat-list ${!isMobileListOpen ? "mobile-hidden" : ""}`}>
      <div className="chat-list-header">
        <div className="sidebar-title-row">
          <div className="sidebar-heading">
            <span>Conversations</span>
            <span className="sidebar-counter">{users.length}</span>
          </div>
        </div>

        <div className="search-box-wrapper">
          <span className="search-icon">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search contacts & chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="chat-filters">
        <button
          className={`filter-chip ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Chats
        </button>
        <button
          className={`filter-chip ${filter === "online" ? "active" : ""}`}
          onClick={() => setFilter("online")}
        >
          Online ({users.filter((u) => u.online).length})
        </button>
        <button
          className={`filter-chip ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread ({users.filter((u) => (u.unread || 0) > 0).length})
        </button>
      </div>

      <div className="users-scroll-area">
        {filteredUsers.length === 0 ? (
          <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-dim)", fontSize: "0.88rem" }}>
            No conversations found
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = activeUser && activeUser.id === user.id;
            return (
              <div
                key={user.id}
                className={`chat-user-item ${isSelected ? "active" : ""}`}
                onClick={() => onSelectUser(user)}
              >
                <div className="avatar-wrapper">
                  <div
                    className="avatar"
                    style={{
                      background: user.gradient || "var(--grad-primary)",
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", borderRadius: "14px", objectFit: "cover" }} />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={`online-badge ${user.online ? "online" : "offline"}`} />
                </div>

                <div className="user-item-info">
                  <div className="user-item-top">
                    <span className="user-item-name">{user.name}</span>
                    <span className="user-item-time">{user.time || "Just now"}</span>
                  </div>
                  <div className="user-item-bottom">
                    <span className="user-item-msg">{user.lastMessage || "No messages yet"}</span>
                    {(user.unread || 0) > 0 && (
                      <span className="unread-badge">{user.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default ChatList;