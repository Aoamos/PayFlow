const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/transfer", walletController.transferMoney);
router.patch("/add-money", walletController.addMoney);
router.get("/transactions", walletController.getTransactions);

module.exports = router;
