import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../../api/order/orderApi";

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
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
        return <p className="text-center py-10 text-gray-500">Đang tải đơn hàng...</p>;

    // Pagination calculations
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Đơn Hàng Của Bạn
            </h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-600">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 text-sm text-left rounded-lg">
                            <thead className="bg-emerald-600 text-white">
                                <tr>
                                    <th className="py-3 px-4">Đơn hàng</th>
                                    <th className="py-3 px-4">Ngày</th>
                                    <th className="py-3 px-4">Địa chỉ</th>
                                    <th className="py-3 px-4">Giá trị</th>
                                    <th className="py-3 px-4">TT Thanh toán</th>
                                    <th className="py-3 px-4">TT Vận chuyển</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((o) => (
                                    <tr
                                        key={o._id}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            {o.items.map((item) => item.product.name).join(", ")}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="py-3 px-4">{o.address?.specificAddress}</td>
                                        <td className="py-3 px-4 font-bold text-emerald-600">
                                            {o.totalAmount?.toLocaleString()}đ
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${o.paymentStatus === "Đã thanh toán"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {o.paymentStatus || "Chưa thanh toán"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${o.shippingStatus === "Đã giao"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {o.shippingStatus || "Đang xử lý"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`px-3 py-1 rounded border ${num === currentPage
                                        ? "bg-emerald-600 text-white border-emerald-600"
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
