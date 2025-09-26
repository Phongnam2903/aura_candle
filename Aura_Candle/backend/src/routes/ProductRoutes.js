const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController/productController");
const { verifyToken, authorize } = require("../middleware/auth");

router.post("/addProduct", verifyToken, authorize("seller"), ProductController.addProduct);

module.exports = router; 