import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import { getBlogById, updateBlog } from "../../api/blog/blogApi";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await getBlogById(id);
        setForm({
          title: blog.title || "",
          description: blog.description || "",
          content: blog.content || "",
          images: blog.images || [],
          link: blog.link || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải bài viết!");
        navigate("/seller/blogs");
      }
    };

    loadBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload ảnh
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let file of files) {
        formData.append("files", file);
      }

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.files],
      }));
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  // Xóa ảnh
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBlog(id, form);
      toast.success("Cập nhật bài viết thành công!");
      navigate("/seller/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ✨ Chỉnh Sửa Bài Viết
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tiêu đề */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Mô tả ngắn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Mô tả ngắn gọn về bài viết..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Nội dung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={8}
                placeholder="Viết nội dung bài viết của bạn..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Link tham chiếu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link tham chiếu (tùy chọn)
              </label>
              <input
                name="link"
                type="url"
                value={form.link}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Hình ảnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    {uploading
                      ? "Đang upload..."
                      : "Chọn ảnh mới hoặc kéo thả vào đây"}
                  </span>
                </label>
              </div>

              {/* Hiển thị ảnh hiện tại */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.startsWith("https") ? img : `${API_URL}${img}`}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Đang cập nhật..." : "Cập Nhật Bài Viết"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

