import React, { useState } from "react";
import { loginUser } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await loginUser(form);
            // lưu token vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success(`Xin chào ${data.user.name}!`);
            switch (data.user.role) {
                case "admmin":
                    navigate("/admin/dashboard");
                    break;
                case "seller":
                    navigate("/seller/dashboard");
                    break;
                default:
                    navigate("/");
                    break;
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Sai email hoặc mật khẩu");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">

            <div className="flex justify-center gap-4 mb-8 text-xl font-semibold">
                <span className="text-black border-b-2 border-black pb-1">Đăng nhập</span>
            </div>
            {message && (
                <p className="text-center mt-4 text-sm text-red-500">{message}</p>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Vui lòng nhập email của bạn"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Vui lòng nhập mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
                >
                    ĐĂNG NHẬP
                </button>
            </form>

            <div className="flex justify-between mt-4 text-sm">
                <a href="/forgotpassword" className="text-pink-500 hover:underline">
                    Quên mật khẩu?
                </a>
                <a href="/register" className="text-pink-500 hover:underline">
                    Đăng ký ngay
                </a>
            </div>
        </div>
    );
}
