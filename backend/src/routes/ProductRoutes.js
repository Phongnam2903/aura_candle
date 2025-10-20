const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController/productController");
const { verifyToken, authorize } = require("../middleware/auth");
const createUpload = require("../middleware/upload");

// Upload lên folder "products"
const upload = createUpload("products");

// Route cho JSON request (không có file upload)
router.post("/",
    verifyToken,
    authorize("seller"),
    ProductController.addProduct
);

// Route cho multipart request (có file upload)
router.post(
    "/upload",
    verifyToken,
    authorize("seller"),
    upload.array("images", 5),
    ProductController.addProduct
);

router.get("/", ProductController.getProducts);
router.get("/search", ProductController.searchProducrByName);
router.get("/:id", ProductController.getProductById);
router.get("/category/:slug", ProductController.getProductBySlug);
router.get("/related", ProductController.getProductsByCategory);



// Route cho JSON request (không có file upload)
router.put(
    "/:id",
    verifyToken,
    authorize("seller"),
    ProductController.updateProduct
);

// Route cho multipart request (có file upload)
router.put(
    "/:id/upload",
    verifyToken,
    authorize("seller"),
    upload.array("images", 5),
    ProductController.updateProduct
);

router.delete(
    "/:id",
    verifyToken,
    authorize("seller"),
    ProductController.deleteProduct
);

module.exports = router;
