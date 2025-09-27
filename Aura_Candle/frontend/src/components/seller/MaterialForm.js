import React from "react";

export default function MaterialForm({ form, onChange, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    name="name"
                    placeholder="Tên nguyên liệu"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="border p-3 rounded w-full"
                />
                <input
                    name="sku"
                    placeholder="Mã SKU"
                    value={form.sku}
                    onChange={onChange}
                    required
                    className="border p-3 rounded w-full"
                />
                <input
                    name="unit"
                    placeholder="Đơn vị (vd: gram, ml)"
                    value={form.unit}
                    onChange={onChange}
                    className="border p-3 rounded w-full"
                />
                <input
                    type="number"
                    name="pricePerUnit"
                    placeholder="Giá/đv"
                    value={form.pricePerUnit}
                    onChange={onChange}
                    className="border p-3 rounded w-full"
                />
                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Số lượng tồn"
                    value={form.stockQuantity}
                    onChange={onChange}
                    className="border p-3 rounded w-full"
                />
                <input
                    name="vendor"
                    placeholder="Nhà cung cấp"
                    value={form.vendor}
                    onChange={onChange}
                    className="border p-3 rounded w-full"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold"
            >
                {loading ? "Đang lưu..." : "Lưu"}
            </button>
        </form>
    );
}
