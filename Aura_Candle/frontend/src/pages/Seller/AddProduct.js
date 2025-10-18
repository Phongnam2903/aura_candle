import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/category/categoriesApi";
import { createProducts } from "../../api/products/productApi";
import { Loader2, Upload, X, Plus } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    stock: "",
    weightGrams: "",
    images: [],
    fragrances: [],
  });

  const [categories, setCategories] = useState([]);
  const [scentInput, setScentInput] = useState("");

  // Tính giá tự động khi có oldPrice + discount
  useEffect(() => {
    if (form.oldPrice && form.discount) {
      const finalPrice = Math.round(
        Number(form.oldPrice) * (1 - Number(form.discount) / 100)
      );
      setForm((prev) => ({ ...prev, price: finalPrice }));
    }
  }, [form.oldPrice, form.discount]);

  // Lấy danh mục từ API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh mục!");
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload ảnh lên Cloudinary
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
  console.log("Đã thêm mùi:", scentInput);

  // Xóa mùi hương
  const removeScent = (index) => {
    setForm((prev) => ({
      ...prev,
      fragrances: prev.fragrances.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên API
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
        materials: [],
        isKit: false,
      };

      console.log("=== DỮ LIỆU GỬI LÊN API ===");
      console.log("Product Data:", productData);
      console.log("=============================");

      await createProducts(productData);
      toast.success("Tạo sản phẩm thành công!");
      navigate("/seller/products");
    } catch (err) {
      console.error("❌ LỖI KHI TẠO SẢN PHẨM:", err.response?.data || err.message);
      toast.error("Lỗi khi tạo sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl w-full max-w-5xl p-8 border border-white/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ✨ Thêm Sản Phẩm Mới
          </h1>
          <button
            onClick={() => navigate("/seller/products")}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
          >
            ← Quay lại
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Tên sản phẩm */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              name="name"
              placeholder="Nhập tên sản phẩm"
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
              placeholder="Nhập SKU"
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
              placeholder="Nhập số lượng"
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
              placeholder="Nhập giá gốc"
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
              placeholder="Nhập % giảm giá"
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
              placeholder="Nhập giá bán"
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
              placeholder="Nhập trọng lượng"
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
              placeholder="Nhập mô tả sản phẩm"
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
                  {uploading ? "Đang upload..." : "Chọn ảnh hoặc kéo thả vào đây"}
                </span>
              </label>
            </div>

            {/* Hiển thị ảnh đã upload */}
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
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addScent())}
                placeholder="Nhập mùi hương..."
                className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
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

            {form.fragrances?.length > 0 && (
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

          {/* Submit button */}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Đang lưu..." : "Hoàn tất"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}