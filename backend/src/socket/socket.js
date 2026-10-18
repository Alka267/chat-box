import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or localhost origins
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map of online users: { [userId]: socketId }
const userSocketMap = {};

// Helper function to get socket ID of a specific user
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`⚡ Socket connected: ${socket.id} (User: ${userId || "Guest"})`);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast list of currently online user IDs to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // User joins a personal private room
  if (userId) {
    socket.join(userId);
  }

  // Handle typing status
  socket.on("typing", ({ receiverId, senderId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ receiverId, senderId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    // Broadcast updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
