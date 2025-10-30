const express = require("express");
const { verifyToken } = require("../middleware/auth");
const blogController = require("../controllers/BlogController/blogController");

const router = express.Router();

// Public routes
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);

// Protected routes (seller only)
router.get("/seller/my-blogs", verifyToken, blogController.getSellerBlogs);
router.post("/", verifyToken, blogController.createBlog);
router.put("/:id", verifyToken, blogController.updateBlog);
router.delete("/:id", verifyToken, blogController.deleteBlog);

module.exports = router;

