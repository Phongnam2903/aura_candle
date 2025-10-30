import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../../../api/blog/blogApi";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const BLOGS_PER_PAGE = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Lỗi khi fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Pagination
  const indexOfLast = currentPage * BLOGS_PER_PAGE;
  const indexOfFirst = indexOfLast - BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

  const API_URL = process.env.REACT_APP_API_URL;

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 items-start">
        {/* --------- Main Content --------- */}
        <div className="space-y-10">
          <h1 className="text-4xl font-semibold mb-6 text-emerald-800 tracking-wide">
            Tin tức & Cảm hứng hương thơm
          </h1>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có bài viết nào.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link to={`/blog/${blog._id}`} className="block">
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            blog.images && blog.images.length > 0
                              ? blog.images[0].startsWith("https")
                                ? blog.images[0]
                                : `${API_URL}${blog.images[0]}`
                              : "/placeholder.svg"
                          }
                          alt={blog.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="p-5">
                        <h2 className="text-lg font-semibold text-emerald-700 mb-1 group-hover:text-emerald-600 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {blog.description || blog.content?.substring(0, 150) + "..."}
                        </p>
                        <div className="mt-3">
                          <span className="text-sm text-emerald-600 font-medium group-hover:underline">
                            Đọc thêm →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 border text-sm rounded-lg shadow-sm transition-all ${
                        currentPage === p
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* --------- Sidebar --------- */}
        <aside className="space-y-8">
          <div className="bg-white shadow-sm rounded-2xl p-5 border border-emerald-100">
            <h3 className="font-semibold mb-3 text-emerald-800 text-lg">
              Sản phẩm nổi bật
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Nến thơm Luxury
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Tinh dầu thiên nhiên
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Bộ quà tặng cao cấp
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-5 border border-emerald-100">
            <h3 className="font-semibold mb-3 text-emerald-800 text-lg">
              Danh mục bài viết
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Tin tức
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Decor & Lifestyle
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Blog chia sẻ hương thơm
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-100 to-white rounded-2xl p-6 text-center shadow-sm border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 text-lg mb-2">
              Hương thơm của bạn là gì?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Khám phá bộ sưu tập nến thơm dành riêng cho không gian sống của bạn.
            </p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Khám phá ngay
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
