const { Notification } = require("../../models");



const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // lấy từ middleware verifyToken

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }) // mới nhất lên đầu
            .limit(10); // lấy 10 cái gần nhất, có thể tùy chỉnh

        res.status(200).json({
            ok: true,
            data: notifications,
        });
    } catch (err) {
        console.error("Get notifications error:", err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
        res.json({ ok: true, message: "Đã đánh dấu tất cả là đã đọc" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getNotifications,
    markAsRead,
};