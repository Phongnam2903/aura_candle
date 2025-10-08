import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ hiệu ứng mượt
import { X } from "lucide-react"; // ✅ icon hiện đại

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
        onSave(form);
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="bg-white/95 w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-emerald-100"
                >
                    {/* Nút đóng */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-emerald-600 transition"
                    >
                        <X size={22} />
                    </button>

                    {/* Tiêu đề */}
                    <h2 className="text-2xl font-semibold text-emerald-700 text-center mb-6">
                        🌿 Thêm địa chỉ mới
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Ô nhập địa chỉ */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Địa chỉ cụ thể
                            </label>
                            <input
                                name="specificAddress"
                                value={form.specificAddress}
                                onChange={handleChange}
                                placeholder="VD: 123 Nguyễn Trãi, Thanh Xuân, Hà Nội"
                                className="w-full border border-emerald-200 focus:border-emerald-400 px-4 py-2.5 rounded-lg outline-none text-gray-800 transition"
                                required
                            />
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={form.isDefault}
                                onChange={handleChange}
                                className="w-4 h-4 accent-emerald-600 cursor-pointer"
                            />
                            <span>Đặt làm địa chỉ mặc định</span>
                        </label>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-600"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition"
                            >
                                Lưu địa chỉ
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
