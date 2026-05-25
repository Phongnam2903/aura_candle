const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const CartController = require("../controllers/CartController/cartController");

router.get("/", verifyToken, CartController.getCart);
router.post("/add", verifyToken, CartController.addToCart);
router.put("/update", verifyToken, CartController.updateQuantity);
router.delete("/clear", verifyToken, CartController.clearCart);    // Xóa toàn bộ
router.delete("/:productId", verifyToken, CartController.removeFromCart);
router.post("/merge", verifyToken, CartController.mergeCart);      // Merge localStorage → server

module.exports = router;

