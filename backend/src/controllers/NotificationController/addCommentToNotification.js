const { Notification } = require("../../models");

// Thêm bình luận
const addCommentToNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { text, rating } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ ok: false, message: "Nội dung bình luận không được để trống" });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ ok: false, message: "Số sao phải từ 1 đến 5" });
        }

        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ ok: false, message: "Không tìm thấy thông báo" });
        }

        // Thêm bình luận mới
        const newComment = {
            user: userId,
            text,
            rating, // Lưu cả số sao
            createdAt: new Date(),
        };

        notification.comments.unshift(newComment); // Thêm đầu danh sách
        await notification.save();

        res.status(201).json({
            ok: true,
            message: "Đã thêm bình luận thành công",
            comment: newComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
    }
};

module.exports = {
    addCommentToNotification,
};