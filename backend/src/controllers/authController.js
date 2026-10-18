import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const GRADIENTS = [
  "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
];

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "chatnest_jwt_secret_key_super_secure_2026",
    { expiresIn: "15d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (name, email, password)",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please login instead.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Pick a vibrant gradient
    const randomGradient =
      GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      gradient: randomGradient,
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        gradient: newUser.gradient,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during registration",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gradient: user.gradient,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during login",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        gradient: req.user.gradient,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
