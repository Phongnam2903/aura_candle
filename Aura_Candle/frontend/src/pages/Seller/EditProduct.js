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

  const API_URL = process.env.REACT_APP_API_URL;

  // Load dữ liệu
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
          fragrances: product.fragrances || [],
          oldPrice: product.oldPrice || "",
          discount: product.discount || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Không lấy được dữ liệu");
      }
    })();
  }, [id]);

  // Tự động tính giá khi có oldPrice + discount
  useEffect(() => {
    if (form?.oldPrice && form?.discount) {
      const finalPrice = Math.round(
        Number(form.oldPrice) * (1 - Number(form.discount) / 100)
      );
      setForm((prev) => ({ ...prev, price: finalPrice }));
    }
  }, [form?.oldPrice, form?.discount]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

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

      // 🧩 Thêm log để kiểm tra dữ liệu backend trả về
      console.log("🔍 Kết quả upload from edit Products:", res.data);

      // 🧩 Kiểm tra cụ thể từng link
      if (res.data.files) {
        res.data.files.forEach((url, i) => console.log(`Ảnh ${i + 1}:`, url));
      }

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
        oldImages: form.images,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        stock: Number(form.stock),
        weightGrams: Number(form.weightGrams),
        materials: (form.materials || []).filter(Boolean),
        fragrances:
          typeof form.fragrances === "string"
            ? form.fragrances.split(",").map((f) => f.trim()).filter(Boolean)
            : form.fragrances,
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

      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        ← Quay lại
      </button>

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

        {/* Mùi hương */}
        <input
          name="fragrance"
          value={form.fragrance}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Mùi hương (nếu chỉ 1)"
        />

        <input
          name="fragrances"
          value={
            Array.isArray(form.fragrances)
              ? form.fragrances.join(", ")
              : form.fragrances
          }
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Nhiều mùi hương (ngăn cách bởi dấu phẩy)"
        />

        {/* Giá gốc + Giảm giá */}
        <input
          name="oldPrice"
          type="number"
          value={form.oldPrice}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Giá gốc (VNĐ)"
        />

        <input
          name="discount"
          type="number"
          value={form.discount}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="Giảm giá (%)"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-gray-50"
          placeholder="Giá bán"
          readOnly={!!(form.oldPrice && form.discount)}
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
          {uploading && <p className="text-sm text-gray-500">Đang upload...</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, idx) => {
              const imageUrl = img.startsWith("https")
                ? img // ảnh Cloudinary
                : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${img}`; // ảnh local
              return (
                <img
                  key={idx}
                  src={imageUrl}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              );
            })}
          </div>

        </div>

        {/* Nguyên liệu */}
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
