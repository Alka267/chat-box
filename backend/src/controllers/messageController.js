import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const formatMessageTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// @desc    Get all messages between current user and selected user
// @route   GET /api/messages/:id
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    // Retrieve other user info
    const otherUser = await User.findById(userToChatId).select("name");

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );

    const formattedMessages = messages.map((msg) => {
      const isOwn = msg.senderId.toString() === myId.toString();
      return {
        id: msg._id.toString(),
        _id: msg._id.toString(),
        text: msg.text,
        sender: isOwn ? req.user.name : otherUser?.name || "User",
        senderId: msg.senderId.toString(),
        receiverId: msg.receiverId.toString(),
        time: formatMessageTime(msg.createdAt),
        isOwn,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("GetMessages Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch messages",
    });
  }
};

// @desc    Send a message to another user
// @route   POST /api/messages/send/:id
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID format",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
    });

    const formattedMessage = {
      id: newMessage._id.toString(),
      _id: newMessage._id.toString(),
      text: newMessage.text,
      sender: req.user.name,
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      time: formatMessageTime(newMessage.createdAt),
      isOwn: false,
      isRead: false,
      createdAt: newMessage.createdAt,
    };

    // Real-time broadcast to the recipient via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", formattedMessage);
    } else {
      // If receiver is offline demo contact, auto-reply from demo contact and save to MongoDB
      const recipientUser = await User.findById(receiverId);
      if (recipientUser && recipientUser.email.endsWith("@chatnest.com")) {
        setTimeout(async () => {
          try {
            const replies = [
              "Got it! That sounds super cool! 🚀",
              "Awesome, I'm checking the live updates right now.",
              "Received! Real-time messaging with MongoDB Atlas is working smoothly. ⚡",
              "Perfect! Let's build something epic today. ✨",
              "Thanks for the message! Let's connect soon.",
            ];
            const randomReply =
              replies[Math.floor(Math.random() * replies.length)];
            const replyMsg = await Message.create({
              senderId: receiverId,
              receiverId: senderId,
              text: randomReply,
            });
            const senderSocketId = getReceiverSocketId(senderId.toString());
            if (senderSocketId) {
              io.to(senderSocketId).emit("newMessage", {
                id: replyMsg._id.toString(),
                _id: replyMsg._id.toString(),
                text: replyMsg.text,
                sender: recipientUser.name,
                senderId: receiverId.toString(),
                receiverId: senderId.toString(),
                time: formatMessageTime(replyMsg.createdAt),
                isOwn: false,
                isRead: false,
                createdAt: replyMsg.createdAt,
              });
            }
          } catch (replyErr) {
            console.error("Auto-reply error:", replyErr.message);
          }
        }, 1200);
      }
    }

    // Return to sender with isOwn: true
    return res.status(201).json({
      success: true,
      message: {
        ...formattedMessage,
        isOwn: true,
      },
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
};
