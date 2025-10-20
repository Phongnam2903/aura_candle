const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
    addCommentToProduct,
    getCommentsByProduct,
    toggleLikeComment,
    deleteComment,
} = require("../controllers/Comment/commentProductController");

// Thêm bình luận hoặc phản hồi cho sản phẩm
router.post("/:id/comment", verifyToken, addCommentToProduct);

// Lấy tất cả bình luận (và phản hồi) theo sản phẩm
router.get("/:id/comments", getCommentsByProduct);

// Thả tim / bỏ tim một bình luận
router.patch("/:commentId/like", verifyToken, toggleLikeComment);

// Thu hồi (xóa) bình luận của chính mình
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;
