const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/transfer", walletController.transferMoney);
router.patch("/add-money", walletController.addMoney);
router.get("/transactions", walletController.getTransactions);
router.get("/balance", walletController.getwalletBalance);

module.exports = router;
