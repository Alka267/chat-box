import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const seedDatabase = async () => {
  try {
    const existingAlka = await User.findOne({ email: "alka@exemple.com" });
    if (existingAlka) {
      console.log("ℹ️ Default seed users already exist in MongoDB.");
      return;
    }

    console.log("🌱 Seeding default users and conversation history into MongoDB Atlas...");

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("password123", salt);

    const alka = await User.create({
      name: "Alka Bishan",
      email: "alka@exemple.com",
      password: defaultPassword,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    });

    const rahul = await User.create({
      name: "Rahul Sharma",
      email: "rahul@chatnest.com",
      password: defaultPassword,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    });

    const priya = await User.create({
      name: "Priya Patel",
      email: "priya@chatnest.com",
      password: defaultPassword,
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    });

    const amit = await User.create({
      name: "Amit Verma",
      email: "amit@chatnest.com",
      password: defaultPassword,
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    });

    const sneha = await User.create({
      name: "Sneha Reddy",
      email: "sneha@chatnest.com",
      password: defaultPassword,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    });

    // Seed sample conversation between Alka and Rahul
    await Message.create([
      {
        senderId: rahul._id,
        receiverId: alka._id,
        text: "Hey Alka! Did you review the real-time chat architecture?",
        isRead: true,
      },
      {
        senderId: alka._id,
        receiverId: rahul._id,
        text: "Yes Rahul, I am testing the MongoDB Atlas and Socket.io connection now!",
        isRead: true,
      },
      {
        senderId: rahul._id,
        receiverId: alka._id,
        text: "Awesome! The dark mode styling and animations look super clean.",
        isRead: true,
      },
      {
        senderId: rahul._id,
        receiverId: alka._id,
        text: "Are you ready for the deployment today?",
        isRead: false,
      },
      // Message from Priya
      {
        senderId: priya._id,
        receiverId: alka._id,
        text: "I checked the new UI designs. Looks stunning! 😍",
        isRead: true,
      },
      // Message from Amit
      {
        senderId: amit._id,
        receiverId: alka._id,
        text: "Let's connect in the evening call.",
        isRead: true,
      },
      // Message from Sneha
      {
        senderId: sneha._id,
        receiverId: alka._id,
        text: "Shared the socket documentation with you 🚀",
        isRead: true,
      },
    ]);

    console.log("✅ Seed data successfully created in MongoDB Atlas!");
  } catch (error) {
    console.error("⚠️ Error while seeding database:", error.message);
  }
};
