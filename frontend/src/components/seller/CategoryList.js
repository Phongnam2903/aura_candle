import React, { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
} from "../../api/category/categoriesApi";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", image: "" });
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("❌ Lỗi lấy danh mục:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadImage(file);
            const uploadedPath = res.files?.[0] || res.path || "";
            setForm((prev) => ({ ...prev, image: uploadedPath }));
            setPreview(
                uploadedPath.startsWith("https")
                    ? uploadedPath
                    : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${uploadedPath}`
            );
        } catch (err) {
            console.error("❌ Lỗi upload ảnh:", err);
            alert("Upload ảnh thất bại!");
        } finally {
            setUploading(false);
        }
    };

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
            console.error("❌ Lỗi lưu danh mục:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (err) {
                console.error("❌ Lỗi xóa danh mục:", err);
            }
        }
    };

    const handleEdit = (cat) => {
        setForm({ name: cat.name, description: cat.description, image: cat.image });
        setPreview(cat.image);
        setEditingId(cat._id);
    };

    // Pagination logic
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
                <h1 className="text-3xl font-semibold text-pink-600 mb-6 text-center">
                    Quản lý Danh mục
                </h1>

                {/* Form thêm / sửa */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
                >
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Tên danh mục"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Mô tả"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer bg-pink-100 text-pink-700 px-3 py-2 rounded-lg hover:bg-pink-200 transition">
                                <FaImage /> Tải ảnh
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                    hidden
                                />
                            </label>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-16 w-16 object-cover rounded border"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-end">
                        <button
                            type="submit"
                            className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 transition"
                        >
                            <FaPlus />
                            {editingId ? "Cập nhật danh mục" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bảng danh mục */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <table className="w-full border-collapse">
                    <thead className="bg-pink-50 text-pink-700">
                        <tr>
                            <th className="px-4 py-3 border-b text-left">Tên</th>
                            <th className="px-4 py-3 border-b text-left">Mô tả</th>
                            <th className="px-4 py-3 border-b text-left">Hình ảnh</th>
                            <th className="px-4 py-3 border-b text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCategories.map((cat) => (
                            <tr
                                key={cat._id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 border-b">{cat.name}</td>
                                <td className="px-4 py-3 border-b">{cat.description}</td>
                                <td className="px-4 py-3 border-b">
                                    {cat.image ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="h-12 w-12 object-cover rounded border"
                                        />
                                    ) : (
                                        "Không có"
                                    )}
                                </td>
                                <td className="px-4 py-3 border-b text-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className="flex justify-center items-center gap-3 py-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                            }`}
                    >
                        Trước
                    </button>
                    <span className="text-gray-700">
                        Trang {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                            }`}
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}
