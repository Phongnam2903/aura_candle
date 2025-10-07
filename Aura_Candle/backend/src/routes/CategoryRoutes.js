const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController/categoryController");
const { verifyToken, authorize } = require("../middleware/auth");
const createUpload = require("../middleware/upload");

// Tạo middleware upload riêng cho Category (folder "categories" trên Cloudinary)
const upload = createUpload("categories");

// Lấy tất cả danh mục
router.get("/", CategoryController.getAllCategories);

// Lấy danh mục theo ID
router.get("/:id", CategoryController.getCategoryById);

// Tạo danh mục (có upload ảnh)
router.post(
    "/",
    verifyToken,
    authorize("seller"),
    upload.single("image"), // upload 1 ảnh duy nhất
    CategoryController.createCategory
);

// Cập nhật danh mục (có thể thay ảnh)
router.put(
    "/:id",
    verifyToken,
    authorize("seller"),
    upload.single("image"),
    CategoryController.updateCategory
);

// Xóa danh mục
router.delete(
    "/:id",
    verifyToken,
    authorize("seller"),
    CategoryController.deleteCategory
);

module.exports = router;
