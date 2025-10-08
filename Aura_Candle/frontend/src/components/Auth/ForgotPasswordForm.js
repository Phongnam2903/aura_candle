import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    toast.success("Đã gửi liên kết đặt lại mật khẩu!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-green-100 transition-all duration-300">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-semibold text-green-800">
            Quên mật khẩu
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Nhập email bạn đã đăng ký. Chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Địa chỉ email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-300 transition-all text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-xl shadow hover:bg-green-600 hover:shadow-md transition-all font-medium"
          >
            Gửi liên kết đặt lại
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Nhớ mật khẩu?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline hover:text-green-700 font-medium"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}
