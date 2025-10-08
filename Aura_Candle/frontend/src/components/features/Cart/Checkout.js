import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import { getAddressesByUser } from "../../../api/address/addressApi";
import { checkout } from "../../../api/order/orderApi";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [info, setInfo] = useState({
        email: "",
        name: "",
        phone: "",
    });

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [payment, setPayment] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setInfo({
                email: user.email || "",
                name: user.name || "",
                phone: user.phone || "",
            });

            getAddressesByUser(user._id)
                .then((data) => {
                    setAddresses(data);
                    if (data.length > 0) {
                        const defaultAddr = data.find((a) => a.isDefault) || data[0];
                        setSelectedAddressId(defaultAddr._id);
                    }
                })
                .catch((err) => console.error("Lỗi load địa chỉ:", err));
        }
    }, []);

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAddressId) {
            toast.error("Bạn cần chọn địa chỉ giao hàng.");
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
                addressId: selectedAddressId,
                items: cart.map((i) => ({
                    productId: i.id || i._id,
                    quantity: i.quantity,
                })),
                payment,
            };

            await checkout(payload);
            toast.success("Đặt hàng thành công!");
            clearCart();
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 min-h-screen">
            {/* Cột trái: Form checkout */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                <h1 className="text-2xl font-bold mb-6 text-emerald-700">Thanh toán</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thông tin liên hệ */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Thông tin liên hệ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Họ tên"
                                value={info.name}
                                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                                className="border border-emerald-300 focus:border-emerald-500 focus:ring-emerald-300 rounded-lg p-2 w-full outline-none"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={info.email}
                                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                                className="border border-emerald-300 focus:border-emerald-500 focus:ring-emerald-300 rounded-lg p-2 w-full outline-none"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={info.phone}
                                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                                className="border border-emerald-300 focus:border-emerald-500 focus:ring-emerald-300 rounded-lg p-2 w-full outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Chọn địa chỉ */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Chọn địa chỉ giao hàng</h2>
                        {addresses.length === 0 ? (
                            <p className="text-gray-600">
                                Bạn chưa có địa chỉ nào, hãy thêm trong mục tài khoản.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr._id}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedAddressId === addr._id
                                            ? "border-emerald-600 bg-emerald-50 shadow-sm"
                                            : "border-gray-300 hover:border-emerald-400"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr._id}
                                            checked={selectedAddressId === addr._id}
                                            onChange={() => setSelectedAddressId(addr._id)}
                                            className="text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span>
                                            {addr.specificAddress}{" "}
                                            {addr.isDefault && (
                                                <span className="ml-2 text-sm text-emerald-600 font-medium">
                                                    (Mặc định)
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Phương thức thanh toán */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2 text-emerald-600">Phương thức thanh toán</h2>
                        <div className="space-y-3">
                            {["COD", "Bank", "Momo", "ZaloPay"].map((method) => (
                                <label key={method} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method}
                                        checked={payment === method}
                                        onChange={(e) => setPayment(e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>
                                        {method === "COD"
                                            ? "Thanh toán khi nhận hàng (COD)"
                                            : method === "Bank"
                                                ? "Chuyển khoản ngân hàng"
                                                : method === "Momo"
                                                    ? "Ví Momo"
                                                    : "ZaloPay"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Nút submit */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 shadow-md transition-all"
                    >
                        Xác nhận đặt hàng
                    </button>
                </form>
            </div>

            {/* Cột phải: Tóm tắt giỏ hàng */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                <h2 className="text-xl font-semibold mb-4 text-emerald-700">Giỏ hàng của bạn</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-600">Giỏ hàng trống.</p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between border-b pb-3"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            item.img && item.img.startsWith("https")
                                                ? item.img
                                                : item.image && item.image.startsWith("https")
                                                    ? item.image
                                                    : "https://via.placeholder.com/80"
                                        }
                                        alt={item.name || "Sản phẩm"}
                                        className="w-16 h-16 object-cover rounded-lg border border-emerald-200"
                                    />
                                    <div>
                                        <p className="font-medium text-emerald-700">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            SL: {item.quantity} × {item.price.toLocaleString()}₫
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold text-emerald-700">
                                    {(item.price * item.quantity).toLocaleString()}₫
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-gray-700">
                        <span>Tạm tính</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 text-emerald-700">
                        <span>Tổng cộng</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
