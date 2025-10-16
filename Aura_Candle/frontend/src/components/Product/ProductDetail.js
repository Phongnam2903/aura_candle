import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaPinterestP, FaStar, FaReply, FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { getProductById } from "../../api/products/productApi";
import { commentForProductApi, deleteCommentApi, getCommentForProductApi, toggleLikeCommentApi } from "../../api/comment/commentApi";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

    useEffect(() => {
        async function fetchData() {
            try {
                const productData = await getProductById(id);
                setProduct(productData);

                const commentsData = await getCommentForProductApi(id);
                setComments(commentsData.comments || []);
            } catch (err) {
                console.error("Lỗi load dữ liệu:", err);
            }
        }
        fetchData();
    }, [id]);

    if (!product) return <div className="p-6 text-center">Đang tải sản phẩm...</div>;

    const increase = () => setQuantity((q) => q + 1);
    const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        addItem({ ...product, quantity, image: product.images?.[0] });
        toast.success("🕯️ Đã thêm vào giỏ hàng!");
    };

    const handleBuyNow = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warn("Vui lòng đăng nhập trước khi mua hàng!");
            navigate("/login");
            return;
        }
        addItem({ ...product, quantity });
        navigate("/checkout");
    };

    // Gửi bình luận mới
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return toast.warn("Bạn cần đăng nhập để bình luận!");

        if (!newComment.trim()) return toast.error("Vui lòng nhập nội dung!");
        if (rating === 0) return toast.error("Vui lòng chọn số sao!");

        try {
            const res = await commentForProductApi(id, newComment, rating);
            setComments([res.comment, ...comments]);
            setNewComment("");
            setRating(0);
            toast.success("Đã gửi đánh giá của bạn!");
        } catch (err) {
            toast.error("Không thể gửi đánh giá!");
        }
    };

    // Gửi phản hồi
    const handleReplySubmit = async (parentId) => {
        if (!replyText.trim()) return toast.error("Nội dung phản hồi trống!");
        try {
            const res = await commentForProductApi(id, replyText, 5, parentId);
            setComments((prev) =>
                prev.map((c) =>
                    c._id === parentId ? { ...c, replies: [res.comment, ...(c.replies || [])] } : c
                )
            );
            setReplyTo(null);
            setReplyText("");
            toast.success("Đã gửi phản hồi!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi gửi phản hồi!");
        }
    };

    // Thả / bỏ tim
    const handleLike = async (commentId) => {
        try {
            const res = await toggleLikeCommentApi(commentId);
            console.log(res);
            setComments((prev) =>
                prev.map((c) => (c._id === commentId ? { ...c, likes: res.likes } : c))
            );
        } catch (err) {
            console.error("Lỗi like:", err);
        }
    };

    //Delete
    const handleDeleteComment = async (commentId) => {
        console.log(commentId);
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa bình luận này?");
        if (!confirmDelete) return;

        try {
            const res = await deleteCommentApi(commentId);
            if (res.ok) {
                setComments(comments.filter((c) => c._id !== commentId));
                toast.success("Đã xóa bình luận!");
            } else {
                toast.error(res.message || "Không thể xóa bình luận");
            }
        } catch (err) {
            console.error("Lỗi khi xóa bình luận:", err);
            toast.error("Lỗi server khi xóa bình luận!");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* ==== Image + Info ==== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-emerald-100">
                    {/* Ảnh */}
                    <div className="relative group">
                        <img
                            src={
                                product.images?.[0]?.startsWith("https")
                                    ? product.images[0]
                                    : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${product.images?.[0] || ""}`
                            }
                            alt={product.name}
                            className="rounded-3xl w-full h-auto object-cover shadow-lg transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Thông tin */}
                    <div className="space-y-5">
                        <h1 className="text-3xl font-semibold text-gray-800 leading-snug">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-emerald-600 text-3xl font-bold">
                                {product.price?.toLocaleString("vi-VN")}đ
                            </span>
                            {product.oldPrice && (
                                <span className="text-gray-400 line-through text-lg">
                                    {product.oldPrice.toLocaleString("vi-VN")}đ
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{product.description}</p>

                        {/* Số lượng */}
                        <div>
                            <h3 className="font-medium mb-2">Số lượng:</h3>
                            <div className="flex items-center border border-emerald-200 rounded-xl w-36 overflow-hidden">
                                <button className="px-3 py-2 text-lg text-emerald-700" onClick={decrease}>
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="w-16 text-center outline-none bg-transparent"
                                />
                                <button className="px-3 py-2 text-lg text-emerald-700" onClick={increase}>
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                🛒 Thêm vào giỏ
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Mua ngay
                            </button>
                        </div>

                        {/* Chia sẻ */}
                        <div className="flex items-center gap-3 pt-3">
                            <span className="text-gray-500">Chia sẻ:</span>
                            <div className="flex gap-2 text-white">
                                <Link to="https://www.facebook.com/profile.php?id=61580658016979" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700">
                                    <FaFacebookF size={14} />
                                </Link>
                                <Link to="#" className="bg-sky-400 p-2 rounded-full hover:bg-sky-500">
                                    <FaTwitter size={14} />
                                </Link>
                                <Link to="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700">
                                    <FaPinterestP size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==== Bình luận ==== */}
                <div className="bg-white/80 backdrop-blur-md mt-10 p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-emerald-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá & Bình luận</h2>

                    {/* Form bình luận */}
                    <form onSubmit={handleSubmitComment} className="mb-6">
                        <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={22}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`cursor-pointer transition ${(hoverRating || rating) >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn..."
                            className="w-full border border-emerald-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/70"
                            rows="3"
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-md transition"
                        >
                            Gửi đánh giá
                        </button>
                    </form>

                    {/* Danh sách bình luận */}
                    <div className="space-y-5">
                        {comments.map((cmt) => (
                            <div key={cmt._id} className="border-b border-gray-200 pb-4">
                                {/* 🧩 Phần đầu: Avatar + thông tin + like + xóa */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {/* 🧩 Avatar người bình luận */}
                                        {cmt.user?.avatar_url ? (
                                            <img
                                                src={cmt.user.avatar_url}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full border border-emerald-200"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                                                {cmt.user?.name?.[0] || "?"}
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {cmt.user?.name || "Người dùng ẩn danh"}
                                            </h4>
                                            <span className="text-sm text-gray-500">
                                                {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 🧩 Like + Xóa */}
                                    <div className="flex items-center gap-3">
                                        {/* Nút like */}
                                        <div
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleLike(cmt._id)}
                                        >
                                            {cmt.likes?.includes(currentUserId) ? (
                                                <FaHeart className="text-red-500" />
                                            ) : (
                                                <FaRegHeart className="text-gray-400" />
                                            )}
                                            <span className="text-sm text-gray-600">
                                                {cmt.likes?.length || 0}
                                            </span>
                                        </div>

                                        {/* 🧩 Nút xóa (chỉ hiển thị với chủ comment) */}
                                        {cmt.user?._id === currentUserId && (
                                            <button
                                                onClick={() => handleDeleteComment(cmt._id)}
                                                className="text-sm text-red-500 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Rating (số sao) */}
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            size={16}
                                            className={i < cmt.rating ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>

                                {/* Nội dung bình luận */}
                                <p className="text-gray-700 mt-2">{cmt.content}</p>

                                {/* Nút phản hồi */}
                                <button
                                    onClick={() => setReplyTo(replyTo === cmt._id ? null : cmt._id)}
                                    className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mt-2"
                                >
                                    <FaReply size={14} /> Trả lời
                                </button>

                                {/* Form phản hồi */}
                                {replyTo === cmt._id && (
                                    <div className="ml-6 mt-3">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full border border-emerald-200 rounded-lg p-2"
                                            placeholder="Nhập phản hồi..."
                                            rows="2"
                                        ></textarea>
                                        <button
                                            onClick={() => handleReplySubmit(cmt._id)}
                                            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg text-sm"
                                        >
                                            Gửi phản hồi
                                        </button>
                                    </div>
                                )}

                                {/* Danh sách phản hồi */}
                                {cmt.replies?.length > 0 && (
                                    <div className="ml-8 mt-3 space-y-2 border-l border-emerald-100 pl-4">
                                        {cmt.replies.map((reply) => (
                                            <div key={reply._id} className="flex items-start gap-2">
                                                {/* 🧩 Avatar người phản hồi */}
                                                {reply.user?.avatar_url ? (
                                                    <img
                                                        src={reply.user.avatar_url}
                                                        alt="avatar"
                                                        className="w-6 h-6 rounded-full border border-emerald-200 mt-1"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs mt-1">
                                                        {reply.user?.name?.[0] || "?"}
                                                    </div>
                                                )}

                                                <div>
                                                    <h5 className="font-medium text-gray-700">{reply.user?.name}</h5>
                                                    <p className="text-gray-600 text-sm">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
