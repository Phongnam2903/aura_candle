import React, { useState } from "react";

export default function Orders() {
  const [orders] = useState([
    { id: "DH001", customer: "Nguyễn A", total: 300000, status: "Đang xử lý" },
    { id: "DH002", customer: "Trần B", total: 450000, status: "Hoàn thành" },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Đơn hàng</h1>
      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Mã đơn</th>
            <th className="p-3 border">Khách hàng</th>
            <th className="p-3 border">Tổng tiền</th>
            <th className="p-3 border">Trạng thái</th>
            <th className="p-3 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="p-3 border">{o.id}</td>
              <td className="p-3 border">{o.customer}</td>
              <td className="p-3 border">{o.total.toLocaleString()}₫</td>
              <td className="p-3 border">{o.status}</td>
              <td className="p-3 border space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Xem
                </button>
                <button className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600">
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
