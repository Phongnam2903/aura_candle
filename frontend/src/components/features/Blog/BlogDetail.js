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
      {/* Back button - Full width */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
      </div>

      {/* Layout 3 cột: Banner trái - Content - Banner phải */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* BANNER TRÁI - Ảnh dọc */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            {/* Banner 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="/assets/banner-left-1.jpg"
                alt="Aura Candle Banner"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/551340641_122103587211021933_793663485288630761_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=fEw7OHT-DoYQ7kNvwGnNXtP&_nc_oc=Adm5dz5CFIll3__hGAVrDTMc52zwa5QSaVMdAiUdGcAon4J4KOvwqVFpVTda9hI2N2nkiUjmy3Ty2vnQv7boQZHf&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=DxF7wC0tvb22p9UbRJLiLA&oh=00_AfdG81OCaJM84td_11eEXIxghdwejFVA0UyA6IFA_Etlpw&oe=69091A88";
                }}
              />
            </motion.div>

            {/* Banner 2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="/assets/banner-left-2.jpg"
                alt="Aura Candle Promotion"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&h=600&fit=crop";
                }}
              />
            </motion.div>
          </div>
        </aside>

        {/* CONTENT CHÍNH */}
        <main className="col-span-12 lg:col-span-8">
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
        </main>

        {/* BANNER PHẢI - Ảnh dọc */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            {/* Banner 1 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="/assets/banner-right-1.jpg"
                alt="Aura Candle Collection"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://tse1.mm.bing.net/th/id/OIP.78XIC2-A21SV-X19cuovxQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3";
                }}
              />
            </motion.div>

            {/* Banner 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="/assets/banner-right-2.jpg"
                alt="Aura Candle Gift Set"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/556111488_122105103435021933_1479981218133558293_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=PHneG6AMYlMQ7kNvwH0CWex&_nc_oc=AdkR8F2b36o0Gk29oUAjzLw_qKYmtfM-JPxun1odZYXDZ20orpMS4Mf3OtAi-7ZM7OFQpYgWLHeoyBuL51YbPL4W&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=yT1rIlQ0R60hQM-p8hDbHA&oh=00_AfftWxkH6fs3z2wULjmPIAEEZRrtA53ndjrqD_-kbvQ_3w&oe=6908F2F6";
                }}
              />
            </motion.div>

            {/* Banner 3 - Optional */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img
                src="/assets/banner-right-3.jpg"
                alt="Aura Candle Special Offer"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://scontent-hkg4-2.xx.fbcdn.net/v/t39.30808-6/556151879_122105101803021933_7483914076982512051_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dAwoSBv0p2wQ7kNvwH6U_sm&_nc_oc=AdmNRiPE23jfzWb2aZFcj1T9OvYilzyaNqJufmzbD5DhIo49JLdPL2th-WJc_Gjb5X0fO_QNPR5MgS2Ar1wUUfQM&_nc_zt=23&_nc_ht=scontent-hkg4-2.xx&_nc_gid=4Uk4q2OHQX_2EixBGrGgVA&oh=00_AfeMeqT4gTOaKSJ7DmT5QVVbbkssTfR4xJ8hrLt6aWNmqw&oe=6908E999";
                }}
              />
            </motion.div>
          </div>
        </aside>

      </div>
    </motion.div>
  );
}

