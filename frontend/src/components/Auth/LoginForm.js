import React, { useState } from "react";
import { loginUser } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

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
            // Sử dụng login từ AuthContext
            login(data.user, data.token);
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
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-[#E5D8CC]">
                {/* Tiêu đề */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-gray-800 tracking-wide">Đăng nhập</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Chào mừng bạn quay trở lại với <span className="font-medium text-[#B58D73]">Aura Candle</span>
                    </p>
                </div>

                {message && (
                    <p className="text-center mb-4 text-sm text-red-600 bg-red-50 py-2 rounded-lg animate-pulse">
                        {message}
                    </p>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-3.5 text-gray-400 transition-all" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-3.5 text-gray-400 transition-all" />
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-12 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-3.5 text-gray-500 hover:text-[#B58D73] transition-transform duration-200 hover:scale-110"
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all ${loading
                            ? "bg-[#B58D73]/70 cursor-not-allowed"
                            : "bg-[#B58D73] hover:bg-[#9F7B60] hover:scale-105"
                            }`}
                    >
                        {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                    </button>
                </form>

                <div className="flex justify-between mt-6 text-sm text-gray-600">
                    <a href="/forgotpassword" className="hover:text-[#B58D73] transition-colors duration-300">
                        Quên mật khẩu?
                    </a>
                    <a href="/register" className="hover:text-[#B58D73] transition-colors duration-300">
                        Đăng ký ngay
                    </a>
                </div>
            </div>
        </div>
    );
}
