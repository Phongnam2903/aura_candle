import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function InfoForm() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        setForm({
            name: storedUser.name || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
        });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify({ ...storedUser, ...form }));
        toast.success("Cập nhật hồ sơ thành công!");
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Thông Tin Tài Khoản</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
            >
                Lưu thay đổi
            </button>
        </form>
    );
}
