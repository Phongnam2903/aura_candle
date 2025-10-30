const express = require("express");
const { verifyToken } = require("../middleware/auth");
const blogController = require("../controllers/BlogController/blogController");

const router = express.Router();

// Public routes
router.get("/", blogController.getAllBlogs);

// Protected routes (seller only) - Phải đặt TRƯỚC route /:id
router.get("/seller/my-blogs", verifyToken, blogController.getSellerBlogs);
router.post("/", verifyToken, blogController.createBlog);

// Public và Protected routes với :id
router.get("/:id", blogController.getBlogById);
router.put("/:id", verifyToken, blogController.updateBlog);
router.delete("/:id", verifyToken, blogController.deleteBlog);

module.exports = router;

