
const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth");
const { getNotifications, markAsRead, markAsReadSingle, getNotificationDetail } = require("../controllers/NotificationController/notificationController.js");
const { toggleLikeNotification } = require("../controllers/NotificationController/likeNotificationController.js");
const { addCommentToNotification } = require("../controllers/NotificationController/addCommentToNotification.js");

router.get("/", verifyToken, getNotifications);

router.get("/:id", verifyToken, getNotificationDetail);

router.put("/mark-read", verifyToken, markAsRead);

router.put("/mark-read/:id", verifyToken, markAsReadSingle);

// Thả tim / bỏ tim
router.post("/:id/like", verifyToken, toggleLikeNotification);

// Thêm bình luận
router.post("/:id/comment", verifyToken, addCommentToNotification);

module.exports = router;
