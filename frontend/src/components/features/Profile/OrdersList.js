import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../../api/order/orderApi";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Lỗi lấy đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading)
        return (
            <div className="flex flex-col items-center py-16 text-emerald-600 animate-pulse">
                <Clock size={40} className="mb-3" />
                <p>Đang tải đơn hàng của bạn...</p>
            </div>
        );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const formatShippingStatus = (status) => {
        switch (status) {
            case "Pending":
                return { text: "Đang xử lý", color: "bg-amber-100 text-amber-700", icon: <Clock size={16} /> };
            case "Confirmed":
                return { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={16} /> };
            case "Shipped":
                return { text: "Đang giao", color: "bg-indigo-100 text-indigo-700", icon: <Truck size={16} /> };
            case "Delivered":
                return { text: "Đã giao", color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> };
            case "Cancelled":
                return { text: "Đã hủy", color: "bg-red-100 text-red-700", icon: <XCircle size={16} /> };
            default:
                return { text: "Không xác định", color: "bg-gray-100 text-gray-600", icon: <Package size={16} /> };
        }
    };

    return (
        <div className="bg-gradient-to-b from-emerald-50 to-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-serif text-emerald-700 text-center mb-8">
                Lịch sử đơn hàng của bạn 🌿
            </h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="space-y-5">
                    {currentOrders.map((o) => {
                        const shipping = formatShippingStatus(o.status);
                        return (
                            <div
                                key={o._id}
                                className="bg-white border border-emerald-100 shadow-sm hover:shadow-md rounded-xl p-5 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-gray-100 pb-3 mb-3">
                                    <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                        <Package size={18} className="text-emerald-600" />
                                        Mã đơn: <span className="text-emerald-700">{o._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>

                                {/* Nội dung đơn */}
                                <div className="space-y-2">
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-medium text-gray-800">Sản phẩm:</span>{" "}
                                        {o.items?.map((i) => i.product?.name || "Sản phẩm đã xóa").join(", ")}
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
                                        {o.address?.specificAddress || "-"}
                                    </p>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-medium text-gray-800">Tổng tiền:</span>{" "}
                                        <span className="text-emerald-600 font-semibold">
                                            {o.totalAmount?.toLocaleString()}đ
                                        </span>
                                    </p>
                                </div>

                                {/* Trạng thái */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${shipping.color}`}
                                    >
                                        {shipping.icon}
                                        {shipping.text}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                        {o.paymentMethod || "Chưa rõ"}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${o.paymentStatus === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {o.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setCurrentPage(num)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${num === currentPage
                                    ? "bg-emerald-600 text-white shadow"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
