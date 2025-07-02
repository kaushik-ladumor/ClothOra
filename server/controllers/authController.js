import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationCode, senWelcomeEmail } from "../middleware/email.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "2d",
  });
};

export const signup = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const ExistUser = await User.findOne({ email });
    if (ExistUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      name,
      password: hashPassword,
      verificationCode,
      role: role || "User"
    });

    await user.save();
    sendVerificationCode(user.email, verificationCode);

    res.status(200).json({
      success: true,
      message: "User registered successfully. Please verify your email."
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Find user with password explicitly selected
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: "Please verify your email first" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Successful response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({ verificationCode });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    await senWelcomeEmail(user.email, user.name);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      role: user.role,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
};
