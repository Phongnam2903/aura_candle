// src/pages/products/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products/productApi";

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

    if (loading) return <p className="p-6">Đang tải...</p>;
    if (!product) return <p className="p-6">Không tìm thấy sản phẩm</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {/* ✅ Nút Quay lại */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                </div>

                <Link
                    to={`/seller/products/${product._id}/edit`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                >
                    Chỉnh sửa
                </Link>
            </div>

            {/* Nội dung chi tiết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ảnh sản phẩm */}
                <div>
                    {product.images?.length ? (
                        <img
                            src={`http://localhost:5000${product.images[0]}`}
                            alt={product.name}
                            className="w-full rounded"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                            Không có ảnh
                        </div>
                    )}
                </div>

                {/* Thông tin */}
                <div className="space-y-3">
                    <p><strong>Mã SKU:</strong> {product.sku}</p>
                    <p><strong>Danh mục:</strong> {product.category?.name || "Không có"}</p>
                    <p><strong>Giá:</strong> {product.price?.toLocaleString()} đ</p>
                    <p><strong>Tồn kho:</strong> {product.stock}</p>
                    <p><strong>Khối lượng:</strong> {product.weightGrams} g</p>
                    <p>
                        <strong>Chất liệu:</strong>{" "}
                        {product.materials && product.materials.length > 0
                            ? product.materials.map((m) => m.name || m).join(", ")
                            : "Không có"}
                    </p>
                    <p><strong>Mô tả:</strong> {product.description}</p>
                </div>
            </div>
        </div>
    );
}
