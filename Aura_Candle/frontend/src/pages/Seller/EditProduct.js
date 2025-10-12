import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X } from "lucide-react";
import { getProductById, updateProduct } from "../../api/products/productApi";
import { getCategories } from "../../api/category/categoriesApi";
import { getMaterials } from "../../api/material/materialApi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const [product, cats, mats] = await Promise.all([
          getProductById(id),
          getCategories(),
          getMaterials(),
        ]);

        setCategories(cats);
        setMaterialsList(mats);

        const matsValue =
          product.materials
            ?.map((m) => m.material?._id || m.material)
            .filter(Boolean) || [];

        setForm({
          ...product,
          category: product.category?._id || "",
          images: product.images || [],
          materials: matsValue,
          fragrance: product.fragrance || "",
          oldPrice: product.oldPrice || "",
          discount: product.discount || "",
        });
      } catch {
        toast.error("Không lấy được dữ liệu");
      }
    })();
  }, [id]);

  useEffect(() => {
    if (form?.oldPrice && form?.discount) {
      const finalPrice = Math.round(
        Number(form.oldPrice) * (1 - Number(form.discount) / 100)
      );
      setForm((prev) => ({ ...prev, price: finalPrice }));
    }
  }, [form?.oldPrice, form?.discount]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleMaterial = (mid) => {
    setForm((prev) => {
      const exists = prev.materials.includes(mid);
      return {
        ...prev,
        materials: exists
          ? prev.materials.filter((m) => m !== mid)
          : [...prev.materials, mid],
      };
    });
  };

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.files],
      }));
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
        materials: (form.materials || []).filter(Boolean),
      };
      await updateProduct(id, payload);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate(`/seller/products/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <p className="p-6">Đang tải...</p>;

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          ✏️ Cập nhật sản phẩm
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        {/* --- Cột trái: Thông tin --- */}
        <div className="space-y-5">
          <Input name="name" value={form.name} onChange={handleChange} label="Tên sản phẩm" />
          <Input name="sku" value={form.sku} onChange={handleChange} label="Mã SKU" />
          <Select
            name="category"
            value={form.category}
            onChange={handleChange}
            label="Danh mục"
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
          />
          <TextArea name="description" value={form.description} onChange={handleChange} label="Mô tả" />
          <Input name="fragrance" value={form.fragrance} onChange={handleChange} label="Mùi hương" />

          <div className="grid grid-cols-2 gap-4">
            <Input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange} label="Giá gốc (VNĐ)" />
            <Input name="discount" type="number" value={form.discount} onChange={handleChange} label="Giảm giá (%)" />
          </div>
          <Input name="price" type="number" value={form.price} onChange={handleChange} label="Giá bán (VNĐ)" readOnly />

          <div className="grid grid-cols-2 gap-4">
            <Input name="stock" type="number" value={form.stock} onChange={handleChange} label="Tồn kho" />
            <Input name="weightGrams" type="number" value={form.weightGrams} onChange={handleChange} label="Khối lượng (gram)" />
          </div>

          <label className="flex items-center gap-2 mt-3">
            <input type="checkbox" name="isKit" checked={form.isKit} onChange={handleChange} />
            <span>Sản phẩm dạng Kit</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>

        {/* --- Cột phải: Ảnh + Nguyên liệu --- */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Ảnh sản phẩm
            </label>
            <div className="flex items-center gap-3 border-2 border-dashed rounded-xl p-4">
              <Upload size={20} className="text-gray-500" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Đang upload...</p>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              {form.images.map((img, idx) => {
                const imageUrl = img.startsWith("https")
                  ? img
                  : `${API_URL || "http://localhost:5000"}${img}`;
                return (
                  <motion.div
                    key={idx}
                    className="relative group"
                    whileHover={{ scale: 1.03 }}
                  >
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="w-28 h-28 object-cover rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Nguyên liệu
            </label>
            <div className="flex flex-wrap gap-2">
              {materialsList.map((mat) => (
                <label
                  key={mat._id}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition ${form.materials.includes(mat._id)
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={form.materials.includes(mat._id)}
                    onChange={() => toggleMaterial(mat._id)}
                    className="hidden"
                  />
                  {mat.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

/* ==== Sub-components ==== */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-600 mb-1 font-medium">{label}</label>
    <input
      {...props}
      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-600 mb-1 font-medium">{label}</label>
    <textarea
      {...props}
      className="w-full border rounded-xl p-3 h-24 focus:ring-2 focus:ring-emerald-400 outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-gray-600 mb-1 font-medium">{label}</label>
    <select
      {...props}
      className="w-full border rounded-xl p-3 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
    >
      <option value="">-- Chọn --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
