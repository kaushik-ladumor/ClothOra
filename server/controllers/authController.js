import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationCode, sendWelcomeEmail } from "../middleware/email.js";

// JWT Token Generator
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "2d",
  });
};

// ==========================
// Signup Controller
// ==========================
export const signup = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Input validation
    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password and generate 6-digit code
    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = new User({
      email,
      name,
      password: hashPassword,
      verificationCode,
      role: role || "User",
    });

    await user.save();

    // Send email with verification code
    await sendVerificationCode(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ==========================
// Login Controller
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ==========================
// Verify Email Controller
// ==========================
export const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    const user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      role: user.role,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ==========================
// Logout Controller
// ==========================
export const logout = async (req, res) => {
  try {
    // JWT logout is client-side (remove token)
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};
