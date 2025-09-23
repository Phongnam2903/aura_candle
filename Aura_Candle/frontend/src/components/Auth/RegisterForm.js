import React from "react";

export default function RegisterForm() {
    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow rounded">
            <div className="flex justify-center gap-4 mb-8 text-xl font-semibold">
                <span className="text-black border-b-2 border-black pb-1">Đăng ký</span>
            </div>

            <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Họ"
                        className="border rounded px-4 py-3 focus:outline-pink-500"
                    />
                    <input
                        type="text"
                        placeholder="Tên"
                        className="border rounded px-4 py-3 focus:outline-pink-500"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1">
                        <input type="radio" name="gender" value="female" /> Nữ
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="radio" name="gender" value="male" /> Nam
                    </label>
                </div>

                <input
                    type="date"
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full border rounded px-4 py-3 focus:outline-pink-500"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
                >
                    ĐĂNG KÝ
                </button>
            </form>

            <p className="text-center mt-4 text-sm">
                Bạn đã có tài khoản?{" "}
                <a href="/login" className="text-pink-500 hover:underline">
                    Đăng nhập ngay
                </a>
            </p>
        </div>
    );
}
