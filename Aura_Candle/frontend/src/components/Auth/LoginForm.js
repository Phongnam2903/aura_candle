import React, { useState } from "react";
import { loginUser } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function validate() {
        if (!form.email.trim()) return "Vui lòng nhập email.";
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(form.email)) return "Email không hợp lệ.";
        if (!form.password) return "Vui lòng nhập mật khẩu.";
        if (form.password.length < 6) return "Mật khẩu phải ít nhất 6 ký tự.";
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const error = validate();
        if (error) {
            setMessage(error);
            return;
        }
        setMessage("");
        setLoading(true);

        try {
            const data = await loginUser(form);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success(`Xin chào ${data.user.name}!`);
            switch (data.user.role) {
                case "admin":
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center from-[#F9F5F1] to-[#EDE3DB] px-4 py-10">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-10 border border-[#E5D8CC]">
                {/* Tiêu đề */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-gray-800">Đăng nhập</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Chào mừng bạn quay trở lại với <span className="font-medium">Aura Candle</span>
                    </p>
                </div>

                {message && (
                    <p className="text-center mb-4 text-sm text-red-500 bg-red-50 py-2 rounded-md">
                        {message}
                    </p>
                )}

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="relative">
                        <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-3.5 text-gray-500 hover:text-[#B58D73]"
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Nút submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-medium transition-all ${loading
                            ? "bg-[#B58D73]/70 cursor-not-allowed"
                            : "bg-[#B58D73] hover:bg-[#9F7B60]"
                            }`}
                    >
                        {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                    </button>
                </form>

                {/* Links phụ */}
                <div className="flex justify-between mt-6 text-sm text-gray-600">
                    <a href="/forgotpassword" className="hover:text-[#B58D73] transition">
                        Quên mật khẩu?
                    </a>
                    <a href="/register" className="hover:text-[#B58D73] transition">
                        Đăng ký ngay
                    </a>
                </div>
            </div>
        </div>
    );
}
