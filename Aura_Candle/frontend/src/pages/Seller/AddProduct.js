import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/category/categoriesApi";
import { getMaterials } from "../../api/material/materialApi";
import { createProducts } from "../../api/products/productApi";
import { Loader2 } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1);
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
    isKit: false,
    materials: [],
    scents: [],
  });

  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [scentInput, setScentInput] = useState("");

  useEffect(() => {
    if (form.oldPrice && form.discount) {
      const finalPrice = Math.round(
        Number(form.oldPrice) * (1 - Number(form.discount) / 100)
      );
      setForm((prev) => ({ ...prev, price: finalPrice }));
    }
  }, [form.oldPrice, form.discount]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, mats] = await Promise.all([
          getCategories(),
          getMaterials(),
        ]);
        setCategories(cats);
        setMaterials(mats);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh mục / nguyên liệu!");
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    setForm((prev) => ({
      ...prev,
      scents: [...prev.scents, scentInput.trim()],
    }));
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
    try {
      await createProducts({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
      });
      toast.success("Tạo sản phẩm thành công!");
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl w-full max-w-5xl p-8 border border-white/40"
      >
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

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold transition-all ${
                  step === n ? "bg-pink-500 scale-110" : "bg-gray-300"
                }`}
              >
                {n}
              </div>
              {n < 3 && <div className="w-12 h-[2px] bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 grid md:grid-cols-2 gap-6"
            >
              <input
                name="name"
                placeholder="Tên sản phẩm"
                value={form.name}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
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
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 grid md:grid-cols-2 gap-6"
            >
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
                className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none bg-gray-50"
                readOnly={!!(form.oldPrice && form.discount)}
              />
              <input
                name="weightGrams"
                type="number"
                placeholder="Trọng lượng (gram)"
                value={form.weightGrams}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 space-y-4"
            >
              <div>
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
                      src={
                        img.startsWith("https")
                          ? img
                          : `${API_URL}${img}`
                      }
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  ))}
                </div>
              </div>
              <div>
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
            </motion.div>
          )}
        </form>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              ← Quay lại
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
            >
              Tiếp tục →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Đang lưu..." : "Hoàn tất"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
