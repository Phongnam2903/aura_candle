import React, { useState } from "react";

export default function AddAddressModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        company: "",
        address: "",
        country: "Vietnam",
        province: "",
        district: "",
        ward: "",
        zip: "",
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                <h2 className="text-xl font-bold mb-4">THÊM ĐỊA CHỈ MỚI</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Họ tên"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Công ty"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Địa chỉ"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />

                    {/* Quốc gia */}
                    <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="Vietnam">Vietnam</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Tỉnh, Quận, Phường, Mã Zip */}
                    <div className="grid grid-cols-3 gap-2">
                        <input
                            name="province"
                            value={form.province}
                            onChange={handleChange}
                            placeholder="Tỉnh/Thành"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            placeholder="Quận/Huyện"
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            name="ward"
                            value={form.ward}
                            onChange={handleChange}
                            placeholder="Phường/Xã"
                            className="border px-3 py-2 rounded"
                        />
                    </div>

                    <input
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        placeholder="Mã Zip"
                        className="w-full border px-3 py-2 rounded"
                    />

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={form.isDefault}
                            onChange={handleChange}
                        />
                        Đặt là địa chỉ mặc định?
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
