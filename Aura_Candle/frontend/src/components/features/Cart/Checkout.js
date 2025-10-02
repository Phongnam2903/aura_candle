import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import orderApi from "../../../api/order/orderApi";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
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

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = 40000;
    const total = subtotal + shippingFee;

    const { clearCart } = useCart();
    const navigate = useNavigate();
    // Lấy user từ localStorage khi đã login
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setInfo((prev) => ({
                ...prev,
                email: user.email || "",
                name: user.name || "",
                phone: user.phone || "",
                address: user.addresses?.[0] || "",
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
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

        try {
            const payload = {
                items: cart.map(i => ({
                    productId: i._id,
                    quantity: i.quantity
                })),
                shippingInfo: {
                    address: info.address,
                    street: info.address,     // sẽ map sang specificAddress
                    ward: info.ward,            // ward + street
                    district: info.district,
                    province: info.province,
                },
                payment: payment,
            };

            console.log("Payload gửi lên:", payload);
            await orderApi.checkout(payload);
            toast.success("Đặt hàng thành công!");

            // Clear cart
            setCart([]);
            localStorage.removeItem("cart");
            clearCart();
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-3 gap-8">
                {/* ===== Thông tin nhận hàng ===== */}
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
                            disabled
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
                        {/* Tỉnh/Thành */}
                        <input
                            type="text"
                            name="province"
                            placeholder="Tỉnh/Thành"
                            value={info.province}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        />

                        {/* Quận/Huyện */}
                        <input
                            type="text"
                            name="district"
                            placeholder="Quận/Huyện"
                            value={info.district}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        />

                        {/* Phường/Xã */}
                        <input
                            type="text"
                            name="ward"
                            placeholder="Phường/Xã"
                            value={info.ward}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full"
                        />
                        <textarea
                            name="note"
                            placeholder="Ghi chú (tùy chọn)"
                            value={info.note}
                            onChange={handleChange}
                            className="border rounded px-4 py-2 w-full md:col-span-2"
                        />
                    </div>

                    {/* Thanh toán */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-lg mb-2">Thanh toán</h2>
                        {["COD", "Momo", "ZaloPay", "Bank"].map(method => (
                            <label
                                key={method}
                                className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2"
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    checked={payment === method}
                                    onChange={() => setPayment(method)}
                                />
                                <span>{method === "COD" ? "Thanh toán khi giao hàng (COD)" :
                                    method === "Momo" ? "Thanh toán qua ví Momo" :
                                        method === "ZaloPay" ? "Thanh toán qua ZaloPay" :
                                            "Chuyển khoản ngân hàng"}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded w-full md:w-auto"
                    >
                        Đặt hàng
                    </button>
                </form>

                {/* ===== Đơn hàng ===== */}
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
