import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatnest", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.warn(
      "⚠️ Tip: Make sure MongoDB is running locally, or replace MONGO_URI in .env with your MongoDB Atlas connection string (e.g., mongodb+srv://<user>:<password>@cluster0.mongodb.net/chatnest)"
    );
  }
};
