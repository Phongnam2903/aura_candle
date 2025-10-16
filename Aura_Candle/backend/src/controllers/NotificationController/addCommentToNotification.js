const { Notification } = require("../../models");

// Thêm bình luận
const addCommentToNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text || !text.trim())
            return res.status(400).json({ ok: false, message: "Bình luận không được để trống" });

        const notification = await Notification.findById(id);
        if (!notification)
            return res.status(404).json({ ok: false, message: "Không tìm thấy thông báo" });

        const newComment = {
            user: userId,
            text: text.trim(),
        };

        notification.comments.push(newComment);
        await notification.save();

        await notification.populate("comments.user", "username avatar_url");

        res.json({ ok: true, data: notification.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
    }
};

module.exports = {
    addCommentToNotification,
};