import User from '../models/User.js';
import bcryptjs from 'bcryptjs';

export const FindUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const updatePassword = async (req, res) => {
  try {
    console.log("Update password request received");
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.user?.id);

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user with password field (req.user.id comes from JWT payload)
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Found user:", user.email);
    console.log("Verifying old password...");

    // Verify old password
    const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    console.log("Old password valid:", isOldPasswordValid);

    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    
    // Update password (using req.user.id from JWT)
    await User.findByIdAndUpdate(req.user.id, { 
      password: hashedNewPassword 
    });

    console.log("Password updated successfully");

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


