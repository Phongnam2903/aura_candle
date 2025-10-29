/**
 * Rule-Based Chatbot - KHÔNG cần OpenAI API
 * 100% FREE, không giới hạn requests
 */

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
            products: products
        };
    } catch (error) {
        console.error('❌ Lỗi lấy shop context:', error);
        return { fragrances: [], categories: [], products: [] };
    }
};

/**
 * Normalize text để match dễ hơn
 */
const normalizeText = (text) => {
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/đ/g, "d")
        .trim();
};

/**
 * Check keywords trong message
 */
const containsKeywords = (message, keywords) => {
    const normalized = normalizeText(message);
    return keywords.some(keyword => normalized.includes(normalizeText(keyword)));
};

/**
 * Rule-based response generator với conversation memory
 */
const generateResponse = async (message, shopContext, conversationHistory = []) => {
    const { fragrances, categories, products } = shopContext;
    
    // Lấy câu bot reply trước đó (để hiểu context)
    const lastBotMessage = conversationHistory.length > 0 
        ? conversationHistory[conversationHistory.length - 1]?.content 
        : null;

    // ========== FOLLOW-UP RESPONSES (Dựa trên context) ==========
    
    // Rule 0.1: User trả lời "Có/Được/OK" cho câu hỏi trước
    if (containsKeywords(message, ['có', 'được', 'ok', 'okay', 'yes', 'ừ', 'uhm', 'đồng ý'])) {
        // Check context của câu bot trước
        if (lastBotMessage) {
            // Nếu bot hỏi về set quà tặng
            if (normalizeText(lastBotMessage).includes('set qua tang') || 
                normalizeText(lastBotMessage).includes('hop dep')) {
                return `Tuyệt vời! 🎁\n\nShop mình có các set quà tặng:\n• Set 2 nến mini (150k) - Hộp hồng xinh xắn\n• Set 3 nến mix mùi (250k) - Hộp sang trọng\n• Set premium + thiệp (350k) - Hộp gỗ cao cấp\n\nBạn thích set nào nhất? Hoặc budget khoảng bao nhiêu?`;
            }
            
            // Nếu bot hỏi về chi tiết sản phẩm
            if (normalizeText(lastBotMessage).includes('chi tiet') || 
                normalizeText(lastBotMessage).includes('muon biet them')) {
                return `Vâng ạ! Mình sẽ tư vấn chi tiết nha 🌸\n\nNến của shop:\n✨ Sáp đậu nành tự nhiên 100%\n✨ Thời gian cháy: 20-40 giờ\n✨ Đóng hộp đẹp, có thiệp\n✨ Bảo hành 6 tháng\n\nBạn muốn biết thêm về mùi hương hay size nào?`;
            }
            
            // Nếu bot gợi ý mùi cụ thể
            for (const fragrance of fragrances) {
                if (normalizeText(lastBotMessage).includes(normalizeText(fragrance))) {
                    const fragranceProducts = products.filter(p => 
                        p.fragrances && p.fragrances.some(f => 
                            normalizeText(f) === normalizeText(fragrance)
                        )
                    );
                    
                    if (fragranceProducts.length > 0) {
                        const product = fragranceProducts[0];
                        return `Tuyệt! Mùi ${fragrance} rất được ưa chuộng 🕯️\n\n${product.name}\nGiá: ${product.price.toLocaleString()}đ\n\nĐặc điểm:\n✨ Thơm lâu 20-40 giờ\n✨ Sáp tự nhiên, an toàn\n✨ Đóng hộp sang trọng\n\nBạn muốn đặt bao nhiêu cái? Hoặc xem thêm mùi khác?`;
                    }
                }
            }
        }
        
        // Fallback nếu không match context cụ thể
        return `Tuyệt vời! 😊\n\nBạn muốn mình tư vấn thêm về:\n• Giá cả & size\n• Mùi hương phù hợp\n• Giao hàng & thanh toán\n• Set quà tặng\n\nCứ hỏi thoải mái nha!`;
    }
    
    // Rule 0.2: User trả lời "Không" cho câu hỏi trước
    if (containsKeywords(message, ['không', 'no', 'thôi', 'ko', 'khong'])) {
        return `Không sao! 😊\n\nBạn muốn xem mùi hương khác hoặc cần tư vấn gì không?\n\nShop có ${fragrances.length} mùi khác nhau, luôn sẵn sàng giúp bạn tìm được nến ưng ý nhất! 🕯️`;
    }
    
    // Rule 0.3: User hỏi "Bao nhiêu?" sau khi bot giới thiệu
    if (containsKeywords(message, ['bao nhiêu', 'giá', 'price']) && lastBotMessage) {
        // Tìm mùi hương trong câu bot trước
        for (const fragrance of fragrances) {
            if (normalizeText(lastBotMessage).includes(normalizeText(fragrance))) {
                const fragranceProducts = products.filter(p => 
                    p.fragrances && p.fragrances.some(f => 
                        normalizeText(f) === normalizeText(fragrance)
                    )
                );
                
                if (fragranceProducts.length > 0) {
                    const productList = fragranceProducts.map(p => 
                        `• ${p.name}: ${p.price.toLocaleString()}đ`
                    ).join('\n');
                    
                    return `Giá nến ${fragrance}: 💰\n\n${productList}\n\nBạn muốn size nào? Hoặc cần tư vấn thêm không?`;
                }
            }
        }
    }

    // ========== MAIN RULES (Câu hỏi chính) ==========

    // Rule 1: Hỏi về mùi hương có sẵn
    if (containsKeywords(message, ['mùi nào', 'có mùi', 'hương nào', 'mùi gì', 'scent', 'fragrance'])) {
        if (fragrances.length === 0) {
            return "Xin lỗi, hiện shop đang cập nhật sản phẩm. Bạn vui lòng quay lại sau nhé! 🕯️";
        }
        
        const fragranceList = fragrances.slice(0, 8).join(', ');
        const more = fragrances.length > 8 ? ` và ${fragrances.length - 8} mùi khác` : '';
        
        return `Shop mình có các mùi hương: ${fragranceList}${more} 🌸\n\nBạn thích mùi nào nhất? Mình sẽ tư vấn chi tiết nha!`;
    }

    // Rule 2: Hỏi về mùi cụ thể
    for (const fragrance of fragrances) {
        if (containsKeywords(message, [fragrance])) {
            const fragranceProducts = products.filter(p => 
                p.fragrances && p.fragrances.some(f => 
                    normalizeText(f) === normalizeText(fragrance)
                )
            );
            
            if (fragranceProducts.length > 0) {
                const productNames = fragranceProducts.slice(0, 3).map(p => 
                    `${p.name} (${p.price.toLocaleString()}đ)`
                ).join(', ');
                
                return `Có nha! Shop mình có mùi ${fragrance} 🕯️\n\nSản phẩm: ${productNames}\n\nBạn muốn biết thêm chi tiết sản phẩm nào không?`;
            } else {
                return `Mùi ${fragrance} hiện đang hết hàng 😢 Bạn muốn thử mùi khác không? Shop có: ${fragrances.slice(0, 5).join(', ')}...`;
            }
        }
    }

    // Rule 3: Hỏi về giá
    if (containsKeywords(message, ['giá', 'bao nhiêu', 'price', 'cost', 'tiền'])) {
        if (products.length === 0) {
            return "Shop đang cập nhật giá sản phẩm. Bạn để lại SĐT, mình sẽ tư vấn chi tiết nhé! 📞";
        }
        
        const prices = products.map(p => p.price).sort((a, b) => a - b);
        const minPrice = prices[0].toLocaleString();
        const maxPrice = prices[prices.length - 1].toLocaleString();
        
        return `Nến của shop mình có giá từ ${minPrice}đ đến ${maxPrice}đ tùy loại nha! 💰\n\nBạn có ngân sách khoảng bao nhiêu? Mình sẽ gợi ý sản phẩm phù hợp!`;
    }

    // Rule 4: Hỏi về quà tặng/sinh nhật
    if (containsKeywords(message, ['quà', 'tặng', 'sinh nhật', 'gift', 'birthday', 'anniversary'])) {
        const giftFragrances = ['Rose', 'Jasmine', 'Vanilla', 'Peach'];
        const available = fragrances.filter(f => 
            giftFragrances.some(gf => normalizeText(f).includes(normalizeText(gf)))
        );
        
        if (available.length > 0) {
            return `Để tặng quà, mình recommend nến hương ${available.slice(0, 3).join(', ')} - sang trọng và ý nghĩa 🎁\n\nShop cũng có set quà tặng kèm hộp đẹp nha! Bạn muốn xem không?`;
        }
        
        return `Shop mình có nhiều loại nến phù hợp làm quà tặng 🎁\n\nMùi hương có: ${fragrances.slice(0, 5).join(', ')}...\n\nBạn muốn tặng cho ai để mình tư vấn phù hợp nhất nha?`;
    }

    // Rule 5: Hỏi về thư giãn/ngủ ngon
    if (containsKeywords(message, ['thư giãn', 'relax', 'ngủ', 'sleep', 'stress', 'căng thẳng'])) {
        const relaxFragrances = ['Lavender', 'Chamomile', 'Vanilla', 'Sandalwood'];
        const available = fragrances.filter(f => 
            relaxFragrances.some(rf => normalizeText(f).includes(normalizeText(rf)))
        );
        
        if (available.length > 0) {
            return `Để thư giãn và ngủ ngon, mình recommend: ${available.join(', ')} 😌\n\nNhững mùi này giúp giảm stress và tạo không gian yên bình. Bạn thích mùi nào?`;
        }
        
        return `Nến thơm rất tốt cho thư giãn! 😌\n\nShop có nhiều mùi nhẹ nhàng: ${fragrances.slice(0, 5).join(', ')}...\n\nBạn muốn mùi nào?`;
    }

    // Rule 6: Hỏi về danh mục
    if (containsKeywords(message, ['loại', 'danh mục', 'category', 'types'])) {
        if (categories.length > 0) {
            return `Shop mình có các loại: ${categories.join(', ')} 🕯️\n\nBạn quan tâm loại nào nhất?`;
        }
    }

    // Rule 7: Hỏi về size/kích thước
    if (containsKeywords(message, ['size', 'kích thước', 'lớn', 'nhỏ', 'gram', 'ml'])) {
        return `Shop có nhiều size khác nhau từ 50g đến 300g tùy sản phẩm nha! 📏\n\nSize lớn sẽ cháy lâu hơn (20-40 giờ). Bạn muốn size nào?`;
    }

    // Rule 8: Hỏi về chất liệu/thành phần
    if (containsKeywords(message, ['chất liệu', 'thành phần', 'material', 'sáp', 'wax', 'natural'])) {
        return `Nến của shop mình làm từ sáp đậu nành tự nhiên 100% 🌱\n\n✨ An toàn, không độc hại\n✨ Cháy sạch, không khói đen\n✨ Thơm lâu, dịu nhẹ\n\nBạn muốn biết thêm gì không?`;
    }

    // Rule 9: Chào hỏi
    if (containsKeywords(message, ['hi', 'hello', 'chào', 'xin chào', 'hey'])) {
        return `Xin chào! Mình là trợ lý ảo của Aura Candle 🕯️\n\nShop mình chuyên nến thơm handmade cao cấp với ${fragrances.length} mùi hương khác nhau.\n\nBạn muốn tìm mùi nào? Hoặc cần tư vấn gì không?`;
    }

    // Rule 10: Cảm ơn
    if (containsKeywords(message, ['cảm ơn', 'thank', 'thanks', 'cám ơn'])) {
        return `Không có gì! 🥰\n\nNếu bạn còn thắc mắc gì, cứ hỏi mình nha! Hoặc liên hệ hotline để được tư vấn trực tiếp! 📞`;
    }

    // Rule 11: Hỏi về giao hàng/ship
    if (containsKeywords(message, ['ship', 'giao hàng', 'delivery', 'vận chuyển', 'nhận hàng'])) {
        return `Shop mình giao hàng toàn quốc nha! 🚚\n\n📦 Nội thành: 1-2 ngày\n📦 Tỉnh xa: 3-5 ngày\n\nFreeship đơn từ 300k! Bạn ở đâu?`;
    }

    // Rule 12: Hỏi về thanh toán
    if (containsKeywords(message, ['thanh toán', 'payment', 'chuyển khoản', 'cod', 'tiền'])) {
        return `Shop nhận thanh toán: 💳\n\n✅ COD (ship rồi mới trả tiền)\n✅ Chuyển khoản ngân hàng\n\nAn toàn và tiện lợi! Bạn muốn thanh toán kiểu nào?`;
    }

    // Default: Không hiểu
    return `Xin lỗi, mình chưa hiểu rõ câu hỏi của bạn 😅\n\nBạn có thể hỏi mình về:\n• Mùi hương có gì?\n• Giá bao nhiêu?\n• Tư vấn quà tặng\n• Chất liệu sản phẩm\n• Giao hàng & thanh toán\n\nHoặc gọi hotline để được tư vấn trực tiếp nha! 📞`;
};

/**
 * Handle chat với rule-based bot
 */
const handleRuleBasedChat = async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    try {
        // Lấy shop context
        const shopContext = await getShopContext();
        
        // Generate response based on rules WITH conversation history
        const reply = await generateResponse(message, shopContext, conversationHistory);
        
        return res.json({
            reply,
            shopContext: {
                availableFragrances: shopContext.fragrances,
                categories: shopContext.categories
            },
            source: 'rule-based' // Để frontend biết đây là bot rule-based
        });
    } catch (error) {
        console.error("❌ Lỗi rule-based chatbot:", error);
        return res.status(500).json({
            error: "Bot đang bận, thử lại sau nhé 😅"
        });
    }
};

module.exports = {
    handleRuleBasedChat
};

