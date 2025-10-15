
const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require("../middleware/auth");
const { getNotifications } = require("../controllers/NotificationController/notificationController.js");

router.get("/", verifyToken, getNotifications);

module.exports = router;
