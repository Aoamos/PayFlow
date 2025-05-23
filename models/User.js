const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetToken: { type: String },
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
