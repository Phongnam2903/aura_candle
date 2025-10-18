import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { getProductById, updateProduct } from "../../api/products/productApi";
import { getCategories } from "../../api/category/categoriesApi";
import { getMaterials } from "../../api/material/materialApi";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scentInput, setScentInput] = useState("");

  // Load dữ liệu ban đầu
  useEffect(() => {
    const loadData = async () => {
      try {
        const [product, cats, mats] = await Promise.all([
          getProductById(id),
          getCategories(),
          getMaterials(),
        ]);

        setCategories(cats);
        setMaterialsList(mats);

        // Xử lý dữ liệu sản phẩm
        const materialsValue = product.materials?.map((m) => m.material?._id || m.material).filter(Boolean) || [];

        setForm({
          ...product,
          category: product.category?._id || "",
          images: product.images || [],
          materials: materialsValue,
          fragrances: product.fragrances || [],
          oldPrice: product.oldPrice || "",
          discount: product.discount || "",
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Không lấy được dữ liệu");
      }
    };

    loadData();
  }, [id]);

  // Tính giá tự động
  useEffect(() => {
    if (form?.oldPrice && form?.discount) {
      const finalPrice = Math.round(
        Number(form.oldPrice) * (1 - Number(form.discount) / 100)
      );
      setForm((prev) => ({ ...prev, price: finalPrice }));
    }
  }, [form?.oldPrice, form?.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload ảnh mới
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

  // Thêm mùi hương
  const addScent = () => {
    if (!scentInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      fragrances: [...prev.fragrances, scentInput.trim()]
    }));
    setScentInput("");
  };

  // Xóa mùi hương
  const removeScent = (index) => {
    setForm((prev) => ({
      ...prev,
      fragrances: prev.fragrances.filter((_, i) => i !== index),
    }));
  };

  // Toggle material
  const toggleMaterial = (materialId) => {
    setForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(materialId)
        ? prev.materials.filter(id => id !== materialId)
        : [...prev.materials, materialId]
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        discount: form.discount ? Number(form.discount) : 0,
        stock: Number(form.stock),
        weightGrams: form.weightGrams ? Number(form.weightGrams) : null,
        images: form.images,
        fragrances: form.fragrances,
        materials: form.materials,
        isKit: form.isKit || false,
      };

      console.log("=== DỮ LIỆU GỬI LÊN API ===");
      console.log("Product Data:", productData);
      console.log("=============================");

      await updateProduct(id, productData);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate(`/seller/products/${id}`);
    } catch (err) {
      console.error("❌ LỖI KHI CẬP NHẬT SẢN PHẨM:", err.response?.data || err.message);
      toast.error("Lỗi khi cập nhật sản phẩm!");
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
            ✨ Chỉnh Sửa Sản Phẩm
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/40">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Tên sản phẩm */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tồn kho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tồn kho *
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Giá gốc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá gốc (VNĐ)
              </label>
              <input
                name="oldPrice"
                type="number"
                value={form.oldPrice}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Giảm giá */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm giá (%)
              </label>
              <input
                name="discount"
                type="number"
                value={form.discount}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá bán (VNĐ) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                readOnly={!!(form.oldPrice && form.discount)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none bg-gray-50"
              />
            </div>

            {/* Trọng lượng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trọng lượng (gram)
              </label>
              <input
                name="weightGrams"
                type="number"
                value={form.weightGrams}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Mô tả */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả sản phẩm
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            {/* Hình ảnh */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
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
                    {uploading ? "Đang upload..." : "Chọn ảnh mới hoặc kéo thả vào đây"}
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

            {/* Mùi hương */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mùi hương
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={scentInput}
                  onChange={(e) => setScentInput(e.target.value)}
                  placeholder="Nhập mùi hương..."
                  className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addScent())}
                />
                <button
                  type="button"
                  onClick={addScent}
                  className="px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
              </div>

              {/* Hiển thị danh sách mùi hương */}
              {form.fragrances.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.fragrances.map((scent, i) => (
                    <span
                      key={i}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {scent}
                      <button
                        type="button"
                        onClick={() => removeScent(i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Nguyên liệu */}
            {/* <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div> */}

            {/* Submit button */}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}