// routes/chat.js
const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController/chatController");

// POST /chat
router.post("/", ChatController.handleChat);

module.exports = router;
