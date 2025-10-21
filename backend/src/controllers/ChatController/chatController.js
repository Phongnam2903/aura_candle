const axios = require("axios");

/**
 * Xử lý chat giữa người dùng và chatbot
 */
const handleChat = async (req, res) => {
    const { message } = req.body;

    // Kiểm tra đầu vào
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    let retries = 3; // Thử lại 3 lần nếu bị lỗi 429
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (retries > 0) {
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
            return res.json({ reply: botReply });
        } catch (error) {
            // Nếu lỗi 429 (rate limit) → chờ rồi thử lại
            if (error.response && error.response.status === 429) {
                console.warn("⚠️ OpenAI quá tải - đợi 3 giây rồi thử lại...");
                retries--;
                await delay(3000);
            } else {
                console.error("❌ Lỗi gọi OpenAI:", error.message);
                console.error("Chi tiết:", error.response?.data || error);
                return res
                    .status(500)
                    .json({ error: "Chatbot đang bận, thử lại sau nhé 😅" });
            }
        }
    }

    // Nếu thử 3 lần vẫn lỗi 429
    res.status(429).json({
        error: "OpenAI đang quá tải, vui lòng thử lại sau vài phút 😭",
    });
};

module.exports = {
    handleChat,
};
