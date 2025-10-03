import React, { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../../api/auth/auth";

export default function ChangePassword() {
    const [form, setForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPass !== form.confirm) {
            toast.error("Mật khẩu mới và xác nhận không khớp!");
            return;
        }

        if (!strongPasswordRegex.test(form.newPass)) {
            toast.error(
                "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
            );
            return;
        }
        try {
            const res = await changePassword({
                currentPassword: form.current,
                newPassword: form.newPass,
                confirmPassword: form.confirm,
            });

            toast.success(res.message || "Đổi mật khẩu thành công!");
            setForm({ current: "", newPass: "", confirm: "" });
        } catch (err) {
            const msg =
                err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.";
            toast.error(msg);
        }
    };

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
