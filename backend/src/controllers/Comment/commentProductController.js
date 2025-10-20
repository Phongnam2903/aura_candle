const Comment = require("../../models/Comment");
const Product = require("../../models/Product");
const Notification = require("../../models/Notification"); 

// Thêm bình luận hoặc phản hồi
const addCommentToProduct = async (req, res) => {
    try {
        const { id } = req.params; // ID sản phẩm
        const { content, rating, parentComment } = req.body; // parentComment để phản hồi

        if (!content || !content.trim()) {
            return res.status(400).json({ ok: false, message: "Nội dung bình luận không được để trống" });
        }

        if (!parentComment && (!rating || rating < 1 || rating > 5)) {
            return res.status(400).json({ ok: false, message: "Số sao phải nằm trong khoảng 1 - 5" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ ok: false, message: "Không tìm thấy sản phẩm" });
        }

        const newComment = new Comment({
            user: req.user.id,
            product: id,
            content: content.trim(),
            rating: parentComment ? undefined : rating,
            parentComment: parentComment || null,
        });

        await newComment.save();

        // Gửi thông báo nếu là phản hồi
        if (parentComment) {
            const parent = await Comment.findById(parentComment).populate("user");
            if (parent && parent.user._id.toString() !== req.user.id.toString()) {
                await Notification.create({
                    user: parent.user._id,
                    title: "Phản hồi mới",
                    message: `${req.user.name} đã phản hồi bình luận của bạn.`,
                    link: `/product/${id}`,
                });
            }
        }

        res.json({
            ok: true,
            message: parentComment ? "Đã phản hồi bình luận" : "Đã thêm bình luận mới",
            comment: newComment,
        });
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};

// Lấy danh sách bình luận (bao gồm phản hồi)
const getCommentsByProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({ product: id })
            .populate("user", "name email")
            .populate({
                path: "parentComment",
                populate: { path: "user", select: "name email" },
            })
            .sort({ createdAt: -1 });

        // Tính trung bình số sao
        const avgRating =
            comments.filter(c => !c.parentComment).length > 0
                ? (
                    comments
                        .filter(c => !c.parentComment)
                        .reduce((sum, c) => sum + c.rating, 0) /
                    comments.filter(c => !c.parentComment).length
                ).toFixed(1)
                : 0;

        res.json({ ok: true, avgRating, totalComments: comments.length, comments });
    } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};

// Thả tim hoặc bỏ tim
const toggleLikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ ok: false, message: "Không tìm thấy bình luận" });

        const index = comment.likes.indexOf(userId);
        if (index === -1) {
            comment.likes.push(userId);

            // Gửi thông báo nếu người khác thả tim bình luận của mình
            if (comment.user.toString() !== userId) {
                await Notification.create({
                    user: comment.user,
                    title: "Thả tim bình luận",
                    message: `${req.user.name} đã thả tim bình luận của bạn.`,
                    link: `/product/${comment.product}`,
                });
            }
        } else {
            comment.likes.splice(index, 1);
        }

        await comment.save();

        res.json({ ok: true, liked: index === -1, totalLikes: comment.likes.length });
    } catch (error) {
        console.error("Lỗi khi thả tim:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};

// Thu hồi (xóa) bình luận
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ ok: false, message: "Không tìm thấy bình luận" });

        if (comment.user.toString() !== userId)
            return res.status(403).json({ ok: false, message: "Bạn không có quyền xóa bình luận này" });

        await Comment.findByIdAndDelete(commentId);
        await Comment.deleteMany({ parentComment: commentId }); // Xóa luôn phản hồi con

        res.json({ ok: true, message: "Đã thu hồi bình luận" });
    } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};

module.exports = {
    addCommentToProduct,
    getCommentsByProduct,
    toggleLikeComment,
    deleteComment,
};
