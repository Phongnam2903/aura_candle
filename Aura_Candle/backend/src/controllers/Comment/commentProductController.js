const Comment = require("../../models/Comment");
const Product = require("../../models/Product");


// Thêm bình luận và đánh giá sao
const addCommentToProduct = async (req, res) => {
    try {
        const { id } = req.params; // id sản phẩm
        const { content, rating } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ ok: false, message: "Nội dung bình luận không được để trống" });
        }

        if (!rating || rating < 1 || rating > 5) {
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
            rating,
        });

        await newComment.save();

        res.json({
            ok: true,
            message: "Đã thêm bình luận và đánh giá",
            comment: newComment,
        });
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};

// Lấy danh sách bình luận theo sản phẩm
const getCommentsByProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({ product: id })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        //  Tính trung bình số sao
        const avgRating =
            comments.length > 0
                ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
                : 0;

        res.json({ ok: true, avgRating, totalComments: comments.length, comments });
    } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        res.status(500).json({ ok: false, message: "Lỗi server" });
    }
};


module.exports = {
    addCommentToProduct,
    getCommentsByProduct,
};