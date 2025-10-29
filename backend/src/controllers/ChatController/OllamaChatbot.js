/**
 * Ollama Local LLM Chatbot - Chạy AI trên máy local
 * KHÔNG cần OpenAI API, hoàn toàn FREE & UNLIMITED
 * 
 * Setup: https://ollama.ai
 * Models: llama2, mistral, phi, gemma...
 */

const axios = require("axios");
const { Product, Category } = require("../../models");

/**
 * Lấy shop context
 */
const getShopContext = async () => {
    try {
        const products = await Product.find({ isActive: true })
            .populate('category', 'name')
            .select('name price fragrances category')
            .limit(50);

        const allFragrances = new Set();
        products.forEach(p => {
            if (p.fragrances && Array.isArray(p.fragrances)) {
                p.fragrances.forEach(f => allFragrances.add(f));
            }
        });

        const categories = await Category.find().select('name');

        return {
            fragrances: Array.from(allFragrances).sort(),
            categories: categories.map(c => c.name),
            products: products.map(p => ({
                name: p.name,
                price: p.price,
                fragrances: p.fragrances || [],
                category: p.category?.name || 'Chưa phân loại'
            }))
        };
    } catch (error) {
        console.error('❌ Lỗi lấy shop context:', error);
        return { fragrances: [], categories: [], products: [] };
    }
};

/**
 * Tạo system prompt cho Ollama
 */
const createSystemPrompt = (shopContext) => {
    const { fragrances, categories, products } = shopContext;

    return `Bạn là AI tư vấn bán hàng thông minh của Aura Candle - shop nến thơm cao cấp.

THÔNG TIN SHOP:
- Tổng sản phẩm: ${products.length} loại nến thơm
- Danh mục: ${categories.join(', ')}
- Mùi hương có sẵn: ${fragrances.join(', ')}

NHIỆM VỤ:
1. Tư vấn sản phẩm phù hợp với nhu cầu khách
2. Giới thiệu mùi hương dựa trên sở thích
3. Gợi ý sản phẩm phù hợp với từng dịp
4. Trả lời câu hỏi về nến thơm, cách sử dụng, bảo quản

CÁCH TRẢ LỜI:
- Thân thiện, nhiệt tình, có emoji phù hợp 🕯️
- Ngắn gọn, dễ hiểu (2-4 câu)
- Nếu hỏi về mùi → List mùi có sẵn
- Nếu hỏi về giá → Recommend trong tầm giá
- KHÔNG bịa mùi hương không có trong danh sách`;
};

/**
 * Handle chat với Ollama local LLM
 */
const handleOllamaChat = async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    try {
        // Lấy shop context
        const shopContext = await getShopContext();
        const systemPrompt = createSystemPrompt(shopContext);

        // Build prompt cho Ollama (không có messages array như OpenAI)
        let fullPrompt = `${systemPrompt}\n\n`;
        
        // Add conversation history
        conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                fullPrompt += `User: ${msg.content}\n`;
            } else {
                fullPrompt += `Assistant: ${msg.content}\n`;
            }
        });
        
        fullPrompt += `User: ${message}\nAssistant:`;

        // Call Ollama API (local)
        const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
        const model = process.env.OLLAMA_MODEL || 'llama2'; // hoặc 'mistral', 'phi'

        console.log(`📡 Calling Ollama (${model})...`);

        const response = await axios.post(
            `${ollamaUrl}/api/generate`,
            {
                model: model,
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 200 // Giới hạn độ dài reply
                }
            },
            {
                timeout: 60000 // 60s timeout (local LLM có thể chậm)
            }
        );

        const botReply = response.data.response;

        console.log('✅ Ollama response received');

        return res.json({
            reply: botReply,
            shopContext: {
                availableFragrances: shopContext.fragrances,
                categories: shopContext.categories
            },
            source: 'ollama',
            model: model
        });
    } catch (error) {
        console.error("❌ Lỗi Ollama chatbot:", error.message);
        
        // Check if Ollama is not running
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: "Ollama chưa chạy. Vui lòng start Ollama: 'ollama serve'",
                hint: "Download tại: https://ollama.ai"
            });
        }

        return res.status(500).json({
            error: "Bot đang bận, thử lại sau nhé 😅",
            details: error.message
        });
    }
};

module.exports = {
    handleOllamaChat
};

