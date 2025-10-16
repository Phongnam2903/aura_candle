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

const getNotificationDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({ _id: id, user: userId })
            .populate({
                path: "relatedOrder",
                populate: {
                    path: "items.product",
                    select: "name price images",
                },
            })
            .populate("comments.user", "username avatar_url");

        if (!notification)
            return res.status(404).json({ ok: false, message: "Không tìm thấy thông báo" });

        if (!notification.isRead) {
            notification.isRead = true;
            await notification.save();
        }

        res.json({ ok: true, data: notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
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

// Đánh dấu 1 thông báo là đã đọc
const markAsReadSingle = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id thông báo
        const userId = req.user.id; // Lấy id user từ token

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ ok: false, message: "Không tìm thấy thông báo" });
        }

        res.json({ ok: true, notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
};


module.exports = {
    getNotifications,
    getNotificationDetail,
    markAsRead,
    markAsReadSingle,
};