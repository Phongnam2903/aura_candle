// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-toastify";

export default function CheckoutPage() {
    const { cart, dispatch } = useCart();
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const [payment, setPayment] = useState("");

    const handlePayment = (e) => {
        e.preventDefault();
        if (!payment) {
            toast.warn("Vui lòng chọn phương thức thanh toán.");
            return;
        }
        if (cart.length === 0) {
            toast.error("Giỏ hàng trống.");
            return;
        }

        // Hiển thị thông báo đẹp
        toast.success(
            `Thanh toán thành công qua ${payment}! Cảm ơn bạn đã mua hàng tại Aura Candle.`,
            { position: "top-center", autoClose: 3000 }
        );

        // ✅ Xóa toàn bộ giỏ hàng sau khi thanh toán
        dispatch({ type: "CLEAR" });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ===== Trái: Sản phẩm ===== */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Đơn hàng của bạn</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">Giỏ hàng trống.</p>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b pb-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.img || item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-emerald-600">
                                    {(item.price * item.quantity).toLocaleString()}đ
                                </p>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg pt-4">
                            <span>Tổng cộng:</span>
                            <span className="text-red-600">{total.toLocaleString()}đ</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== Phải: Thanh toán ===== */}
            <div className="bg-white rounded-xl shadow p-6 h-fit">
                <h2 className="text-2xl font-bold mb-4">Phương thức thanh toán</h2>
                <form className="space-y-4" onSubmit={handlePayment}>
                    {["Momo", "ZaloPay", "Chuyển khoản ngân hàng"].map((p) => (
                        <label
                            key={p}
                            className="flex items-center gap-3 border p-3 rounded-lg hover:border-emerald-500 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="pay"
                                value={p}
                                checked={payment === p}
                                onChange={() => setPayment(p)}
                                className="w-5 h-5 accent-emerald-500"
                            />
                            <span>{p}</span>
                        </label>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg mt-6 transition"
                    >
                        Xác nhận thanh toán
                    </button>
                </form>
            </div>
        </div>
    );
}
