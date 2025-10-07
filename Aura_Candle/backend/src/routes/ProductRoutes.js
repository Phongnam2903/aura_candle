const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController/productController");
const { verifyToken, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", verifyToken, authorize("seller"), upload.array("images", 5), ProductController.addProduct);

router.get("/", ProductController.getProducts);
router.get("/search", ProductController.searchProducrByName);
router.get("/:id", ProductController.getProductById);

// UPDATE
router.put("/:id", verifyToken, authorize("seller"), upload.array("images", 5), ProductController.updateProduct);

// DELETE
router.delete("/:id", verifyToken, authorize("seller"), ProductController.deleteProduct);
module.exports = router; 