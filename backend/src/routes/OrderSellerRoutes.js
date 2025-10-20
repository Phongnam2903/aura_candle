const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth");
const OrderSellerController = require("../controllers/OrderController/orderSelletController");

router.get("/seller-orders", verifyToken, authorize("seller"), OrderSellerController.getSellerOrders);
router.put("/seller-orders", verifyToken, authorize("seller"), OrderSellerController.updateSellerOrderStatus);

module.exports = router;
