import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // optional: add select: false
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

// ✅ Compare password method
userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
