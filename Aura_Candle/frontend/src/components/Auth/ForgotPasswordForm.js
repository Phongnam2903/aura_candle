import React from "react";

export default function ForgotPasswordForm() {
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">
      <div className="flex justify-center gap-4 mb-8 text-xl font-semibold">
        <span className="text-black border-b-2 border-black pb-1">
          Quên mật khẩu
        </span>
      </div>

      <form className="space-y-5">
        <p className="text-gray-600 text-center">
          Vui lòng nhập địa chỉ email bạn đã đăng ký.  
          Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>

        <input
          type="email"
          placeholder="Email của bạn"
          className="w-full border rounded px-4 py-3 focus:outline-pink-500"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Gửi liên kết đặt lại
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Nhớ mật khẩu?{" "}
        <a href="/login" className="text-pink-500 hover:underline">
          Đăng nhập ngay
        </a>
      </p>
    </div>
  );
}
