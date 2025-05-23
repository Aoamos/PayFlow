const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    senderWallet: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverWallet: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
