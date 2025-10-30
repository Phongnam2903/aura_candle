import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSellerOrders,
  updateSellerOrderStatus,
} from "../../api/order/orderSellerApi";
import { CheckCircle, XCircle, Package, Edit3, DollarSign, Filter, Eye } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState("all"); // all, unpaid, paid
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

  // Các trạng thái KHÔNG được phép chuyển sang Cancelled
  const NON_CANCELLABLE_STATUSES = ["Shipped", "Delivered", "Completed"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải đơn hàng!");
      }
    };
    fetchOrders();
  }, []);

  // Filter orders theo payment status
  useEffect(() => {
    if (paymentFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.paymentStatus === paymentFilter));
    }
    setCurrentPage(1); // Reset về trang 1 khi filter
  }, [paymentFilter, orders]);

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
      
      // Hiển thị error message từ backend
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          "Cập nhật trạng thái thất bại!";
      
      toast.error(errorMessage);
    }
  };

  // Confirm payment - update paymentStatus từ unpaid → paid
  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm("Xác nhận đã nhận được thanh toán cho đơn hàng này?")) {
      return;
    }

    try {
      // Call API to update payment status
      await updateSellerOrderStatus(orderId, "Confirmed", "paid");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, paymentStatus: "paid", status: "Confirmed" }
            : o
        )
      );

      toast.success("Đã xác nhận thanh toán!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xác nhận thanh toán!");
    }
  };

  // Pagination logic - dùng filteredOrders thay vì orders
  const indexOfLast = currentPage * ORDERS_PER_PAGE;
  const indexOfFirst = indexOfLast - ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

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

  const getPaymentStatusBadge = (status) => {
    const styles = {
      unpaid: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700",
      processing: "bg-yellow-100 text-yellow-700",
      failed: "bg-gray-100 text-gray-600",
      refunded: "bg-purple-100 text-purple-700",
    };
    const labels = {
      unpaid: "Chưa thanh toán",
      paid: "Đã thanh toán",
      processing: "Đang xử lý",
      failed: "Thất bại",
      refunded: "Đã hoàn tiền",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      COD: "💵",
      Bank: "🏦",
      VNPay: "💳",
      Momo: "📱",
      "E-Wallet": "📱",
    };
    return icons[method] || "💰";
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Package className="text-pink-500" /> Quản lý đơn hàng
      </h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={20} />
          <span className="text-gray-600 font-medium">Lọc theo thanh toán:</span>
        </div>
        <button
          onClick={() => setPaymentFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            paymentFilter === "all"
              ? "bg-pink-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả ({orders.length})
        </button>
        <button
          onClick={() => setPaymentFilter("unpaid")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            paymentFilter === "unpaid"
              ? "bg-red-600 text-white shadow-md"
              : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          🔴 Chưa thanh toán ({orders.filter(o => o.paymentStatus === "unpaid").length})
        </button>
        <button
          onClick={() => setPaymentFilter("paid")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            paymentFilter === "paid"
              ? "bg-green-600 text-white shadow-md"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          ✅ Đã thanh toán ({orders.filter(o => o.paymentStatus === "paid").length})
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-pink-50 text-pink-700 text-left">
              <th className="p-4">Mã đơn hàng</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái đơn</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((o) => (
                <tr
                  key={o._id}
                  className={`border-t hover:bg-pink-50 transition-all duration-200 ${
                    o.paymentStatus === "unpaid" && o.paymentMethod === "Bank" 
                      ? "bg-red-50" 
                      : ""
                  }`}
                >
                  {/* Mã đơn hàng */}
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 text-xs">
                      {o.orderCode || o._id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="p-4">
                    <div className="font-medium">{o.user?.name || "—"}</div>
                    <div className="text-xs text-gray-500">{o.user?.email || ""}</div>
                  </td>

                  {/* Thanh toán */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{getPaymentMethodIcon(o.paymentMethod)}</span>
                        <span className="text-xs font-medium">{o.paymentMethod}</span>
                      </div>
                      {getPaymentStatusBadge(o.paymentStatus)}
                    </div>
                  </td>

                  {/* Tổng tiền */}
                  <td className="p-4 font-semibold text-emerald-600">
                    {(o.totalAmount ?? 0).toLocaleString()}₫
                  </td>

                  {/* Trạng thái đơn */}
                  <td className="p-4">
                    {editingOrderId === o._id ? (
                      <div className="space-y-1">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border border-gray-300 px-2 py-1 rounded-md text-sm focus:ring-2 focus:ring-pink-400"
                        >
                          {STATUS_OPTIONS.map((s) => {
                            // Disable "Cancelled" nếu order đã Shipped/Delivered/Completed
                            const isDisabled = 
                              s === "Cancelled" && 
                              NON_CANCELLABLE_STATUSES.includes(o.status);
                            
                            return (
                              <option 
                                key={s} 
                                value={s}
                                disabled={isDisabled}
                              >
                                {s} {isDisabled ? "(không khả dụng)" : ""}
                              </option>
                            );
                          })}
                        </select>
                        {/* Warning nếu đang cố chọn Cancelled cho order đã shipped */}
                        {NON_CANCELLABLE_STATUSES.includes(o.status) && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Không thể hủy đơn đã {o.status}
                          </p>
                        )}
                      </div>
                    ) : (
                      getStatusBadge(o.status)
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      {/* Nút xem chi tiết - luôn hiển thị */}
                      <button
                        onClick={() => navigate(`/seller/orders/${o._id}`)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 justify-center text-xs font-medium"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye size={14} /> Chi tiết
                      </button>

                      {o.status === "Cancelled" ? (
                        // Hiển thị text thông báo khi đơn hàng đã bị hủy
                        <div className="text-center text-xs text-gray-500 italic">
                          Đơn đã hủy
                        </div>
                      ) : (
                        <>
                          {/* Nút xác nhận thanh toán - chỉ hiện nếu chưa thanh toán và chưa bị hủy */}
                          {o.paymentStatus === "unpaid" && o.paymentMethod !== "COD" && (
                            <button
                              onClick={() => handleConfirmPayment(o._id)}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-1 justify-center text-xs font-medium"
                              title="Xác nhận đã nhận được thanh toán"
                            >
                              <DollarSign size={14} /> Xác nhận TT
                            </button>
                          )}

                          {/* Nút cập nhật trạng thái */}
                          {editingOrderId === o._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveStatus}
                                className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-1 text-xs"
                              >
                                <CheckCircle size={14} /> Lưu
                              </button>
                              <button
                                onClick={() => setEditingOrderId(null)}
                                className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition flex items-center gap-1 text-xs"
                              >
                                <XCircle size={14} /> Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdateClick(o._id, o.status)}
                              disabled={o.status === "Completed"}
                              className={`px-3 py-1 rounded-lg flex items-center gap-1 justify-center transition text-xs ${
                                o.status === "Completed"
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-pink-500 text-white hover:bg-pink-600"
                              }`}
                            >
                              <Edit3 size={14} /> Cập nhật
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
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
