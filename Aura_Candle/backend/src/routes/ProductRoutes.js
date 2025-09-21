const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController/productController");

router.post("/addProduct", ProductController.addProduct);

module.exports = router; 