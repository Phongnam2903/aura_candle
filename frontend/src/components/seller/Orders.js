import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getSellerOrders,
  updateSellerOrderStatus,
} from "../../api/order/orderSellerApi";
import { CheckCircle, XCircle, Package, Edit3 } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Completed",
    "Refunded",
  ];

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

  // Pagination logic
  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-700",
      Shipped: "bg-indigo-100 text-indigo-700",
      Delivered: "bg-emerald-100 text-emerald-700",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-600",
      Refunded: "bg-gray-100 text-gray-600",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <Package className="text-pink-500" /> Quản lý đơn hàng
      </h1>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-pink-50 text-pink-700 text-left">
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Sản phẩm & trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((o) => (
                <tr
                  key={o._id}
                  className="border-t hover:bg-pink-50 transition-all duration-200"
                >
                  <td className="p-4 font-semibold text-gray-800">{o._id}</td>
                  <td className="p-4">{o.user?.name || "—"}</td>
                  <td className="p-4 font-semibold text-emerald-600">
                    {(o.totalAmount ?? 0).toLocaleString()}₫
                  </td>
                  <td className="p-4 space-y-2">
                    {o.items.map((item) => (
                      <div key={item._id}>
                        <span className="font-medium">{item.product?.name}</span>{" "}
                        {editingOrderId === o._id ? (
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-pink-400"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getStatusBadge(item.status)
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="p-4 text-center">
                    {editingOrderId === o._id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveStatus}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
                        >
                          <CheckCircle size={16} /> Lưu
                        </button>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition flex items-center gap-1"
                        >
                          <XCircle size={16} /> Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateClick(o._id, o.items[0]?.status)
                        }
                        disabled={o.status === "Completed"}
                        title={
                          o.status === "Completed"
                            ? "Đơn hàng đã hoàn thành, không thể cập nhật."
                            : "Cập nhật trạng thái"
                        }
                        className={`px-3 py-1 rounded-lg flex items-center gap-1 justify-center transition ${o.status === "Completed"
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-pink-500 text-white hover:bg-pink-600"
                          }`}
                      >
                        <Edit3 size={16} /> Cập nhật
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
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
      )}
    </div>
  );
}
