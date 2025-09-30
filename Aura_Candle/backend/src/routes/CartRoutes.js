const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const CartController = require("../controllers/CartController/cartController");

router.get("/", verifyToken, CartController.getCart);
router.post("/add", verifyToken, CartController.addToCart);
router.put("/update", verifyToken, CartController.updateQuantity);
router.delete("/:productId", verifyToken, CartController.removeFromCart);

module.exports = router;
