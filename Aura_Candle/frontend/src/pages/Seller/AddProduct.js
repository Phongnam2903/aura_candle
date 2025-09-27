import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    weightGrams: "",
    images: "",       
    materials: "",
    isKit: false,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // validation cơ bản
    if (!form.name || !form.price || !form.sku) {
      toast.error("Vui lòng nhập tối thiểu Tên, SKU và Giá!");
      return;
    }
    setLoading(true);
    try {
      // tách images thành mảng
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
        images: form.images
          ? form.images.split(",").map((url) => url.trim())
          : [],
        materials: form.materials
          ? form.materials.split(",").map((m) => m.trim())
          : [],
      };

      await axios.post("/api/products", payload);
      toast.success("Tạo sản phẩm thành công!");
      // reset form
      setForm({
        name: "",
        sku: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        weightGrams: "",
        images: "",
        materials: "",
        isKit: false,
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
      <h1 className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
          <input
            name="sku"
            placeholder="Mã SKU"
            value={form.sku}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
          <input
            name="category"
            placeholder="Danh mục"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
          <input
            name="price"
            type="number"
            placeholder="Giá (VNĐ)"
            value={form.price}
            onChange={handleChange}
            className="border p-3 rounded w-full"
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
            placeholder="Khối lượng (grams)"
            value={form.weightGrams}
            onChange={handleChange}
            className="border p-3 rounded w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Mô tả sản phẩm"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full h-28"
        />

        <input
          name="images"
          placeholder="Link hình ảnh (cách nhau dấu phẩy)"
          value={form.images}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <input
          name="materials"
          placeholder="Chất liệu (cách nhau dấu phẩy)"
          value={form.materials}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

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
