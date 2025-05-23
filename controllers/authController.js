const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
} = require("../services/emailServices");
const User = require("../models/User");
const Wallet = require("../models/wallet");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required " });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.random().toString(36).substring(2, 15); // Creating a simple token manually
    user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
    await user.save();

    const wallet = new Wallet({ user: user._id, balance: 0 });
    await wallet.save();

    user.walletId = wallet._id;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: "User registered successfully",
      user: { name: user.name, email: user.email },
      wallet: { _id: wallet._id, balance: wallet.balance },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user)
      return res.status(400).json({ message: "Invalid verfication link" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, walletId: user.walletId },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ message: "Make sure you registered first" });

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error in forgetPassword: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({ path: "walletId", select: "balance" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgetPassword,
  getAllUsers,
};
