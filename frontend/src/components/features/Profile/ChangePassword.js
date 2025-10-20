// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock } from "lucide-react";
import { changePassword } from "../../../api/auth/auth";

export default function ChangePassword() {
    const [form, setForm] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });
    const [show, setShow] = useState({
        current: false,
        newPass: false,
        confirm: false,
    });

    const strongPasswordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShow = (field) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
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
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-lg p-8 transition-all">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-2">
                    <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Đổi Mật Khẩu</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Hãy bảo mật tài khoản của bạn bằng mật khẩu mạnh
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {[
                    { name: "current", label: "Mật khẩu hiện tại" },
                    { name: "newPass", label: "Mật khẩu mới" },
                    { name: "confirm", label: "Xác nhận mật khẩu mới" },
                ].map((field) => (
                    <div key={field.name} className="relative">
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            {field.label}
                        </label>
                        <input
                            type={show[field.name] ? "text" : "password"}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            className="w-full border border-emerald-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-emerald-50/30 placeholder-gray-400"
                            placeholder="Nhập mật khẩu..."
                            required
                        />
                        <button
                            type="button"
                            onClick={() => toggleShow(field.name)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-emerald-500 transition"
                        >
                            {show[field.name] ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-emerald-200"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
}
