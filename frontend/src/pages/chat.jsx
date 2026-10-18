import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../Components/Navbar";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";
import { userService, messageService, SOCKET_URL } from "./Serivies/api";

function ChatPage({ currentUser, onLogout, isDarkMode, onToggleTheme }) {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const socketRef = useRef(null);

  // Find active user by id or _id
  const activeUser = users.find(
    (u) => (u.id || u._id) === activeUserId
  ) || null;

  const activeMessages = activeUserId ? messagesMap[activeUserId] || [] : [];

  // 1. Initialize Socket.io connection
  useEffect(() => {
    const currentId = currentUser?.id || currentUser?._id;
    if (!currentId) return;

    const socket = io(SOCKET_URL, {
      query: { userId: currentId },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    // Listen for online users
    socket.on("getOnlineUsers", (onlineIds = []) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const uid = user.id || user._id;
          return {
            ...user,
            online: onlineIds.includes(uid),
          };
        })
      );
    });

    // Listen for real-time incoming messages
    socket.on("newMessage", (newMsg) => {
      const senderId = newMsg.senderId;

      setMessagesMap((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), { ...newMsg, isOwn: false }],
      }));

      // Update last message & unread badge in sidebar
      setUsers((prev) =>
        prev.map((u) => {
          const uid = u.id || u._id;
          if (uid === senderId) {
            return {
              ...u,
              lastMessage: newMsg.text,
              time: newMsg.time || "Just now",
              unread: activeUserId === senderId ? 0 : (u.unread || 0) + 1,
            };
          }
          return u;
        })
      );
    });

    // Typing indicators
    socket.on("userTyping", ({ senderId }) => {
      if (activeUserId === senderId) setIsTyping(true);
    });

    socket.on("userStopTyping", ({ senderId }) => {
      if (activeUserId === senderId) setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, activeUserId]);

  // 2. Fetch registered users from MongoDB
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await userService.getUsers();
        if (res && res.users) {
          setUsers(res.users);
          // Set first user as active if not yet selected
          if (res.users.length > 0 && !activeUserId) {
            const firstId = res.users[0].id || res.users[0]._id;
            setActiveUserId(firstId);
            loadMessagesForUser(firstId);
          }
        }
      } catch (err) {
        console.error("Failed to load users from backend:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [currentUser]);

  // 3. Helper to load messages for a specific user from MongoDB
  const loadMessagesForUser = async (targetId) => {
    try {
      const res = await messageService.getMessages(targetId);
      if (res && res.messages) {
        setMessagesMap((prev) => ({
          ...prev,
          [targetId]: res.messages,
        }));
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    }
  };

  // 4. Handle selecting a user from the sidebar
  const handleSelectUser = (user) => {
    const targetId = user.id || user._id;
    setActiveUserId(targetId);
    setIsMobileListOpen(false);

    // Clear unread badge
    setUsers((prev) =>
      prev.map((u) => ((u.id || u._id) === targetId ? { ...u, unread: 0 } : u))
    );

    // Load actual messages from MongoDB
    loadMessagesForUser(targetId);
  };

  // 5. Send real message to backend & Socket.io
  const handleSendMessage = async (text) => {
    if (!activeUserId) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Temporary optimistic UI message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      _id: tempId,
      text,
      sender: currentUser?.name || "You",
      time: timeStr,
      isOwn: true,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] || []), optimisticMsg],
    }));

    // Update sidebar preview
    setUsers((prev) =>
      prev.map((u) =>
        (u.id || u._id) === activeUserId
          ? { ...u, lastMessage: `You: ${text}`, time: timeStr }
          : u
      )
    );

    // Persist in MongoDB
    try {
      const res = await messageService.sendMessage(activeUserId, text);
      if (res && res.message) {
        // Replace temp msg with confirmed message
        setMessagesMap((prev) => ({
          ...prev,
          [activeUserId]: (prev[activeUserId] || []).map((m) =>
            m.id === tempId ? res.message : m
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to send message to MongoDB:", err);
    }
  };

  // 6. Handle typing event
  const handleTyping = () => {
    if (!socketRef.current || !activeUserId) return;
    const currentId = currentUser?.id || currentUser?._id;
    socketRef.current.emit("typing", {
      senderId: currentId,
      receiverId: activeUserId,
    });

    // Debounced stop typing
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      socketRef.current?.emit("stopTyping", {
        senderId: currentId,
        receiverId: activeUserId,
      });
    }, 1500);
  };

  return (
    <div className="chat-page">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <div className="chat-container">
        <ChatList
          users={users}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
          isMobileListOpen={isMobileListOpen}
          loading={loadingUsers}
        />

        <ChatWindow
          activeUser={activeUser}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isTyping={isTyping}
          onBackToList={() => setIsMobileListOpen(true)}
        />
      </div>
    </div>
  );
}

export default ChatPage;