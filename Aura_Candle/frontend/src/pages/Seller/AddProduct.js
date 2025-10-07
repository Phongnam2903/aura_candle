import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/category/categoriesApi";
import { getMaterials } from "../../api/material/materialApi";
import { createProducts } from "../../api/products/productApi";

export default function AddProduct() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",        // giá cuối (sẽ auto tính nếu có oldPrice + discount)
    oldPrice: "",     // giá gốc
    discount: "",     // % giảm
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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        toast.error("Không thể tải danh mục / nguyên liệu / mùi hương");
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files || !files.length) return;

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🧩 Thêm log để kiểm tra dữ liệu backend trả về
      console.log("🔍 Kết quả upload:", res.data);

      // 🧩 Kiểm tra cụ thể từng link
      if (res.data.files) {
        res.data.files.forEach((url, i) => console.log(`Ảnh ${i + 1}:`, url));
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.files],
      }));
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error("❌ Lỗi upload ảnh:", err.response?.data || err.message);
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }


  // thêm mùi hương
  function addScent() {
    if (!scentInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      scents: [...prev.scents, scentInput.trim()],
    }));
    setScentInput("");
  }

  // xóa mùi hương
  function removeScent(index) {
    setForm((prev) => ({
      ...prev,
      scents: prev.scents.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.sku || (!form.price && !form.oldPrice)) {
      toast.error("Vui lòng nhập Tên, SKU và Giá!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
      };
      await createProducts(payload);
      toast.success("Tạo sản phẩm thành công!");
      setForm({
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
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi tạo sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm Sản Phẩm Mới</h1>
        {/*nút Back */}
        <button
          onClick={() => navigate("/seller/products")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />
        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        {/* chọn danh mục */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full h-24"
        />
        {/* Giá gốc */}
        <input
          name="oldPrice"
          type="number"
          placeholder="Giá gốc (VNĐ)"
          value={form.oldPrice}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        {/* % giảm */}
        <input
          name="discount"
          type="number"
          placeholder="Giảm giá (%)"
          value={form.discount}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        {/* Giá cuối */}
        <input
          name="price"
          type="number"
          placeholder="Giá bán (tự động tính nếu có giảm giá)"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-gray-50"
          readOnly={!!(form.oldPrice && form.discount)} // nếu có oldPrice + discount thì khóa
        />
        <input
          name="stock"
          type="number"
          placeholder="Tồn kho"
          value={form.stock}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />
        <input
          name="weightGrams"
          type="number"
          placeholder="Trọng lượng (gram)"
          value={form.weightGrams}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        {/* upload ảnh */}
        <div>
          <label className="block mb-1 font-medium">
            Chọn ảnh (có thể nhiều)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Đang upload...</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, idx) => (
              <img
                key={idx}
                src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${img}`}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* chọn nhiều nguyên liệu */}
        <div>
          <label className="block mb-1 font-medium">Chọn nguyên liệu</label>
          <Select
            isMulti
            options={materials.map((m) => ({ value: m._id, label: m.name }))}
            value={materials
              .filter((m) => form.materials.includes(m._id))
              .map((m) => ({ value: m._id, label: m.name }))}
            onChange={(selected) =>
              setForm((prev) => ({
                ...prev,
                materials: selected.map((s) => s.value),
              }))
            }
          />
        </div>

        {/* nhập tay nhiều mùi hương */}
        <div>
          <label className="block mb-1 font-medium">Mùi hương</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={scentInput}
              onChange={(e) => setScentInput(e.target.value)}
              placeholder="Nhập mùi hương..."
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={addScent}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.scents.map((s, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeScent(idx)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isKit"
            checked={form.isKit}
            onChange={handleChange}
          />
          Sản phẩm dạng Kit?
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold"
        >
          {loading ? "Đang lưu..." : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
}
