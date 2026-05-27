import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../../api/products/productApi";
import { getCategories } from "../../api/category/categoriesApi";
import CONFIG from "../../config";

export default function ProductByCategory() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    // Bộ lọc
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("latest");
    const [priceRange, setPriceRange] = useState([0, 2000000]);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);

                // Lấy tên danh mục hiện tại
                const currentCategory = data.find((c) => c.slug === slug);
                setCategoryName(currentCategory ? currentCategory.name : "");
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
        fetchCategories();
    }, [slug]);

    // Lọc + sắp xếp
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchTerm) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result = result.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
        if (sortOption === "latest") result = result.reverse();

        return result;
    }, [products, searchTerm, sortOption, priceRange]);

    // Reset về trang 1 khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption, priceRange]);

    // Tính toán sản phẩm hiển thị trên trang hiện tại
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
            {/* Sidebar danh mục */}
            <aside className="md:w-1/4 bg-white rounded-2xl shadow-lg p-5 h-fit border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                {/* Tiêu đề với animation gradient */}
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2C2420] to-[#5D4037] mb-5 border-b-2 border-gray-200 pb-3 animate-fade-in">
                    Danh mục
                </h3>

                {/* Danh sách danh mục */}
                <ul className="space-y-3">
                    {categories.map((c, index) => (
                        <li
                            key={c._id}
                            className="animate-slide-up opacity-0"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <button
                                onClick={() => navigate(`/product/category/${c.slug}`)}
                                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm ${c.slug === slug
                                    ? "bg-gradient-to-r from-[#2C2420] to-[#4B3A32] text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-[#2C2420]"
                                    }`}
                            >
                                {/* Icon danh mục */}
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${c.slug === slug ? "bg-white" : "bg-[#2C2420]/40"
                                        }`}
                                ></span>
                                {c.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Nội dung chính */}
            <main className="flex-1">
                {/* 🔹 Tiêu đề danh mục */}
                <h1 className="text-2xl md:text-3xl font-semibold text-[#2C2420] mb-6">
                    {categoryName
                        ? `Sản phẩm thuộc danh mục: ${categoryName}`
                        : "Danh mục sản phẩm"}
                </h1>

                {/* Bộ lọc */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-[#2C2420] outline-none"
                    />

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-40 focus:ring-2 focus:ring-[#2C2420] outline-none"
                    >
                        <option value="latest">Mới nhất</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                    </select>

                    <div className="w-full md:w-80">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khoảng giá
                        </label>
                        <div className="relative flex flex-col gap-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{priceRange[0].toLocaleString()}₫</span>
                                <span>{priceRange[1].toLocaleString()}₫</span>
                            </div>
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
                                        setPriceRange([
                                            Math.min(+e.target.value, priceRange[1] - 10000),
                                            priceRange[1],
                                        ])
                                    }
                                    className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2C2420] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer pointer-events-auto"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="2000000"
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Math.max(+e.target.value, priceRange[0] + 10000),
                                        ])
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
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {currentProducts.map((p) => (
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
                                                    : `${CONFIG.API_URL}${p.images?.[0] || ""}`
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

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#2C2420] border border-gray-300 hover:bg-gray-50"}`}
                                >
                                    Trang trước
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition ${currentPage === i + 1 ? "bg-[#2C2420] text-white" : "bg-white text-[#2C2420] border border-gray-300 hover:bg-gray-50"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-[#2C2420] border border-gray-300 hover:bg-gray-50"}`}
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
