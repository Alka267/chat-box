import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import ChatList from "../Components/ChatList";
import ChatWindow from "../Components/ChatWindow";

const INITIAL_USERS = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: null,
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    lastMessage: "Are you ready for the deployment today?",
    time: "10:42 AM",
    online: true,
    unread: 2,
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: null,
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    lastMessage: "I checked the new UI designs. Looks stunning! 😍",
    time: "Yesterday",
    online: true,
    unread: 0,
  },
  {
    id: "3",
    name: "Amit Verma",
    avatar: null,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    lastMessage: "Let's connect in the evening call.",
    time: "Yesterday",
    online: false,
    unread: 0,
  },
  {
    id: "4",
    name: "Sneha Reddy",
    avatar: null,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    lastMessage: "Shared the socket documentation with you 🚀",
    time: "Oct 10",
    online: true,
    unread: 0,
  },
  {
    id: "5",
    name: "Dev Team Global",
    avatar: null,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    lastMessage: "Rohit: Production build 2.4 is now live!",
    time: "Oct 9",
    online: true,
    unread: 5,
  },
];

const INITIAL_MESSAGES_MAP = {
  "1": [
    {
      id: "m1",
      text: "Hey Alka! Did you review the real-time chat architecture?",
      sender: "Rahul Sharma",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: "m2",
      text: "Yes Rahul, I am finishing up the frontend right now!",
      sender: "Alka",
      time: "10:38 AM",
      isOwn: true,
    },
    {
      id: "m3",
      text: "Awesome! The dark mode styling and animations look super clean.",
      sender: "Rahul Sharma",
      time: "10:40 AM",
      isOwn: false,
    },
    {
      id: "m4",
      text: "Are you ready for the deployment today?",
      sender: "Rahul Sharma",
      time: "10:42 AM",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "p1",
      text: "Hey! Just wanted to share my feedback on the design.",
      sender: "Priya Patel",
      time: "Yesterday",
      isOwn: false,
    },
    {
      id: "p2",
      text: "I checked the new UI designs. Looks stunning! 😍",
      sender: "Priya Patel",
      time: "Yesterday",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "a1",
      text: "Let's connect in the evening call.",
      sender: "Amit Verma",
      time: "Yesterday",
      isOwn: false,
    },
  ],
  "4": [
    {
      id: "s1",
      text: "Shared the socket documentation with you 🚀",
      sender: "Sneha Reddy",
      time: "Oct 10",
      isOwn: false,
    },
  ],
  "5": [
    {
      id: "g1",
      text: "Rohit: Production build 2.4 is now live!",
      sender: "Dev Team Global",
      time: "Oct 9",
      isOwn: false,
    },
  ],
};

function ChatPage({ currentUser, onLogout, isDarkMode, onToggleTheme }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeUserId, setActiveUserId] = useState("1");
  const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES_MAP);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];
  const activeMessages = messagesMap[activeUserId] || [];

  const handleSelectUser = (user) => {
    setActiveUserId(user.id);
    setIsMobileListOpen(false);

    // Clear unread badge
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, unread: 0 } : u))
    );
  };

  const handleSendMessage = (text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: `msg_${Date.now()}`,
      text,
      sender: currentUser?.name || "Alka",
      time: timeStr,
      isOwn: true,
    };

    // Update active chat messages
    setMessagesMap((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] || []), newMsg],
    }));

    // Update contact preview
    setUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId
          ? { ...u, lastMessage: `You: ${text}`, time: timeStr }
          : u
      )
    );

    // Realistic auto-reply simulation for demo showcase
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const autoReplies = [
          "Got it! That sounds super cool! 🚀",
          "Awesome, I'm working on the socket events now.",
          "Received! Let's build something epic today.",
          "Perfect! Testing real-time synchronization now. ⚡",
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        const replyMsg = {
          id: `reply_${Date.now()}`,
          text: randomReply,
          sender: activeUser.name,
          time: replyTime,
          isOwn: false,
        };

        setMessagesMap((prev) => ({
          ...prev,
          [activeUserId]: [...(prev[activeUserId] || []), replyMsg],
        }));

        setUsers((prev) =>
          prev.map((u) =>
            u.id === activeUserId
              ? { ...u, lastMessage: randomReply, time: replyTime }
              : u
          )
        );
      }, 1600);
    }, 800);
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
        />

        <ChatWindow
          activeUser={activeUser}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          onBackToList={() => setIsMobileListOpen(true)}
        />
      </div>
    </div>
  );
}

export default ChatPage;