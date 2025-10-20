import React, { useState } from "react";
import { registerUser } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterForm() {
    const [form, setForm] = useState({
        name: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function validate() {
        if (!form.name.trim()) return "Vui lòng nhập họ và tên.";
        if (!form.gender) return "Vui lòng chọn giới tính.";
        if (!form.phone.trim()) return "Vui lòng nhập số điện thoại.";
        if (!/^\d{9,11}$/.test(form.phone))
            return "Số điện thoại chỉ gồm số và từ 9–11 ký tự.";
        if (!form.email.trim()) return "Vui lòng nhập email.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
            return "Email không hợp lệ.";
        if (!form.password) return "Vui lòng nhập mật khẩu.";
        if (form.password.length < 6)
            return "Mật khẩu phải ít nhất 6 ký tự.";
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
            await registerUser(form);
            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-[#E5D8CC]">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-gray-800 tracking-wide">Đăng ký</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tạo tài khoản để bắt đầu trải nghiệm cùng{" "}
                        <span className="font-medium text-[#B58D73]">Aura Candle</span>
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
                        <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={form.gender === "female"}
                                onChange={handleChange}
                                className="accent-[#B58D73] w-4 h-4"
                            />
                            Nữ
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={form.gender === "male"}
                                onChange={handleChange}
                                className="accent-[#B58D73] w-4 h-4"
                            />
                            Nam
                        </label>
                    </div>

                    <div className="relative">
                        <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#B58D73] focus:border-transparent placeholder-gray-400 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all ${loading
                            ? "bg-[#B58D73]/70 cursor-not-allowed"
                            : "bg-[#B58D73] hover:bg-[#9F7B60] hover:scale-105"
                            }`}
                    >
                        {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Bạn đã có tài khoản?{" "}
                    <a href="/login" className="text-[#B58D73] font-medium hover:underline">
                        Đăng nhập ngay
                    </a>
                </p>
            </div>
        </div>
    );
}
