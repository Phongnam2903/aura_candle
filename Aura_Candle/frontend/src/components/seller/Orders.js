import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSellerOrders, updateSellerOrderStatus } from "../../api/order/orderSellerApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải đơn hàng!");
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateClick = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async () => {
    try {
      await updateSellerOrderStatus(editingOrderId, newStatus);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === editingOrderId
            ? {
              ...o,
              status: newStatus,
              items: o.items.map((item) => ({
                ...item,
                status: newStatus,
              })),
            }
            : o
        )
      );

      toast.success("Cập nhật trạng thái thành công!");
      setEditingOrderId(null);
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  // 🔹 Pagination logic
  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Quản lý Đơn hàng</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-pink-50 text-pink-700 uppercase text-sm">
              <th className="p-3 border">Mã đơn</th>
              <th className="p-3 border">Khách hàng</th>
              <th className="p-3 border">Tổng tiền</th>
              <th className="p-3 border">Trạng thái sản phẩm</th>
              <th className="p-3 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-pink-50 transition-all duration-200"
                >
                  <td className="p-3 border text-gray-700">{o._id}</td>
                  <td className="p-3 border">{o.user?.name || "-"}</td>
                  <td className="p-3 border font-semibold text-emerald-600">
                    {(o.totalAmount ?? 0).toLocaleString()}₫
                  </td>
                  <td className="p-3 border">
                    {o.items.map((item) => (
                      <div key={item._id} className="mb-1">
                        <span className="font-medium">{item.product?.name}</span>:{" "}
                        {editingOrderId === o._id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border border-gray-300 p-1 rounded-md text-sm focus:ring-2 focus:ring-pink-400"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Cancelled"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    {editingOrderId === o._id ? (
                      <>
                        <button
                          onClick={handleSaveStatus}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpdateClick(o._id, o.items[0]?.status)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Cập nhật
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
        >
          ← Trước
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === index + 1
                ? "bg-pink-600 text-white"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
