const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Wallet = require("./models/wallet");

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// connecting to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log(`MongoDB connected successfully...`);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// User registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "User already exists.",
      });

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const wallet = new Wallet({
      user: user._id,
      balance: 0,
    });
    await wallet.save();

    user.walletId = wallet._id.toString();
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name: user.name, email: user.email },
      wallet: { _id: wallet._id, balance: wallet.balance },
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({
      message: "Server Error",
      errorr: error.message,
    });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect email or password" });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: { name: user.name, email: user.email, walletId: user.walletId },
      });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.get("/dev/clear-users", async (req, res) => {
  await User.deleteMany({});
  res.send("Users cleared");
});
