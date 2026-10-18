import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chatnest_jwt_secret_key_super_secure_2026"
    );

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
