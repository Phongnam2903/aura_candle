import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import { getAddressesByUser } from "../../../api/address/addressApi";
import { checkout } from "../../../api/order/orderApi";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, setCart, clearCart } = useCart();

    const [info, setInfo] = useState({
        email: "",
        name: "",
        phone: "",
    });

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [payment, setPayment] = useState("");

    // Load user info + địa chỉ khi vào trang
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

    // Tính tổng tiền
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Xử lý submit đặt hàng
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

            console.log("Payload gửi lên:", payload);
            await checkout(payload);
            toast.success("Đặt hàng thành công!");

            clearCart(); // ✅ chỉ cần cái này thôi
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột trái: Form checkout */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thông tin liên hệ */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Thông tin liên hệ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Họ tên"
                                value={info.name}
                                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                                className="border rounded p-2 w-full"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={info.email}
                                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                                className="border rounded p-2 w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={info.phone}
                                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                                className="border rounded p-2 w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Chọn địa chỉ */}
                    <div>
                        <h2 className="font-semibold text-lg mb-2">Chọn địa chỉ giao hàng</h2>
                        {addresses.length === 0 ? (
                            <p className="text-gray-600">
                                Bạn chưa có địa chỉ nào, hãy thêm trong mục tài khoản.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr._id}
                                        className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${selectedAddressId === addr._id
                                            ? "border-emerald-600 bg-emerald-50"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            value={addr._id}
                                            checked={selectedAddressId === addr._id}
                                            onChange={() => setSelectedAddressId(addr._id)}
                                        />
                                        <span>
                                            {addr.specificAddress}{" "}
                                            {addr.isDefault && (
                                                <span className="ml-2 text-sm text-emerald-600">
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
                        <h2 className="font-semibold text-lg mb-2">Phương thức thanh toán</h2>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={payment === "COD"}
                                    onChange={(e) => setPayment(e.target.value)}
                                />
                                Thanh toán khi nhận hàng (COD)
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Bank"
                                    checked={payment === "Bank"}
                                    onChange={(e) => setPayment(e.target.value)}
                                />
                                Chuyển khoản ngân hàng
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Momo"
                                    checked={payment === "Momo"}
                                    onChange={(e) => setPayment(e.target.value)}
                                />
                                Ví Momo
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="ZaloPay"
                                    checked={payment === "ZaloPay"}
                                    onChange={(e) => setPayment(e.target.value)}
                                />
                                ZaloPay
                            </label>
                        </div>
                    </div>

                    {/* Nút submit */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 transition"
                    >
                        Xác nhận đặt hàng
                    </button>
                </form>
            </div>

            {/* Cột phải: Tóm tắt giỏ hàng */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Giỏ hàng của bạn</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-gray-600">Giỏ hàng trống.</p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between border-b pb-3"
                            >
                                {/* Hình + tên sản phẩm */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.img || item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            SL: {item.quantity} × {item.price.toLocaleString()}₫
                                        </p>
                                    </div>
                                </div>

                                {/* Tổng tiền của sản phẩm */}
                                <p className="font-semibold text-right">
                                    {(item.price * item.quantity).toLocaleString()}₫
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Tổng cộng */}
                <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Tổng cộng</span>
                        <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
