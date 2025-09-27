import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ChangePassword() {
    const [form, setForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (form.newPass !== form.confirm) {
            toast.error("Mật khẩu mới và xác nhận không khớp!");
            return;
        }
        // Gọi API đổi mật khẩu ở đây
        toast.success("Đổi mật khẩu thành công!");
        setForm({ current: "", newPass: "", confirm: "" });
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Đổi Mật Khẩu</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
                <input
                    type="password"
                    name="current"
                    value={form.current}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                <input
                    type="password"
                    name="newPass"
                    value={form.newPass}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Xác nhận mật khẩu mới
                </label>
                <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
            >
                Đổi mật khẩu
            </button>
        </form>
    );
}
