import React, { useState } from "react";

export default function AddAddressModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        specificAddress: "",
        isDefault: false,
    });

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form); // gửi về parent
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <h2 className="text-xl font-bold mb-4">THÊM ĐỊA CHỈ MỚI</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nhập địa chỉ */}
                    <input
                        name="specificAddress"
                        value={form.specificAddress}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ cụ thể"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

                    {/* Checkbox đặt mặc định */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={form.isDefault}
                            onChange={handleChange}
                        />
                        Đặt làm địa chỉ mặc định
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                            Thêm địa chỉ
                        </button>
                    </div>
                </form>

                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
