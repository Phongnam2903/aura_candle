import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../../api/blog/blogApi";
import { ArrowLeft, Calendar, User, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

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
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy bài viết</p>
          <button
            onClick={() => navigate("/blog")}
            className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Blog content */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Featured image */}
          {blog.images && blog.images.length > 0 && (
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <img
                src={
                  blog.images[0].startsWith("https")
                    ? blog.images[0]
                    : `${API_URL}${blog.images[0]}`
                }
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Title */}
            <h1 className="font-serif text-3xl lg:text-5xl font-light text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author?.name || "Aura Candle"}</span>
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
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Link tham khảo</span>
                </a>
              )}
            </div>

            {/* Description */}
            {blog.description && (
              <div className="mb-8">
                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Additional images */}
            {blog.images && blog.images.length > 1 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("https") ? img : `${API_URL}${img}`}
                      alt={`${blog.title} - ${idx + 2}`}
                      className="w-full rounded-xl shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {blog.content && (
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {blog.content}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <button
                onClick={() => navigate("/blog")}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition"
              >
                Xem thêm bài viết khác
              </button>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
}

