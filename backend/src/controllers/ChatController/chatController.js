const axios = require("axios");
const { Product, Category } = require("../../models");

/**
 * Lấy thông tin sản phẩm và mùi hương từ database
 */
const getShopContext = async () => {
    try {
        // Lấy tất cả sản phẩm với category và materials
        const products = await Product.find({ isActive: true })
            .populate('category', 'name')
            .select('name price fragrances category')
            .limit(50); // Giới hạn để không quá dài

        // Lấy tất cả mùi hương unique
        const allFragrances = new Set();
        products.forEach(p => {
            if (p.fragrances && Array.isArray(p.fragrances)) {
                p.fragrances.forEach(f => allFragrances.add(f));
            }
        });

        // Lấy categories
        const categories = await Category.find().select('name');

        // Format data cho chatbot
        const productList = products.map(p => ({
            name: p.name,
            price: p.price,
            fragrances: p.fragrances || [],
            category: p.category?.name || 'Chưa phân loại'
        }));

        return {
            fragrances: Array.from(allFragrances).sort(),
            categories: categories.map(c => c.name),
            products: productList,
            totalProducts: products.length
        };
    } catch (error) {
        console.error('❌ Lỗi lấy shop context:', error);
        return {
            fragrances: [],
            categories: [],
            products: [],
            totalProducts: 0
        };
    }
};

/**
 * Tạo system prompt thông minh với context
 */
const createSystemPrompt = (shopContext) => {
    const { fragrances, categories, products } = shopContext;

    return `Bạn là AI tư vấn bán hàng thông minh của Aura Candle - shop nến thơm cao cấp.

📍 THÔNG TIN SHOP:
- Tổng sản phẩm: ${products.length} loại nến thơm
- Danh mục: ${categories.join(', ')}
- Mùi hương có sẵn: ${fragrances.length > 0 ? fragrances.join(', ') : 'Đang cập nhật'}

🎯 NHIỆM VỤ:
1. Tư vấn sản phẩm phù hợp với nhu cầu khách
2. Giới thiệu mùi hương dựa trên sở thích
3. Gợi ý sản phẩm phù hợp với từng dịp
4. Trả lời câu hỏi về nến thơm, cách sử dụng, bảo quản

📝 CÁCH TRẢ LỜI:
- Thân thiện, nhiệt tình, có emoji phù hợp 🕯️
- Ngắn gọn, dễ hiểu (2-4 câu)
- Nếu hỏi về mùi → List mùi có sẵn
- Nếu hỏi về giá → Recommend trong tầm giá
- Nếu hỏi về dịp → Gợi ý phù hợp

💡 VÍ DỤ:
Q: "Có mùi nào thơm nhẹ nhàng?"
A: "Shop mình có mấy mùi nhẹ nhàng bạn có thể thích: Lavender (thư giãn), Vanilla (ngọt ngào), hoặc White Tea (thanh tao) 🌸 Bạn thích loại nào nhất?"

Q: "Tặng sinh nhật bạn nên chọn nến gì?"
A: "Để tặng sinh nhật, mình recommend nến hương Rose hoặc Sweet Peach - thơm ngọt ngào và sang trọng 🎁 Hoặc bạn có thể chọn set quà tặng để trông xịn hơn nha!"

⚠️ LƯU Ý:
- KHÔNG bịa mùi hương không có trong danh sách
- Nếu không chắc → Hỏi thêm khách để hiểu rõ nhu cầu
- Link sản phẩm: Chỉ cần tên, khách tự search trên web
- Luôn kết thúc bằng câu hỏi để tiếp tục conversation`;
};

/**
 * Xử lý chat giữa người dùng và chatbot
 */
const handleChat = async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    // Kiểm tra đầu vào
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    let retries = 5; // Tăng từ 3 → 5 lần
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Lấy context từ shop
    const shopContext = await getShopContext();
    const systemPrompt = createSystemPrompt(shopContext);

    // Build messages với conversation history
    const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-6), // Giữ 6 tin nhắn gần nhất để tiết kiệm tokens
        { role: "user", content: message }
    ];

    let currentDelay = 2000; // Bắt đầu với 2 giây
    
    while (retries > 0) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 300,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            const botReply = response.data.choices[0].message.content;
            
            return res.json({ 
                reply: botReply,
                shopContext: {
                    availableFragrances: shopContext.fragrances,
                    categories: shopContext.categories
                }
            });
        } catch (error) {
            if (error.response && error.response.status === 429) {
                retries--;
                console.warn(`⚠️ OpenAI quá tải - đợi ${currentDelay/1000}s rồi thử lại... (Còn ${retries} lần)`);
                
                if (retries > 0) {
                    await delay(currentDelay);
                    currentDelay *= 2; // Exponential backoff: 2s → 4s → 8s → 16s → 32s
                }
            } else {
                console.error("❌ Lỗi gọi OpenAI:", error.message);
                console.error("Chi tiết:", error.response?.data || error);
                
                // Fallback response nếu OpenAI fail
                return res.json({
                    reply: `Xin lỗi, mình đang hơi bận 😅 Nhưng shop có các mùi: ${shopContext.fragrances.slice(0, 5).join(', ')}${shopContext.fragrances.length > 5 ? '...' : ''}. Bạn quan tâm mùi nào nhất?`,
                    shopContext: {
                        availableFragrances: shopContext.fragrances,
                        categories: shopContext.categories
                    }
                });
            }
        }
    }

    // Fallback nếu retry hết
    res.status(429).json({
        error: "OpenAI đang quá tải, vui lòng thử lại sau vài phút 😭",
    });
};

module.exports = {
    handleChat,
};
