
const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth");
const { getNotifications, markAsRead, markAsReadSingle, getNotificationDetail } = require("../controllers/NotificationController/notificationController.js");

router.get("/", verifyToken, getNotifications);

router.get("/:id", verifyToken, getNotificationDetail);

router.put("/mark-read", verifyToken, markAsRead);

router.put("/mark-read/:id", verifyToken, markAsReadSingle);

module.exports = router;
