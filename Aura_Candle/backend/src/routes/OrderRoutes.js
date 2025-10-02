const express = require("express");

const { verifyToken } = require("../middleware/auth");
const orderController = require("../controllers/OrderController/orderController");
const router = express.Router();

// Tạo đơn hàng (checkout) - cần login
router.post("/checkout", verifyToken, orderController.createOrder);

// Lấy danh sách đơn hàng của user
router.get("/my-orders", verifyToken, orderController.getMyOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", verifyToken, orderController.getOrderById);

module.exports = router;
