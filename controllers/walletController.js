const Transaction = require("../models/Transaction");
const Wallet = require("../models/wallet");

const transferMoney = async (req, res) => {
  try {
    const { senderWalletId, receiverWalletId, amount } = req.body;

    if (!senderWalletId || !receiverWalletId || !amount)
      return res
        .status(400)
        .json({ message: "Sender, receiver, and amount are required. " });

    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const senderWallet = await Wallet.findById(senderWalletId);
    const receiverWallet = await Wallet.findById(receiverWalletId);

    if (!senderWallet || !receiverWallet)
      return res.status(400).json({ message: "wallet not found." });

    if (senderWallet.balance < transferAmount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    senderWallet.balance -= transferAmount;
    receiverWallet.balance += transferAmount;

    await senderWallet.save();
    await receiverWallet.save();

    const transaction = await Transaction.create({
      senderWallet: senderWallet._id,
      receiverWallet: receiverWallet._id,
      amount: transferAmount,
    });

    res.status(200).json({ message: "Transfer successful", transaction });
  } catch (error) {
    console.error("Transfer Error: ", error);
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
};

const addMoney = async (req, res) => {
  try {
    const { walletId, amount } = req.body;

    if (!walletId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid wallet ID or amount." });
    }

    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({
      message: "Funds added successfully",
      wallet: { _id: wallet._id, balance: wallet.balance },
    });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const transactions = await Transaction.find()
      .populate("senderWallet", "balance user")
      .populate("receiverWallet", "balance user")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments();

    res.status(200).json({ page, limit, totalTransactions, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { transferMoney, addMoney, getTransactions };
