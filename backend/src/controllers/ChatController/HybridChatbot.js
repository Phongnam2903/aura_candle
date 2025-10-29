/**
 * Hybrid Chatbot - Thông minh nhất!
 * Tự động chọn backend phù hợp:
 * 1. Rule-based cho câu hỏi đơn giản (nhanh, free)
 * 2. Ollama cho câu phức tạp (free, unlimited)
 * 3. OpenAI làm fallback (nếu có API key)
 */

const RuleBasedChatbot = require('./RuleBasedChatbot');
const OllamaChatbot = require('./OllamaChatbot');
const OpenAIChatbot = require('./ChatController');

/**
 * Phát hiện intent của user
 */
const detectIntent = (message) => {
    const normalized = message.toLowerCase();
    
    const intents = {
        // Câu hỏi đơn giản → Rule-based
        simple: [
            /mùi (nào|gì)/,
            /có mùi/,
            /giá (bao nhiêu|thế nào)/,
            /danh mục/,
            /loại/,
            /chào|hello|hi/,
            /cảm ơn|thanks/,
            /ship|giao hàng/,
            /thanh toán/
        ],
        
        // Câu hỏi phức tạp → AI (Ollama/OpenAI)
        complex: [
            /so sánh/,
            /khác nhau/,
            /nên chọn/,
            /tư vấn/,
            /phù hợp/,
            /recommend/
        ]
    };
    
    // Check simple patterns
    for (const pattern of intents.simple) {
        if (pattern.test(normalized)) {
            return 'simple';
        }
    }
    
    // Check complex patterns
    for (const pattern of intents.complex) {
        if (pattern.test(normalized)) {
            return 'complex';
        }
    }
    
    // Default: simple (rule-based)
    return 'simple';
};

/**
 * Check Ollama có available không
 */
const isOllamaAvailable = async () => {
    try {
        const axios = require('axios');
        const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
        await axios.get(`${ollamaUrl}/api/tags`, { timeout: 2000 });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Check OpenAI API key có không
 */
const isOpenAIAvailable = () => {
    return !!process.env.OPENAI_API_KEY;
};

/**
 * Handle chat với hybrid approach
 */
const handleHybridChat = async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    try {
        // Detect intent
        const intent = detectIntent(message);
        
        console.log(`🤖 Intent detected: ${intent}`);

        // Strategy 1: Simple questions → Rule-based (fastest, free)
        if (intent === 'simple') {
            console.log('📋 Using Rule-based chatbot');
            return await RuleBasedChatbot.handleRuleBasedChat(req, res);
        }

        // Strategy 2: Complex questions → Try Ollama first
        const ollamaAvailable = await isOllamaAvailable();
        if (ollamaAvailable) {
            console.log('🦙 Using Ollama chatbot');
            return await OllamaChatbot.handleOllamaChat(req, res);
        }

        // Strategy 3: Fallback to OpenAI if available
        const openAIAvailable = isOpenAIAvailable();
        if (openAIAvailable) {
            console.log('🤖 Using OpenAI chatbot');
            return await OpenAIChatbot.handleChat(req, res);
        }

        // Strategy 4: Last resort → Rule-based
        console.log('📋 Fallback to Rule-based chatbot');
        return await RuleBasedChatbot.handleRuleBasedChat(req, res);

    } catch (error) {
        console.error("❌ Lỗi hybrid chatbot:", error);
        
        // Final fallback
        return await RuleBasedChatbot.handleRuleBasedChat(req, res);
    }
};

module.exports = {
    handleHybridChat
};

