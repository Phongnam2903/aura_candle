const express = require("express");

const { verifyToken } = require("../middleware/auth");
const { createOrder, getMyOrders, getOrderById } = require("../controllers/OrderController/orderController");

const router = express.Router();

// Tạo đơn hàng (checkout) - cần login
router.post("/checkout", verifyToken, createOrder);

// Lấy danh sách đơn hàng của user
router.get("/my-orders", verifyToken, getMyOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", verifyToken, getOrderById);

module.exports = router;
