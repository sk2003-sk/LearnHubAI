import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    avatar: {
      url: { type: String, default: "" },
    },
    isVerified: { type: Boolean, default: false },
    activationToken: { type: String, select: false, index: true },
    activationCode: { type: String, select: false },
    resetTokenHash: { type: String, select: false, index: true },
    resetTokenExpires: { type: Date, select: false },
    twoFactor: {
      enabled: { type: Boolean, default: false },
      secret: { type: String, select: false },
    },
    refreshTokens: {
      type: [{ jti: String, createdAt: Date }],
      default: [],
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
