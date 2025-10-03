// src/pages/OrdersList.jsx
import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../../api/order/orderApi";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

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
            <p className="text-center py-10 text-gray-500 animate-pulse">
                Đang tải đơn hàng...
            </p>
        );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const formatPaymentStatus = (status) => {
        switch (status) {
            case "paid":
                return { text: "Đã thanh toán", bg: "bg-green-100", textColor: "text-green-800" };
            case "unpaid":
                return { text: "Chưa thanh toán", bg: "bg-yellow-100", textColor: "text-yellow-800" };
            case "failed":
                return { text: "Thanh toán thất bại", bg: "bg-red-100", textColor: "text-red-800" };
            case "refunded":
                return { text: "Hoàn tiền", bg: "bg-gray-100", textColor: "text-gray-800" };
            default:
                return { text: "Chưa xác định", bg: "bg-gray-100", textColor: "text-gray-800" };
        }
    };

    const formatShippingStatus = (status) => {
        switch (status) {
            case "Pending":
                return { text: "Đang xử lý", bg: "bg-orange-100", textColor: "text-orange-800" };
            case "Confirmed":
                return { text: "Đã xác nhận", bg: "bg-blue-100", textColor: "text-blue-800" };
            case "Shipped":
                return { text: "Đang giao", bg: "bg-indigo-100", textColor: "text-indigo-800" };
            case "Delivered":
                return { text: "Đã giao", bg: "bg-green-100", textColor: "text-green-800" };
            case "Cancelled":
                return { text: "Đã hủy", bg: "bg-red-100", textColor: "text-red-800" };
            default:
                return { text: "Chưa xác định", bg: "bg-gray-100", textColor: "text-gray-800" };
        }
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
                Đơn Hàng Của Bạn
            </h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg text-sm sm:text-base">
                            <thead className="bg-emerald-600 text-white">
                                <tr>
                                    <th className="py-2 px-3 text-left">Đơn hàng</th>
                                    <th className="py-2 px-3 text-left hidden sm:table-cell">Ngày</th>
                                    <th className="py-2 px-3 text-left hidden md:table-cell">Địa chỉ</th>
                                    <th className="py-2 px-3 text-left">Giá trị</th>
                                    <th className="py-2 px-3 text-left hidden sm:table-cell">PT Thanh toán</th>
                                    <th className="py-2 px-3 text-left hidden sm:table-cell">TT Thanh toán</th>
                                    <th className="py-2 px-3 text-left hidden md:table-cell">TT Vận chuyển</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentOrders.map((o) => {
                                    const payment = formatPaymentStatus(o.paymentStatus);
                                    const shipping = formatShippingStatus(o.status);
                                    return (
                                        <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-2 px-3 text-gray-700">
                                                {o.items?.map(i => i.product?.name || "Sản phẩm hết").join(", ")}
                                            </td>
                                            <td className="py-2 px-3 text-gray-600 hidden sm:table-cell">
                                                {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : "-"}
                                            </td>
                                            <td className="py-2 px-3 text-gray-600 hidden md:table-cell">{o.address?.specificAddress || "-"}</td>
                                            <td className="py-2 px-3 font-semibold text-emerald-600">
                                                {o.totalAmount?.toLocaleString() || 0}đ
                                            </td>
                                            <td className="py-2 px-3 hidden sm:table-cell">
                                                <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${payment.bg} ${payment.textColor}`}>
                                                    {o.paymentMethod || "-"}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 hidden sm:table-cell">
                                                <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${payment.bg} ${payment.textColor}`}>
                                                    {payment.text}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 hidden md:table-cell">
                                                <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${shipping.bg} ${shipping.textColor}`}>
                                                    {shipping.text}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2 overflow-x-auto">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg border text-sm sm:text-base transition-colors ${num === currentPage
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>

    );
}
