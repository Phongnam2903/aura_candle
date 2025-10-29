import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import { getAddressesByUser } from "../../../api/address/addressApi";
import { checkout } from "../../../api/order/orderApi";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [info, setInfo] = useState({ email: "", name: "", phone: "" });
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [payment, setPayment] = useState("");
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setInfo({ email: user.email || "", name: user.name || "", phone: user.phone || "" });
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

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAddressId) return toast.error("Bạn cần chọn địa chỉ giao hàng.");
        if (!payment) return toast.error("Bạn cần chọn phương thức thanh toán.");
        if (cart.length === 0) return toast.error("Giỏ hàng trống.");

        try {
            const payload = {
                addressId: selectedAddressId,
                items: cart.map((i) => ({ productId: i.id || i._id, quantity: i.quantity })),
                payment,
            };
            const result = await checkout(payload);
            
            if (result.ok && result.order) {
                setOrderId(result.order._id); // Lưu orderId từ response
                
                // Clear cart cho tất cả phương thức thanh toán
                clearCart();
                
                // Xử lý theo phương thức thanh toán
                if (payment === "Bank") {
                    // Thanh toán chuyển khoản - hiển thị QR, sau đó redirect
                    toast.success("Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.");
                    setTimeout(() => {
                        navigate("/");
                    }, 3000); // Redirect sau 3 giây để user thấy QR
                } else {
                    // COD - thanh toán khi nhận hàng
                    toast.success("Đặt hàng thành công!");
                    navigate("/");
                }
            } else {
                toast.error(result.message || "Không thể tạo đơn hàng");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50 min-h-screen">
                {/* LEFT COLUMN */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-emerald-100">
                    <h1 className="text-3xl font-bold mb-6 text-emerald-700 border-b pb-3">Thanh toán</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contact Info */}
                        <div>
                            <h2 className="font-semibold text-lg mb-3 text-emerald-600">Thông tin liên hệ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["name", "email", "phone"].map((field, idx) => (
                                    <input
                                        key={idx}
                                        type={field === "email" ? "email" : "text"}
                                        placeholder={
                                            field === "name"
                                                ? "Họ tên"
                                                : field === "email"
                                                    ? "Email"
                                                    : "Số điện thoại"
                                        }
                                        value={info[field]}
                                        onChange={(e) => setInfo({ ...info, [field]: e.target.value })}
                                        className="border border-emerald-300 focus:border-emerald-500 rounded-xl p-3 w-full transition"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h2 className="font-semibold text-lg mb-3 text-emerald-600">Địa chỉ giao hàng</h2>
                            {addresses.length === 0 ? (
                                <p className="text-gray-600">Bạn chưa có địa chỉ nào, hãy thêm trong mục tài khoản.</p>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr._id}
                                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${selectedAddressId === addr._id
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
                                                className="text-emerald-600"
                                            />
                                            <span>
                                                {addr.specificAddress}
                                                {addr.isDefault && <span className="ml-2 text-sm text-emerald-600 font-medium">(Mặc định)</span>}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div>
                            <h2 className="font-semibold text-lg mb-3 text-emerald-600">Phương thức thanh toán</h2>
                            <div className="space-y-3">
                                {[
                                    { value: "COD", label: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
                                    { value: "Bank", label: "Chuyển khoản ngân hàng", icon: "🏦" }
                                ].map((method) => (
                                    <label
                                        key={method.value}
                                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                            payment === method.value 
                                                ? "border-emerald-600 bg-emerald-50 shadow-md" 
                                                : "border-gray-300 hover:border-emerald-400 hover:shadow-sm"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.value}
                                            checked={payment === method.value}
                                            onChange={(e) => setPayment(e.target.value)}
                                            className="text-emerald-600"
                                        />
                                        <span className="text-2xl">{method.icon}</span>
                                        <span className="font-medium">{method.label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Hiển thị QR nếu chọn Bank */}
                            {payment === "Bank" && (
                                <div className="mt-4 border border-emerald-200 p-4 rounded-2xl bg-emerald-50 text-center">
                                    <p className="font-medium text-emerald-700 mb-2">Quét mã QR để thanh toán</p>
                                    <img
                                        src="/assets/QR.png"
                                        alt="QR thanh toán ngân hàng"
                                        className="mx-auto w-64 h-64 object-contain rounded-xl border border-emerald-300 shadow-md"
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        Nội dung chuyển khoản: <strong>Thanh toán đơn hàng #{orderId || "###"}</strong>
                                    </p>
                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold shadow-md transition-all"
                        >
                            Xác nhận đặt hàng
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN - Order Summary */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 sticky top-10 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-emerald-700 border-b pb-2">Giỏ hàng</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart.length === 0 ? (
                            <p className="text-gray-600">Giỏ hàng trống.</p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between border-b pb-3 hover:bg-emerald-50 rounded-xl transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                item.img?.startsWith("https")
                                                    ? item.img
                                                    : item.image?.startsWith("https")
                                                        ? item.image
                                                        : "https://via.placeholder.com/80"
                                            }
                                            alt={item.name || "Sản phẩm"}
                                            className="w-16 h-16 object-cover rounded-xl border border-emerald-200"
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
        </>
    );
};

export default CheckoutPage;
