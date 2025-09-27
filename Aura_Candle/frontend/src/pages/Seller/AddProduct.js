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
    images: "",       // chứa link ảnh (có thể nhập thủ công hoặc từ upload)
    materials: "",
    isKit: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Upload file ảnh lên server
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      // gọi API upload ảnh, server cần trả về { url: 'link_ảnh' }
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;
      // thêm link mới vào chuỗi images (nếu đã có thì nối bằng dấu phẩy)
      setForm((prev) => ({
        ...prev,
        images: prev.images
          ? prev.images + "," + imageUrl
          : imageUrl,
      }));
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.sku) {
      toast.error("Vui lòng nhập tối thiểu Tên, SKU và Giá!");
      return;
    }
    setLoading(true);
    try {
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
        {/* Các input cũ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... giữ nguyên các input name, sku, category, price, stock, weightGrams ... */}
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

        {/* Input upload file */}
        <div>
          <label className="block mb-1 font-medium">Chọn ảnh từ máy</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Đang upload...</p>}
        </div>

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
