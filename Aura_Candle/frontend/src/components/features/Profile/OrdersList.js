import React from "react";

export default function OrdersList() {
    // ➜ Dữ liệu mẫu, bạn có thể thay bằng dữ liệu từ API
    const orders = [
        {
            id: "DH001",
            date: "2025-09-10",
            address: "123 Đường A, Quận 1, TP.HCM",
            total: 350000,
            paymentStatus: "Đã thanh toán",
            shippingStatus: "Đang giao",
        },
        {
            id: "DH002",
            date: "2025-09-01",
            address: "456 Đường B, Quận 3, TP.HCM",
            total: 220000,
            paymentStatus: "Chưa thanh toán",
            shippingStatus: "Đã giao",
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Đơn Hàng Của Bạn</h2>

            {orders.length === 0 ? (
                <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                        <thead className="bg-emerald-600 text-white">
                            <tr>
                                <th className="py-3 px-4">Đơn hàng</th>
                                <th className="py-3 px-4">Ngày</th>
                                <th className="py-3 px-4">Địa chỉ</th>
                                <th className="py-3 px-4">Giá trị đơn</th>
                                <th className="py-3 px-4">TT Thanh toán</th>
                                <th className="py-3 px-4">TT Vận chuyển</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr
                                    key={o.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 font-semibold">{o.id}</td>
                                    <td className="py-3 px-4">{o.date}</td>
                                    <td className="py-3 px-4">{o.address}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">
                                        {o.total.toLocaleString()}đ
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${o.paymentStatus === "Đã thanh toán"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {o.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${o.shippingStatus === "Đã giao"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-orange-100 text-orange-700"
                                                }`}
                                        >
                                            {o.shippingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
