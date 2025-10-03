import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSellerOrders, updateSellerOrderStatus } from "../../api/order/orderSellerApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
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

      setOrders(prev =>
        prev.map(o =>
          o._id === editingOrderId
            ? {
              ...o,
              status: newStatus,
              items: o.items.map(item => ({
                ...item,
                status: newStatus
              }))
            }
            : o
        )
      );
      console.log(orders);
      toast.success("Cập nhật trạng thái thành công!");
      setEditingOrderId(null);
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Đơn hàng</h1>
      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Mã đơn</th>
            <th className="p-3 border">Khách hàng</th>
            <th className="p-3 border">Tổng tiền</th>
            <th className="p-3 border">Trạng thái sản phẩm</th>
            <th className="p-3 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="hover:bg-gray-50">
              <td className="p-3 border">{o._id}</td>
              <td className="p-3 border">{o.user?.name || "-"}</td>
              <td className="p-3 border">{(o.totalAmount ?? 0).toLocaleString()}₫</td>
              <td className="p-3 border">
                {o.items.map(item => (
                  <div key={item._id}>
                    {item.product?.name}: {editingOrderId === o._id ? (
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="border p-1 rounded"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      item.status
                    )}
                  </div>
                ))}
              </td>
              <td className="p-3 border space-x-2">
                {editingOrderId === o._id ? (
                  <>
                    <button
                      onClick={handleSaveStatus}
                      className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleUpdateClick(o._id, o.items[0]?.status)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Cập nhật
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
