import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../../api/products/productApi";

export default function ProductByCategory() {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Bộ lọc
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("latest");
    const [priceRange, setPriceRange] = useState([0, 2000000]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProductsByCategory(slug);
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [slug]);

    // Lọc + sắp xếp
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Tìm kiếm theo tên
        if (searchTerm) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo giá
        result = result.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // Sắp xếp
        if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
        if (sortOption === "latest") result = result.reverse(); // giả định sản phẩm mới ở cuối

        return result;
    }, [products, searchTerm, sortOption, priceRange]);

    if (loading)
        return (
            <div className="max-w-6xl mx-auto p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-gray-100 rounded-2xl h-72"
                    ></div>
                ))}
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Bộ lọc */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                {/* Ô tìm kiếm */}
                <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-[#2C2420] outline-none"
                />

                {/* Sắp xếp */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-40 focus:ring-2 focus:ring-[#2C2420] outline-none"
                >
                    <option value="latest">Mới nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                </select>

                {/* Lọc giá */}
                <div className="w-full md:w-80">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khoảng giá
                    </label>

                    <div className="relative flex flex-col gap-3">
                        {/* Hiển thị giá hiện tại */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{priceRange[0].toLocaleString()}₫</span>
                            <span>{priceRange[1].toLocaleString()}₫</span>
                        </div>

                        {/* Thanh range kép */}
                        <div className="relative h-1 bg-gray-300 rounded-full">
                            <div
                                className="absolute h-1 bg-[#2C2420] rounded-full"
                                style={{
                                    left: `${(priceRange[0] / 2000000) * 100}%`,
                                    right: `${100 - (priceRange[1] / 2000000) * 100}%`,
                                }}
                            ></div>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                value={priceRange[0]}
                                onChange={(e) =>
                                    setPriceRange([Math.min(+e.target.value, priceRange[1] - 10000), priceRange[1]])
                                }
                                className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2C2420] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer pointer-events-auto"
                            />
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0] + 10000)])
                                }
                                className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2C2420] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer pointer-events-auto"
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Danh sách sản phẩm */}
            {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center">
                    Không có sản phẩm nào phù hợp với bộ lọc.
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((p) => (
                        <Link
                            key={p._id}
                            to={`/product/${p._id}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={
                                        p.images?.[0]?.startsWith("https")
                                            ? p.images[0]
                                            : `http://localhost:5000${p.images?.[0] || ""}`
                                    }
                                    alt={p.name}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-4">
                                <h2 className="font-medium text-gray-800 group-hover:text-[#2C2420] truncate text-lg">
                                    {p.name}
                                </h2>
                                <p className="text-pink-600 font-semibold mt-1 text-base">
                                    {p.price.toLocaleString()}₫
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <span className="bg-[#2C2420] text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Xem chi tiết
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
