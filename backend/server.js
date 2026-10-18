import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { seedDatabase } from "./src/config/seed.js";
import { app, server } from "./src/socket/socket.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

const PORT = process.env.PORT || 5000;

// Middleware configuration - allow local dev origins
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "ChatNest Real-Time Chat API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error occurred",
  });
});

// Start HTTP & Socket.io Server
server.listen(PORT, async () => {
  console.log(`🚀 ChatNest Backend server running on: http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  await connectDB();
  await seedDatabase();
});
