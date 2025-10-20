import React, { useState, useEffect, useCallback } from "react";
import { FaFacebookF, FaTwitter, FaPinterestP, FaStar, FaReply, FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { getProductById, getProductsByCategoryApi } from "../../api/products/productApi";
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
    const [currentImage, setCurrentImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // ==== Khai báo hàm trước useEffect ====
    const fetchComments = useCallback(async () => {
        try {
            const commentsData = await getCommentForProductApi(id);
            setComments(commentsData.comments || []);
        } catch (err) {
            console.error("Lỗi load comment:", err);
        }
    }, [id]);

    const fetchRelatedProducts = useCallback(async (category) => {
        try {
            const data = await getProductsByCategoryApi(category, product?._id);
            console.log("getProductsByCategoryApi: ", data);
            setRelatedProducts(data.slice(0, 4));
        } catch (err) {
            console.error("Lỗi load sản phẩm liên quan:", err);
        }
    }, [product]);

    // ==== Gộp 1 useEffect duy nhất ====
    useEffect(() => {
        async function fetchData() {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
                fetchComments();
                if (productData?.category) fetchRelatedProducts(productData.category);
            } catch (err) {
                console.error("Lỗi load sản phẩm:", err);
            }
        }
        fetchData();
    }, [id, fetchComments, fetchRelatedProducts]);

    if (!product) return <div className="p-6 text-center text-lg animate-pulse">Đang tải sản phẩm...</div>;

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
        addItem({ ...product, quantity, image: product.images?.[0] });
        navigate("/checkout");
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return toast.warn("Bạn cần đăng nhập để bình luận!");
        if (!newComment.trim()) return toast.error("Vui lòng nhập nội dung!");
        if (rating === 0) return toast.error("Vui lòng chọn số sao!");
        try {
            await commentForProductApi(id, newComment, rating);
            setNewComment("");
            setRating(0);
            toast.success("Đã gửi đánh giá của bạn!");
            fetchComments();
        } catch {
            toast.error("Không thể gửi đánh giá!");
        }
    };

    const handleReplySubmit = async (parentId) => {
        const token = localStorage.getItem("token");
        if (!token) return toast.warn("Bạn cần đăng nhập để bình luận!");
        if (!replyText.trim()) return toast.error("Nội dung phản hồi trống!");
        try {
            await commentForProductApi(id, replyText, 5, parentId);
            setReplyTo(null);
            setReplyText("");
            toast.success("Đã gửi phản hồi!");
            fetchComments();
        } catch {
            toast.error("Lỗi khi gửi phản hồi!");
        }
    };

    const handleLike = async (commentId) => {
        const token = localStorage.getItem("token");
        if (!token) return toast.warn("Bạn cần đăng nhập để thực hiện hành động này!");
        try {
            await toggleLikeCommentApi(commentId);
            fetchComments();
        } catch {
            toast.error("Lỗi khi like bình luận!");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        try {
            const res = await deleteCommentApi(commentId);
            if (res.ok) {
                toast.success("Đã xóa bình luận!");
                fetchComments();
            } else toast.error(res.message || "Không thể xóa bình luận");
        } catch {
            toast.error("Lỗi server khi xóa bình luận!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* ===== Breadcrumb ===== */}
                <nav className="text-gray-500 mb-6 text-sm" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li>
                            <Link to="/" className="hover:text-emerald-600 transition">Trang chủ</Link>
                        </li>
                        <li>
                            <span className="text-gray-400">/</span>
                        </li>
                        <li className="text-gray-700 font-medium">{product.name}</li>
                    </ol>
                </nav>

                {/* ==== Product Info ==== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-emerald-100">
                    <div className="relative group rounded-3xl overflow-hidden">
                        <div className="overflow-hidden rounded-3xl">
                            <img
                                src={
                                    product.images?.[currentImage]?.startsWith("https")
                                        ? product.images[currentImage]
                                        : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${product.images?.[currentImage] || ""}`
                                }
                                alt={product.name}
                                className="w-full h-auto object-cover shadow-lg transition-transform duration-500 transform group-hover:scale-110 rounded-3xl"
                            />
                        </div>

                        {/* Nút chuyển ảnh */}
                        {product.images?.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
                                >
                                    ❯
                                </button>
                            </>
                        )}

                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/30 p-1 rounded-xl">
                                {product.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img.startsWith("https") ? img : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${img}`}
                                        alt={`thumb-${idx}`}
                                        className={`w-12 h-12 object-cover rounded-lg border-2 cursor-pointer transition-transform duration-300 ${idx === currentImage ? "border-emerald-500 scale-110" : "border-transparent hover:scale-105"
                                            }`}
                                        onClick={() => setCurrentImage(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-emerald-600 text-3xl font-extrabold">{product.price?.toLocaleString("vi-VN")}₫</span>
                            {product.oldPrice && (
                                <span className="text-gray-400 line-through text-lg">{product.oldPrice.toLocaleString("vi-VN")}₫</span>
                            )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        <p className="text-gray-600 italic">{product.fragrances}</p>

                        <div>
                            <h3 className="font-medium mb-2">Số lượng:</h3>
                            <div className="flex items-center border border-emerald-200 rounded-xl w-36 overflow-hidden">
                                <button className="px-3 py-2 text-lg text-emerald-700" onClick={decrease}>−</button>
                                <input type="number" value={quantity} readOnly className="w-16 text-center outline-none bg-transparent" />
                                <button className="px-3 py-2 text-lg text-emerald-700" onClick={increase}>+</button>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button onClick={handleAddToCart} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium shadow-lg transition-all duration-300">
                                🛒 Thêm vào giỏ
                            </button>
                            <button onClick={handleBuyNow} className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-xl font-medium shadow-lg transition-all duration-300">
                                Mua ngay
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pt-3">
                            <span className="text-gray-500">Chia sẻ:</span>
                            <div className="flex gap-2 text-white">
                                <a href="https://www.facebook.com/profile.php?id=61580658016979" target="_blank" rel="noopener noreferrer" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"><FaFacebookF size={14} /></a>
                                <Link href="#" target="_blank" rel="noopener noreferrer" className="bg-sky-400 p-2 rounded-full hover:bg-sky-500 transition"><FaTwitter size={14} /></Link>
                                <Link href="#" target="_blank" rel="noopener noreferrer" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition"><FaPinterestP size={14} /></Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==== Comments Section ==== */}
                <div className="bg-white/70 backdrop-blur-md mt-10 p-8 rounded-3xl shadow-xl border border-emerald-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá & Bình luận</h2>

                    {/* Comment Form */}
                    <form onSubmit={handleSubmitComment} className="mb-6 space-y-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                    key={star}
                                    size={22}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`cursor-pointer transition ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn..."
                            className="w-full border border-emerald-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80"
                            rows="3"
                        />
                        <button type="submit" className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-md transition">
                            Gửi đánh giá
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-5">
                        {comments.map(cmt => (
                            <div key={cmt._id} className="border-b border-gray-200 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        {cmt.user?.avatar_url ? (
                                            <img src={cmt.user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full border border-emerald-200" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">{cmt.user?.name?.[0] || "?"}</div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{cmt.user?.name || "Người dùng ẩn danh"}</h4>
                                            <span className="text-sm text-gray-500">{new Date(cmt.createdAt).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleLike(cmt._id)}>
                                            {cmt.likes?.includes(currentUserId) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                                            <span className="text-sm text-gray-600">{cmt.likes?.length || 0}</span>
                                        </div>
                                        {cmt.user?._id === currentUserId && (
                                            <button onClick={() => handleDeleteComment(cmt._id)} className="text-sm text-red-500 hover:underline">Xóa</button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center mt-1 gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={16} className={i < cmt.rating ? "text-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>

                                <p className="text-gray-700 mt-2">{cmt.content}</p>

                                <button onClick={() => setReplyTo(replyTo === cmt._id ? null : cmt._id)} className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mt-2">
                                    <FaReply size={14} /> Trả lời
                                </button>

                                {replyTo === cmt._id && (
                                    <div className="ml-6 mt-3 space-y-2">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full border border-emerald-200 rounded-lg p-2"
                                            placeholder="Nhập phản hồi..."
                                            rows="2"
                                        />
                                        <button onClick={() => handleReplySubmit(cmt._id)} className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1 rounded-lg text-sm">
                                            Gửi phản hồi
                                        </button>
                                    </div>
                                )}

                                {cmt.replies?.length > 0 && (
                                    <div className="ml-8 mt-3 space-y-2 border-l border-emerald-100 pl-4">
                                        {cmt.replies.map(reply => (
                                            <div key={reply._id} className="flex items-start gap-2">
                                                {reply.user?.avatar_url ? (
                                                    <img src={reply.user.avatar_url} alt="avatar" className="w-6 h-6 rounded-full border border-emerald-200 mt-1" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs mt-1">{reply.user?.name?.[0] || "?"}</div>
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
                        {/* ==== Sản phẩm liên quan ==== */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sản phẩm liên quan</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {relatedProducts.map(rp => (
                                        <Link to={`/product/${rp._id}`} key={rp._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                                            <img
                                                src={rp.images?.[0]?.startsWith("https") ? rp.images[0] : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${rp.images?.[0]}`}
                                                alt={rp.name}
                                                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="p-3">
                                                <h3 className="text-gray-800 font-medium">{rp.name}</h3>
                                                <p className="text-emerald-600 font-bold">{rp.price?.toLocaleString("vi-VN")}₫</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
