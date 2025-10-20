const { Notification } = require("../../models");

// Thả / bỏ tim
const toggleLikeNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findById(id);
        if (!notification)
            return res.status(404).json({ ok: false, message: "Không tìm thấy thông báo" });

        const hasLiked = notification.likes.includes(userId);

        if (hasLiked) {
            // Bỏ tim
            notification.likes = notification.likes.filter(
                (uid) => uid.toString() !== userId
            );
        } else {
            // Thả tim
            notification.likes.push(userId);
        }

        await notification.save();
        res.json({
            ok: true,
            liked: !hasLiked,
            likesCount: notification.likes.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
    }
};

module.exports = {
    toggleLikeNotification,
};