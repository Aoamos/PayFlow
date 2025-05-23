const Wallet = require("../models/wallet");

const transferMoney = async (req, res) => {
  try{

    const {senderWalletId, receiverWalletId, amount} = req.body;

    if(!senderWalletId || !receiverWalletId || !amount) return res.status(400).json({message: "Sender, receiver, and amount are required. "})
    
    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const senderWallet = await Wallet.findById(senderWalletId);
    const receiverWallet = await Wallet.findById(receiverWalletId);

    if(!senderWallet || ! receiverWallet) return res.status(400).json({message: "wallet not found."})

  
  }
}

module.exports = {  transferMoney,};
