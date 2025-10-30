import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Trash2, Calendar, User, Link as LinkIcon } from "lucide-react";
import { getBlogById, deleteBlog } from "../../api/blog/blogApi";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải bài viết!");
        navigate("/seller/blogs");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      return;
    }

    try {
      await deleteBlog(id);
      toast.success("Xóa bài viết thành công!");
      navigate("/seller/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Xóa bài viết thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy bài viết</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 p-6"
    >
      {/* Header - Full width */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/seller/blogs/${id}/edit`)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Layout 3 cột: Banner trái - Content - Banner phải */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* BANNER TRÁI */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-6 space-y-4">
            
            {/* Thông tin tác giả */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-white/40"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-pink-500" />
                Tác giả
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  {blog.author?.name || "Ẩn danh"}
                </p>
                {blog.author?.email && (
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                )}
              </div>
            </motion.div>

            {/* Thống kê */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold mb-3">📊 Thống kê</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Lượt xem</span>
                  <span className="font-bold text-lg">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Lượt thích</span>
                  <span className="font-bold text-lg">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Chia sẻ</span>
                  <span className="font-bold text-lg">0</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-white/40"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">⚡ Hành động</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate(`/seller/blogs/${id}/edit`)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  🖨️ In bài viết
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                >
                  📋 Copy Link
                </button>
              </div>
            </motion.div>

          </div>
        </aside>

        {/* CONTENT CHÍNH */}
        <main className="col-span-12 lg:col-span-6">
          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/40">
          {/* Tiêu đề */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {blog.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.author?.name || "Ẩn danh"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            {blog.link && (
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link tham khảo</span>
              </a>
            )}
          </div>

          {/* Mô tả */}
          {blog.description && (
            <div className="mb-6">
              <p className="text-lg text-gray-700 italic">
                {blog.description}
              </p>
            </div>
          )}

          {/* Hình ảnh */}
          {blog.images && blog.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith("https") ? img : `${API_URL}${img}`}
                    alt={`${blog.title} - ${idx + 1}`}
                    className="w-full rounded-xl shadow-lg object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nội dung */}
          {blog.content && (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {blog.content}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              Cập nhật lần cuối:{" "}
              {new Date(blog.updatedAt).toLocaleString("vi-VN")}
            </p>
          </div>
          </div>
        </main>

        {/* BANNER PHẢI */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-6 space-y-4">
            
            {/* Thông tin bài viết */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-white/40"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Chi tiết
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Ngày tạo</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Cập nhật</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(blog.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Trạng thái</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Đã xuất bản
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold mb-3">🏷️ Danh mục</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  Blog
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  Nến thơm
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                  Kiến thức
                </span>
              </div>
            </motion.div>

            {/* Share Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-white/40"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">🔗 Chia sẻ</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                  📘 Facebook
                </button>
                <button className="px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition text-xs">
                  🐦 Twitter
                </button>
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
                  📌 Pinterest
                </button>
                <button className="px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-xs">
                  📷 Instagram
                </button>
              </div>
            </motion.div>

            {/* Bài viết liên quan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-5 border border-white/40"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">📚 Liên quan</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium">
                    5 cách chọn nến thơm phù hợp
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 ngày trước</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium">
                    Lợi ích của nến thơm
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 ngày trước</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-700 hover:text-pink-600 cursor-pointer font-medium">
                    Hướng dẫn bảo quản nến
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 tuần trước</p>
                </div>
              </div>
            </motion.div>

          </div>
        </aside>

      </div>
    </motion.div>
  );
}

