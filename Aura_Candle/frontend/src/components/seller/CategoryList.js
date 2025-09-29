import React, { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
} from "../../api/category/categoriesApi";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", image: "" });
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Lỗi lấy danh mục", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Upload ảnh
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadImage(file);
            const uploadedPath = res.files[0]; // backend trả về mảng
            setForm((prev) => ({ ...prev, image: uploadedPath }));
            setPreview(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${uploadedPath}`);
        } catch (err) {
            console.error("Lỗi upload ảnh", err);
            alert("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    // Thêm hoặc cập nhật danh mục
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                description: form.description,
                image: form.image,
            };

            if (editingId) {
                await updateCategory(editingId, payload);
            } else {
                await createCategory(payload);
            }

            setForm({ name: "", description: "", image: "" });
            setPreview(null);
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            console.error("Lỗi lưu danh mục", err);
        }
    };

    // Xóa danh mục
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (err) {
                console.error("Lỗi xóa danh mục", err);
            }
        }
    };

    // Chỉnh sửa
    const handleEdit = (cat) => {
        setForm({ name: cat.name, description: cat.description, image: cat.image });
        setPreview(cat.image ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${cat.image}` : null);
        setEditingId(cat._id);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="mb-6 p-4 border rounded shadow space-y-4 bg-white"
            >
                <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Mô tả"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />

                {/* Upload ảnh */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {preview && (
                    <img src={preview} alt="Preview" className="h-20 mt-2 border rounded" />
                )}

                <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                    {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
            </form>

            {/* Bảng danh mục */}
            <table className="w-full border-collapse border text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-3 py-2">Tên</th>
                        <th className="border px-3 py-2">Mô tả</th>
                        <th className="border px-3 py-2">Hình ảnh</th>
                        <th className="border px-3 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id}>
                            <td className="border px-3 py-2">{cat.name}</td>
                            <td className="border px-3 py-2">{cat.description}</td>
                            <td className="border px-3 py-2">
                                {cat.image ? (
                                    <img
                                        src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${cat.image}`}
                                        alt={cat.name}
                                        className="h-12"
                                    />
                                ) : (
                                    "Không có"
                                )}
                            </td>
                            <td className="border px-3 py-2 space-x-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
