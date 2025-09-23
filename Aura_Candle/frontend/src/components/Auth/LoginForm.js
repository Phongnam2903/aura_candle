import React from "react";

export default function LoginForm() {
    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">
            <div className="flex justify-center gap-4 mb-8 text-xl font-semibold">
                <span className="text-black border-b-2 border-black pb-1">Đăng nhập</span>
            </div>

            <form className="space-y-5">
                <input
                    type="email"
                    placeholder="Vui lòng nhập email của bạn"
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="password"
                    placeholder="Vui lòng nhập mật khẩu"
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
