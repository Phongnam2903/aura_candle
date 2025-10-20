import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderDetail() {
  const { id } = useParams();          // /seller/orders/:id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Fetch order error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!order) return <p>Không tìm thấy đơn hàng</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Chi tiết đơn hàng #{order._id}</h1>
      <div className="space-y-2">
        <p><strong>Khách hàng:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
        <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString()}₫</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Sản phẩm</h2>
      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">SL</th>
            <th className="p-2 border">Giá</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.price.toLocaleString()}₫</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
