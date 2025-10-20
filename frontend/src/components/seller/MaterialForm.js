import React from "react";

export default function MaterialForm({ form, onChange, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên nguyên liệu */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Tên nguyên liệu *</span>
                    <input
                        name="name"
                        placeholder="VD: Sáp ong tự nhiên"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="border p-3 rounded w-full"
                    />
                </label>

                {/* Mã SKU */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Mã SKU (duy nhất) *</span>
                    <input
                        name="sku"
                        placeholder="VD: BEEWAX-001"
                        value={form.sku}
                        onChange={onChange}
                        required
                        className="border p-3 rounded w-full"
                    />
                </label>

                {/* Đơn vị tính */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Đơn vị tính</span>
                    <input
                        name="unit"
                        placeholder="VD: gram, ml, cái (mặc định: gram)"
                        value={form.unit}
                        onChange={onChange}
                        className="border p-3 rounded w-full"
                    />
                </label>

                {/* Giá mỗi đơn vị */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Giá trên mỗi đơn vị (VND)</span>
                    <input
                        type="number"
                        name="pricePerUnit"
                        placeholder="VD: 500"
                        value={form.pricePerUnit}
                        onChange={onChange}
                        className="border p-3 rounded w-full"
                    />
                </label>

                {/* Số lượng tồn */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Số lượng tồn (theo đơn vị)</span>
                    <input
                        type="number"
                        name="stockQuantity"
                        placeholder="VD: 2000"
                        value={form.stockQuantity}
                        onChange={onChange}
                        className="border p-3 rounded w-full"
                    />
                </label>

                {/* Nhà cung cấp */}
                <label className="flex flex-col">
                    <span className="mb-1 font-medium">Nhà cung cấp</span>
                    <input
                        name="vendor"
                        placeholder="VD: HoneyFarm Co."
                        value={form.vendor}
                        onChange={onChange}
                        className="border p-3 rounded w-full"
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold"
            >
                {loading ? "Đang lưu..." : "Lưu nguyên liệu"}
            </button>
        </form>
    );
}
