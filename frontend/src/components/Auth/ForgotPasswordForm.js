import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaSpinner } from "react-icons/fa";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/auth/forgot-password", { email });

      if (res.data.ok) {
        toast.success("✅ Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!");
        setEmail("");
      } else {
        toast.error(res.data.message || "Không thể gửi email!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-emerald-50 to-green-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-emerald-100 animate-fadeIn">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-semibold text-emerald-800">
            Quên mật khẩu
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300 transition-all text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl shadow-md font-medium transition-all hover:bg-emerald-600 hover:shadow-lg ${loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Đang gửi...
              </>
            ) : (
              "Gửi liên kết đặt lại"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Nhớ mật khẩu?{" "}
          <a
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-all"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>

      {/* Hiệu ứng nhẹ */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
