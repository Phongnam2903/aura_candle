import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products/productApi";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3 } from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
                Đang tải sản phẩm...
            </div>
        );
    if (!product)
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
                Không tìm thấy sản phẩm
            </div>
        );

    return (
        <motion.div
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
                    >
                        <ArrowLeft size={18} />
                        Quay lại
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {product.name}
                    </h1>
                </div>

                <Link
                    to={`/seller/products/${product._id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full hover:opacity-90 transition"
                >
                    <Edit3 size={18} /> Chỉnh sửa
                </Link>
            </div>

            {/* Nội dung chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Ảnh sản phẩm */}
                <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    {product.images?.length ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full rounded-2xl shadow-md object-cover aspect-square"
                        />
                    ) : (
                        <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400">
                            Không có ảnh
                        </div>
                    )}
                </motion.div>

                {/* Thông tin sản phẩm */}
                <div className="space-y-4 text-gray-700">
                    <InfoRow label="Mã SKU" value={product.sku || "Không có"} />
                    <InfoRow label="Danh mục" value={product.category?.name || "Không có"} />
                    <InfoRow
                        label="Giá"
                        value={`${product.price?.toLocaleString() || 0} ₫`}
                        highlight
                    />
                    <InfoRow label="Mùi hương" value={product.fragrances || "Không có"} />
                    <InfoRow label="Tồn kho" value={product.stock} />
                    <InfoRow label="Khối lượng" value={`${product.weightGrams} g`} />
                    <InfoRow
                        label="Chất liệu"
                        value={
                            product.materials?.length
                                ? product.materials.map((m) => m.name || m).join(", ")
                                : "Không có"
                        }
                    />
                    <InfoRow
                        label="Mô tả"
                        value={product.description || "Không có mô tả"}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ✅ Component con tái sử dụng để hiển thị từng dòng thông tin
function InfoRow({ label, value, highlight = false }) {
    return (
        <div className="flex justify-between border-b py-2">
            <span className="font-medium text-gray-600">{label}:</span>
            <span
                className={`text-right ${highlight ? "text-emerald-600 font-semibold" : "text-gray-800"
                    }`}
            >
                {value}
            </span>
        </div>
    );
}
