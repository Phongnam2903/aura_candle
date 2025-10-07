import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaPinterestP } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { getProductById } from "../../api/products/productApi";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // gọi API lấy sản phẩm theo id
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Lỗi load sản phẩm:", err);
            }
        }
        fetchData();
    }, [id]);
    if (!product) {
        return <div className="p-6">Không tìm thấy sản phẩm</div>;
    }

    const increase = () => setQuantity((prev) => prev + 1);
    const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    //  hàm thêm giỏ hàng
    const handleAddToCart = () => {
        addItem({
            ...product,
            quantity,
            image: product.image || (product.images ? `http://localhost:5000${product.images[0]}` : ""),
        });
        toast.success("🛒 Đã thêm vào giỏ hàng!");
    };

    //  hàm mua ngay
    const handleBuyNow = () => {
        addItem({
            ...product,
            quantity,
            image:
                product.image ||
                (product.images
                    ? product.images[0].startsWith("https")
                        ? product.images[0]
                        : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${product.images[0]}`
                    : ""),

        });
        navigate("/checkout");
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top: Image + Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow">
                    {/* ==== Image gallery ==== */}
                    <div>
                        <div className="relative">
                            <img
                                src={
                                    product.images?.[0]?.startsWith("https")
                                        ? product.images[0]
                                        : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${product.images?.[0] || ""}`
                                }
                                alt={product.name}
                                className="rounded-lg w-full object-cover"
                            />

                            {/* <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white">
                                ‹
                            </button>
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white">
                                ›
                            </button> */}
                        </div>

                        {/* thumbnails */}
                        {/* <div className="flex gap-3 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={product[`img${i}`]}
                                    alt="thumb"
                                    className="w-20 h-20 object-cover rounded-lg border hover:border-emerald-500 cursor-pointer"
                                />
                            ))}
                        </div> */}
                    </div>

                    {/* ==== Product info ==== */}
                    <div className="space-y-5">
                        <h1 className="text-2xl font-bold text-gray-800 leading-snug">
                            {product.name}
                        </h1>

                        {/* Giá */}
                        <div className="flex items-center gap-3">
                            {/* Giá hiện tại */}
                            <span className="text-red-600 text-3xl font-bold">
                                {product.price
                                    ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    : "0"}đ
                            </span>

                            {/* Chỉ render oldPrice nếu tồn tại */}
                            {product.oldPrice && (
                                <span className="text-gray-400 line-through text-lg">
                                    {product.oldPrice
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                                </span>
                            )}

                            {/* Chỉ render discount nếu có */}
                            {product.discount && (
                                <span className="text-white bg-red-500 text-sm font-semibold px-2 py-1 rounded">
                                    {product.discount}
                                </span>
                            )}
                        </div>


                        {/* Mùi hương / Tiêu đề */}
                        <div>
                            <h3 className="font-medium mb-2">Tiêu đề:</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="border rounded-lg px-4 py-2 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                >
                                    {product.fragrance}
                                </button>

                            </div>
                        </div>

                        {/* Mã khuyến mãi */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">Mã khuyến mãi</h3>
                                <button className="text-pink-600 text-sm hover:underline">
                                    Xem tất cả
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {["Giảm 5k", "Giảm 50k", "Giảm 30k"].map((code) => (
                                    <span
                                        key={code}
                                        className="border border-pink-400 text-pink-500 px-4 py-1 rounded-md text-sm font-medium"
                                    >
                                        {code}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Số lượng */}
                        <div>
                            <h3 className="font-medium mb-2">Số lượng:</h3>
                            <div className="flex items-center border rounded-lg w-32">
                                <button className="px-3 py-2" onClick={decrease}>-</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    min={1}
                                    className="w-16 text-center outline-none"
                                />
                                <button className="px-3 py-2" onClick={increase}>+</button>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex gap-4">
                            {/*  thêm onClick */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold"
                            >
                                THÊM VÀO GIỎ
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
                            >
                                MUA NGAY
                            </button>
                        </div>

                        {/* Chia sẻ */}
                        <div className="flex items-center gap-3 pt-3">
                            <span className="text-gray-500">Chia sẻ:</span>
                            <div className="flex gap-2 text-white">
                                <Link
                                    href="#"
                                    className="bg-blue-600 p-2 rounded-full hover:bg-blue-700"
                                >
                                    <FaFacebookF size={14} />
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-sky-400 p-2 rounded-full hover:bg-sky-500"
                                >
                                    <FaTwitter size={14} />
                                </Link>
                                <Link
                                    href="#"
                                    className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                                >
                                    <FaPinterestP size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white mt-10 p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold mb-3">Mô tả sản phẩm</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* Related products */}
                {/* <div className="mt-12">
                    <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition"
                            >
                                <img
                                    src="https://via.placeholder.com/200x200"
                                    alt="related"
                                    className="rounded-lg mb-2 w-full"
                                />
                                <p className="text-sm font-medium text-gray-800">
                                    Sản phẩm {i + 1}
                                </p>
                                <p className="text-emerald-600 font-semibold">199.000đ</p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Recently viewed */}
                {/* <div className="mt-12">
                    <h2 className="text-xl font-bold mb-4">Sản phẩm đã xem</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition"
                            >
                                <img
                                    src="https://via.placeholder.com/200x200"
                                    alt="viewed"
                                    className="rounded-lg mb-2 w-full"
                                />
                                <p className="text-sm font-medium text-gray-800">
                                    Sản phẩm {i + 1}
                                </p>
                                <p className="text-emerald-600 font-semibold">199.000đ</p>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ProductDetail;
