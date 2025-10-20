import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Lock } from "lucide-react";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
                newPassword: password,
            });

            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg w-full max-w-md transition-transform hover:scale-[1.01] duration-300">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <Lock size={30} className="text-green-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-green-700">
                    Đặt lại mật khẩu
                </h2>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    Hãy nhập mật khẩu mới cho tài khoản của bạn.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-2.5 outline-none transition-all duration-200"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-2.5 outline-none transition-all duration-200"
                            placeholder="Nhập lại mật khẩu"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-green-700 hover:underline"
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}
