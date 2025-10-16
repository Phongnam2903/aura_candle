const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth");
const { addCommentToProduct, getCommentsByProduct } = require("../controllers/Comment/commentProductController");

router.post("/:id/comment", verifyToken, addCommentToProduct);
router.get("/:id/comments", getCommentsByProduct);

module.exports = router;