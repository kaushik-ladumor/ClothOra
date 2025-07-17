import User from "../models/User.js";
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
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password must be a string"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { name }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "name";
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`,
      });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user - password will be hashed by pre-save hook
    const user = new User({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password,
      verificationCode,
      role: role || "User",
    });

    await user.save();

    // Send email with verification code
    try {
      await sendVerificationCode(user.email, verificationCode);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Delete user if email fails to send
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email for verification code.",
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate key error for unique fields
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || "Validation error"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ==========================
// Login Controller
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password must be a string"
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Compare password using the model method
    const isPasswordValid = await user.verifyPassword(password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Wrong password"
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

    // Set token in httpOnly cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
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

    // Validate verification code format (6 digits)
    if (!/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code format",
      });
    }

    const user = await User.findOne({
      verificationCode: verificationCode.toString()
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Don't fail the verification if welcome email fails
    }

    // Generate token for immediate login after verification
    const token = generateToken(user._id);

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ==========================
// Logout Controller
// ==========================
export const logout = async (req, res) => {
  try {
    // Clear the httpOnly cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

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
