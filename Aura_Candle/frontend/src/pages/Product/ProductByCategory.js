import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../../api/products/productApi";


const ProductByCategory = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProductsByCategory(slug);
                console.log(data);
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [slug]);

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 capitalize">
                Danh mục: {slug.replace("-", " ")}
            </h1>

            {products.length === 0 ? (
                <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <Link
                            key={p._id}
                            to={`/product/${p._id}`}
                            className="bg-white rounded-lg shadow hover:shadow-lg p-3 transition"
                        >
                            <img
                                src={
                                    p.images?.[0]?.startsWith("https")
                                        ? p.images[0]
                                        : `http://localhost:5000${p.images?.[0] || ""}`
                                }
                                alt={p.name}
                                className="rounded-lg w-full h-48 object-cover mb-3"
                            />
                            <h2 className="font-medium text-gray-800 truncate">{p.name}</h2>
                            <p className="text-pink-600 font-bold">
                                {p.price.toLocaleString()}₫
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductByCategory;
