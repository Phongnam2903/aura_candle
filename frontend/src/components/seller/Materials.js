import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMaterial, getMaterials } from "../../api/material/materialApi";


export default function MaterialsPage() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchMaterials() {
        try {
            const data = await getMaterials();
            setMaterials(data);
        } catch (err) {
            toast.error("Không thể tải danh sách nguyên liệu");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Bạn chắc chắn muốn xóa nguyên liệu này?")) return;
        try {
            await deleteMaterial(id);
            toast.success("Đã xóa nguyên liệu");
            setMaterials((prev) => prev.filter((m) => m._id !== id));
        } catch {
            toast.error("Lỗi khi xóa");
        }
    }

    useEffect(() => {
        fetchMaterials();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Nguyên liệu</h1>
                <Link
                    to="/seller/materials/new"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                >
                    + Thêm nguyên liệu
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Tên</th>
                            <th className="border px-3 py-2">SKU</th>
                            <th className="border px-3 py-2">Đơn vị</th>
                            <th className="border px-3 py-2">Giá/đv (VNĐ)</th>
                            <th className="border px-3 py-2">Tồn kho</th>
                            <th className="border px-3 py-2">Nhà cung cấp</th>
                            <th className="border px-3 py-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((m) => (
                            <tr key={m._id}>
                                <td className="border px-3 py-2">{m.name}</td>
                                <td className="border px-3 py-2">{m.sku}</td>
                                <td className="border px-3 py-2">{m.unit}</td>
                                <td className="border px-3 py-2">{m.pricePerUnit}</td>
                                <td className="border px-3 py-2">{m.stockQuantity}</td>
                                <td className="border px-3 py-2">{m.vendor}</td>
                                <td className="border px-3 py-2 space-x-2">
                                    <Link
                                        to={`/seller/materials/${m._id}/edit`}
                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
