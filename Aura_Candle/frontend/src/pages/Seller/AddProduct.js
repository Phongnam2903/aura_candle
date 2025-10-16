import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/category/categoriesApi";
import { createProducts } from "../../api/products/productApi";
import { Loader2 } from "lucide-react";

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
    scents: [],
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

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

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
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const addScent = () => {
    if (!scentInput.trim()) return;
    setForm((prev) => ({ ...prev, scents: [...prev.scents, scentInput.trim()] }));
    setScentInput("");
  };

  const removeScent = (index) => {
    setForm((prev) => ({
      ...prev,
      scents: prev.scents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Thêm scentInput còn tồn tại trước khi submit
    const scentsToSend = [...form.scents];
    if (scentInput.trim()) scentsToSend.push(scentInput.trim());

    // ✅ Debug dữ liệu trước khi gửi
    console.log("=== DỮ LIỆU SẴN SÀNG GỬI LÊN API ===");
    console.log("name:", form.name);
    console.log("sku:", form.sku);
    console.log("category:", form.category);
    console.log("description:", form.description);
    console.log("price:", Number(form.price));
    console.log("oldPrice:", form.oldPrice);
    console.log("discount:", form.discount);
    console.log("stock:", Number(form.stock));
    console.log("weightGrams:", Number(form.weightGrams));
    console.log("images:", form.images);
    console.log("fragrances:", scentsToSend);
    console.log("===============================");

    try {
      await createProducts({
        ...form,
        fragrances: scentsToSend,
        price: Number(form.price),
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
      });
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
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none col-span-2"
          />
          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="stock"
            type="number"
            placeholder="Tồn kho"
            value={form.stock}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <input
            name="oldPrice"
            type="number"
            placeholder="Giá gốc (VNĐ)"
            value={form.oldPrice}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <input
            name="discount"
            type="number"
            placeholder="Giảm giá (%)"
            value={form.discount}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <input
            name="price"
            type="number"
            placeholder="Giá bán"
            value={form.price}
            onChange={handleChange}
            readOnly={!!(form.oldPrice && form.discount)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none bg-gray-50"
          />
          <input
            name="weightGrams"
            type="number"
            placeholder="Trọng lượng (gram)"
            value={form.weightGrams}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
          />
          <textarea
            name="description"
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={handleChange}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none col-span-2"
            rows={3}
          />

          {/* Hình ảnh */}
          <div className="col-span-2">
            <label className="font-medium">Hình ảnh</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full border rounded-xl p-2 mt-2"
            />
            <div className="flex flex-wrap gap-3 mt-3">
              {form.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith("https") ? img : `${API_URL}${img}`}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-xl shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Mùi hương */}
          <div className="col-span-2">
            <label className="font-medium">Mùi hương</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={scentInput}
                onChange={(e) => setScentInput(e.target.value)}
                placeholder="Nhập mùi hương..."
                className="border rounded-xl p-2 flex-1"
              />
              <button
                type="button"
                onClick={addScent}
                className="px-4 bg-pink-500 text-white rounded-xl hover:bg-pink-600"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.scents.map((s, i) => (
                <span
                  key={i}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeScent(i)}
                    className="ml-2 text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 flex items-center justify-center gap-2 mt-4"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Đang lưu..." : "Hoàn tất"}
          </button>
        </form>
      </div>
    </div>
  );
}
