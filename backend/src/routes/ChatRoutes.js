// routes/chat.js
const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController/chatController");
const RuleBasedChatbot = require("../controllers/ChatController/RuleBasedChatbot");
const OllamaChatbot = require("../controllers/ChatController/OllamaChatbot");
const HybridChatbot = require("../controllers/ChatController/HybridChatbot");

// POST /chat - OpenAI-based chatbot (cần API key)
router.post("/", ChatController.handleChat);

// POST /chat/rule-based - Rule-based chatbot (KHÔNG cần API, FREE!)
router.post("/rule-based", RuleBasedChatbot.handleRuleBasedChat);

// POST /chat/ollama - Ollama local LLM (cần install Ollama, FREE & UNLIMITED!)
router.post("/ollama", OllamaChatbot.handleOllamaChat);

// POST /chat/hybrid - Hybrid chatbot (TỰ ĐỘNG chọn backend phù hợp, RECOMMENDED!)
router.post("/hybrid", HybridChatbot.handleHybridChat);

module.exports = router;
