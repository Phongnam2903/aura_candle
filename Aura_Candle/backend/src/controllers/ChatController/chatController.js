// controllers/chatController.js
const Product = require("../../models/Product");
const Chat = require("../../models/Chat");

const handleChat = async (req, res) => {
    const { userId, message } = req.body;
    const lowerMsg = message.toLowerCase();

    try {
        let reply = "";

        //  Tra cứu sản phẩm theo tên hoặc fragrance
        const product = await Product.findOne({
            isActive: true,
            $or: [
                { name: new RegExp(lowerMsg, "i") },
                { fragrance: new RegExp(lowerMsg, "i") }
            ]
        });

        if (product) {
            if (lowerMsg.includes("còn hàng") || lowerMsg.includes("hết hàng") || lowerMsg.includes("bao nhiêu")) {
                reply = product.stock > 0
                    ? `Sản phẩm "${product.name}" còn ${product.stock} cái trong kho ✅`
                    : `Xin lỗi, sản phẩm "${product.name}" hiện hết hàng ❌`;
            } else if (lowerMsg.includes("giá") || lowerMsg.includes("bao nhiêu")) {
                const finalPrice = product.price - (product.price * product.discount / 100);
                if (product.discount > 0) {
                    reply = `Giá của "${product.name}" là ${finalPrice}₫ (giảm ${product.discount}%) 💰`;
                } else {
                    reply = `Giá của "${product.name}" là ${finalPrice}₫`;
                }
            } else {
                reply = `"${product.name}" là nến thơm mùi ${product.fragrance || 'đặc trưng'}, còn ${product.stock} cái trong kho.`;
            }
        } else {
            reply = "Mình chưa hiểu câu hỏi, bạn có thể nói rõ hơn? 🤔";
        }

        //  Lưu vào lịch sử chat
        let chat = await Chat.findOne({ user: userId });
        if (!chat) {
            chat = new Chat({ user: userId, messages: [] });
        }

        chat.messages.push({ from: "user", text: message });
        chat.messages.push({ from: "bot", text: reply });
        await chat.save();

        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.json({ reply: "Lỗi server, thử lại sau 😢" });
    }
};
module.exports = {
    handleChat,
};