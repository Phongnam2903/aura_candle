import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
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

  // Load dữ liệu sản phẩm + danh mục + nguyên liệu
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

        // Lấy mảng id nguyên liệu và lọc bỏ giá trị rỗng
        const matsValue =
          product.materials
            ?.map((m) => m.material?._id || m.material)
            .filter(Boolean) || [];

        setForm({
          ...product,
          category: product.category?._id || "",
          images: product.images || [],
          materials: matsValue,
        });
      } catch (err) {
        console.error(err);
        toast.error("Không lấy được dữ liệu");
      }
    })();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Bật/tắt chọn nguyên liệu
  function toggleMaterial(mid) {
    setForm((prev) => {
      const exists = prev.materials.includes(mid);
      return {
        ...prev,
        materials: exists
          ? prev.materials.filter((m) => m !== mid)
          : [...prev.materials, mid],
      };
    });
  }

  // Upload nhiều ảnh mới
  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files?.length) return;

    const formData = new FormData();
    for (let f of files) formData.append("files", f);

    setUploading(true);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.files],
      }));
      toast.success("Upload ảnh thành công");
    } catch (err) {
      console.error(err);
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
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
        // lọc lại materials để chỉ gửi id hợp lệ
        materials: (form.materials || []).filter(Boolean),
      };

      await updateProduct(id, payload);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate(`/seller/products/${id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Cập Nhật Sản Phẩm</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Tên sản phẩm"
        />
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="SKU"
        />

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
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full h-24"
          placeholder="Mô tả sản phẩm"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Giá"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Tồn kho"
        />
        <input
          name="weightGrams"
          type="number"
          value={form.weightGrams}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Khối lượng (gram)"
        />

        {/* Upload ảnh */}
        <div>
          <label className="block mb-1 font-medium">Ảnh sản phẩm</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
          {uploading && (
            <p className="text-sm text-gray-500">Đang upload...</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${img}`}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Chọn nguyên liệu */}
        <div>
          <label className="block font-medium mb-2">Nguyên liệu</label>
          <div className="flex flex-wrap gap-3">
            {materialsList.map((mat) => (
              <label
                key={mat._id}
                className="flex items-center gap-1 border rounded px-2 py-1"
              >
                <input
                  type="checkbox"
                  checked={form.materials.includes(mat._id)}
                  onChange={() => toggleMaterial(mat._id)}
                />
                {mat.name}
              </label>
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
          Sản phẩm dạng Kit
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold"
        >
          {loading ? "Đang lưu..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}
