// controllers/chatController.js
const Product = require("../../models/Product");
const Chat = require("../../models/Chat");

const handleChat = async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "Bạn là chuyên gia tư vấn nến thơm. Hãy trả lời thân thiện, ngắn gọn và có emoji.",
                    },
                    { role: "user", content: message },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const botReply = response.data.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Lỗi gọi OpenAI:", error.message);
        res.status(500).json({ error: "Chatbot đang bận, thử lại sau nhé 😅" });
    }
};
module.exports = {
    handleChat,
};