import User from "../models/User.js";
import Message from "../models/Message.js";

// Helper to format timestamp nicely
const formatMessageTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const msgDate = new Date(date);

  const isToday =
    now.getDate() === msgDate.getDate() &&
    now.getMonth() === msgDate.getMonth() &&
    now.getFullYear() === msgDate.getFullYear();

  if (isToday) {
    return msgDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    yesterday.getDate() === msgDate.getDate() &&
    yesterday.getMonth() === msgDate.getMonth() &&
    yesterday.getFullYear() === msgDate.getFullYear();

  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
};

// @desc    Get all users for sidebar with last message preview
// @route   GET /api/users
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch all users except the currently logged-in user
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    // Populate latest message & unread count for each user
    const usersWithMeta = await Promise.all(
      users.map(async (user) => {
        // Latest message between loggedInUser and this user
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        }).sort({ createdAt: -1 });

        // Unread messages from this user to loggedInUser
        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: loggedInUserId,
          isRead: false,
        });

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          gradient: user.gradient,
          lastMessage: lastMsg
            ? (lastMsg.senderId.toString() === loggedInUserId.toString()
                ? "You: "
                : "") + lastMsg.text
            : "No messages yet",
          time: lastMsg ? formatMessageTime(lastMsg.createdAt) : "",
          lastMessageDate: lastMsg ? lastMsg.createdAt : new Date(0),
          unread: unreadCount,
        };
      })
    );

    // Sort users so recent chat appears at the top
    usersWithMeta.sort(
      (a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate)
    );

    return res.status(200).json({
      success: true,
      users: usersWithMeta,
    });
  } catch (error) {
    console.error("GetUsers Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load users",
    });
  }
};
