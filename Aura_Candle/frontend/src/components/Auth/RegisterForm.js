import React, { useState } from "react";
import { registerUser } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const [form, setForm] = useState({
        name: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // <--- thêm hook

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await registerUser(form);
            // Popup thông báo
            window.alert("Đăng ký thành công!");
            // Chuyển hướng sang trang đăng nhập
            navigate("/login");
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
            );
        }
    }

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">
            <div className="flex justify-center gap-4 mb-8 text-xl font-semibold">
                <span className="text-black border-b-2 border-black pb-1">Đăng ký</span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={form.gender === "female"}
                            onChange={handleChange}
                        />
                        Nữ
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={form.gender === "male"}
                            onChange={handleChange}
                        />
                        Nam
                    </label>
                </div>

                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
                >
                    ĐĂNG KÝ
                </button>
            </form>

            {message && (
                <p className="text-center mt-4 text-sm text-red-500">{message}</p>
            )}

            <p className="text-center mt-4 text-sm">
                Bạn đã có tài khoản?{" "}
                <a href="/login" className="text-pink-500 hover:underline">
                    Đăng nhập ngay
                </a>
            </p>
        </div>
    );
}
