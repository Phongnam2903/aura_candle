import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSellerBlogs, deleteBlog } from "../../api/blog/blogApi";
import { FileText, Plus, Edit3, Trash2, Eye } from "lucide-react";

export default function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const BLOGS_PER_PAGE = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getSellerBlogs();
      setBlogs(data);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      return;
    }

    try {
      await deleteBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      toast.success("Xóa bài viết thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Xóa bài viết thất bại!");
    }
  };

  // Pagination
  const indexOfLast = currentPage * BLOGS_PER_PAGE;
  const indexOfFirst = indexOfLast - BLOGS_PER_PAGE;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-pink-500" /> Quản lý Bài Viết
        </h1>
        <button
          onClick={() => navigate("/seller/blogs/create")}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Tạo Bài Viết Mới
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Chưa có bài viết nào.</p>
          <button
            onClick={() => navigate("/seller/blogs/create")}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Tạo bài viết đầu tiên
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-pink-50 text-pink-700 text-left">
                  <th className="p-4">Hình ảnh</th>
                  <th className="p-4">Tiêu đề</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-t hover:bg-pink-50 transition-all duration-200"
                  >
                    {/* Hình ảnh */}
                    <td className="p-4">
                      {blog.images && blog.images.length > 0 ? (
                        <img
                          src={blog.images[0]}
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>

                    {/* Tiêu đề */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {blog.title}
                      </div>
                    </td>

                    {/* Mô tả */}
                    <td className="p-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {blog.description || "—"}
                      </div>
                    </td>

                    {/* Ngày tạo */}
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Thao tác */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/seller/blogs/${blog._id}`)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-xs"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} /> Xem
                        </button>
                        <button
                          onClick={() => navigate(`/seller/blogs/${blog._id}/edit`)}
                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1 text-xs"
                          title="Chỉnh sửa"
                        >
                          <Edit3 size={14} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1 text-xs"
                          title="Xóa"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                }`}
              >
                ← Trước
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-pink-600 text-white"
                      : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                }`}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

