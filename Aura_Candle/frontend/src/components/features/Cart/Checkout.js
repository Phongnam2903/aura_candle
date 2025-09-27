import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-toastify";

export default function CheckoutPage() {
    const { cart, dispatch } = useCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = 40000;
    const total = subtotal + shippingFee;

    const [info, setInfo] = useState({
        email: "",
        name: "",
        phone: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        note: "",
    });
    const [payment, setPayment] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!info.name || !info.phone || !info.address) {
            toast.error("Vui lòng nhập đầy đủ thông tin giao hàng.");
            return;
        }
        if (!payment) {
            toast.error("Bạn cần chọn phương thức thanh toán.");
            return;
        }
        if (cart.length === 0) {
            toast.error("Giỏ hàng trống.");
            return;
        }
        toast.success(`Đặt hàng thành công! Phương thức: ${payment}`);
        dispatch({ type: "CLEAR" });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-3 gap-8">
                {/* ===== Cột 1: Thông tin nhận hàng ===== */}
                <form
                    onSubmit={handleSubmit}
                    className="md:col-span-2 bg-white p-6 rounded shadow space-y-6"
                >
                    <h1 className="text-2xl font-bold text-emerald-700 mb-4">
                        Thông tin nhận hàng
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={info.email}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên"
                            value={info.name}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={info.phone}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ"
                            value={info.address}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full md:col-span-2"
                            required
                        />
                        <select
                            name="province"
                            value={info.province}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        >
                            <option value="">Tỉnh/Thành</option>
                            <option>Hà Nội</option>
                            <option>TP. Hồ Chí Minh</option>
                        </select>
                        <select
                            name="district"
                            value={info.district}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        >
                            <option value="">Quận/Huyện</option>
                            <option>Quận Ba Đình</option>
                            <option>Quận Hoàn Kiếm</option>
                        </select>
                        <select
                            name="ward"
                            value={info.ward}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        >
                            <option value="">Phường/Xã</option>
                            <option>Phường Phúc Xá</option>
                        </select>
                        <textarea
                            name="note"
                            placeholder="Ghi chú (tùy chọn)"
                            value={info.note}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full md:col-span-2"
                        />
                    </div>

                    {/* Vận chuyển */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-lg mb-2">Vận chuyển</h2>
                        <label className="flex justify-between items-center border p-3 rounded cursor-pointer">
                            <div className="flex items-center gap-3">
                                <input type="radio" checked readOnly />
                                <span>Giao hàng tận nơi</span>
                            </div>
                            <span>{shippingFee.toLocaleString()}đ</span>
                        </label>
                    </div>

                    {/* Thanh toán */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-lg mb-2">Thanh toán</h2>

                        {/* COD */}
                        <label className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2">
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={payment === "COD"}
                                onChange={() => setPayment("COD")}
                            />
                            <span>Thanh toán khi giao hàng (COD)</span>
                        </label>

                        {/* Momo */}
                        <label className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2">
                            <input
                                type="radio"
                                name="payment"
                                value="Momo"
                                checked={payment === "Momo"}
                                onChange={() => setPayment("Momo")}
                            />
                            <span>Thanh toán qua ví Momo</span>
                        </label>

                        {/* ZaloPay */}
                        <label className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2">
                            <input
                                type="radio"
                                name="payment"
                                value="ZaloPay"
                                checked={payment === "ZaloPay"}
                                onChange={() => setPayment("ZaloPay")}
                            />
                            <span>Thanh toán qua ZaloPay</span>
                        </label>

                        {/* Chuyển khoản */}
                        <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="Bank"
                                checked={payment === "Bank"}
                                onChange={() => setPayment("Bank")}
                            />
                            <span>Chuyển khoản ngân hàng</span>
                        </label>
                    </div>


                    <button
                        type="submit"
                        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded w-full md:w-auto"
                    >
                        Đặt hàng
                    </button>
                </form>

                {/* ===== Cột 2: Đơn hàng ===== */}
                <div className="bg-white p-6 rounded shadow h-fit">
                    <h2 className="text-xl font-bold mb-4">
                        Đơn hàng ({cart.length} sản phẩm)
                    </h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b pb-2"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.img || item.image}
                                        alt={item.name}
                                        className="w-14 h-14 object-cover border rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-semibold">
                                    {(item.price * item.quantity).toLocaleString()}đ
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-2">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí vận chuyển</span>
                            <span>{shippingFee.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Tổng cộng</span>
                            <span className="text-red-600">{total.toLocaleString()}đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
