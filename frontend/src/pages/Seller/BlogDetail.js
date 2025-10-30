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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Content */}
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
      </div>
    </motion.div>
  );
}

