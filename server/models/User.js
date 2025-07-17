import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method - FIXED
userSchema.methods.verifyPassword = async function (enteredPassword) {
  try {
    console.log("Comparing passwords...");
    console.log("Entered password:", enteredPassword);
    console.log("Stored hash:", this.password);

    const isMatch = await bcryptjs.compare(enteredPassword, this.password);
    console.log("Password match result:", isMatch);

    return isMatch;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;