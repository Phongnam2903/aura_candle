import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  ShoppingBag,
  DollarSign,
  Printer,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orderSeller/seller-orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error("Không thể tải chi tiết đơn hàng!");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    if (!order) return;

    const paymentLabelsMap = {
      unpaid: "Chưa thanh toán",
      paid: "Đã thanh toán",
      processing: "Đang xử lý",
      failed: "Thất bại",
      refunded: "Đã hoàn tiền",
    };

    const orderCode = order.orderCode || order._id;
    const customerName = order.user?.name || order.address?.fullName || "N/A";
    const customerPhone = order.user?.phone || "N/A";
    const customerEmail = order.user?.email || "N/A";
    const shippingAddress = order.address?.specificAddress || "Chưa có thông tin địa chỉ";
    const printDate = new Date().toLocaleString("vi-VN");
    const orderDate = new Date(order.createdAt).toLocaleString("vi-VN");
    const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

    const barsHtml = [4, 7, 3, 6, 5, 8, 3, 6, 4, 7, 5, 4, 6, 8, 3, 5, 7, 4, 6, 3, 5, 8, 4, 6, 3, 7, 5]
      .map((h, i) => `<div style="width:${i % 3 === 0 ? '3px' : '1.5px'};height:${h * 5}px;background:#111;border-radius:1px;display:inline-block;margin:0 1px;"></div>`)
      .join("");

    const rowsHtml = order.items?.map((item, idx) => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:4px 6px;color:#555;">${idx + 1}</td>
        <td style="padding:4px 6px;font-weight:600;">${item.product?.name || item.name || "Sản phẩm"}</td>
        <td style="padding:4px 6px;text-align:center;">${item.quantity}</td>
        <td style="padding:4px 6px;text-align:right;">${item.price?.toLocaleString()}₫</td>
        <td style="padding:4px 6px;text-align:right;font-weight:700;color:#e91e8c;">${(item.price * item.quantity).toLocaleString()}₫</td>
      </tr>
    `).join("") || "";

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Phiếu giao hàng - ${orderCode}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; }
    @page { size: A5 landscape; margin: 8mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
<div style="border:2px solid #1a1a2e;border-radius:4px;overflow:hidden;font-size:11px;color:#111;width:100%;">

  <!-- Header -->
  <div style="background:#e91e8c;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:8px 14px;">
    <div style="font-weight:900;font-size:20px;letter-spacing:1px;">AURA CANDLE</div>
    <div style="text-align:right;font-size:10px;opacity:0.9;">
      <div>PHIẾU GIAO HÀNG</div>
      <div>In lúc: ${printDate}</div>
    </div>
  </div>

  <!-- Order code -->
  <div style="background:#f8f8f8;border-bottom:2px dashed #ccc;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;">
    <div>
      <div style="font-size:9px;color:#555;margin-bottom:2px;">MÃ ĐƠN HÀNG</div>
      <div style="font-weight:900;font-size:18px;letter-spacing:2px;font-family:monospace;">${orderCode}</div>
      <div style="font-size:9px;color:#555;margin-top:2px;">Ngày đặt: ${orderDate}</div>
    </div>
    <div style="display:flex;align-items:flex-end;height:44px;">${barsHtml}</div>
  </div>

  <!-- From / To -->
  <div style="display:flex;border-bottom:1px dashed #ccc;">
    <div style="flex:1;padding:10px 14px;border-right:1px dashed #ccc;background:#fff8fb;">
      <div style="font-size:9px;font-weight:700;color:#e91e8c;margin-bottom:5px;">NGƯỜI GỬI</div>
      <div style="font-weight:700;font-size:12px;">AURA CANDLE SHOP</div>
      <div style="color:#444;margin-top:2px;">shop@auracandle.vn</div>
      <div style="color:#444;">Hà Nội, Việt Nam</div>
    </div>
    <div style="flex:2;padding:10px 14px;">
      <div style="font-size:9px;font-weight:700;color:#e91e8c;margin-bottom:5px;">NGƯỜI NHẬN</div>
      <div style="font-weight:800;font-size:14px;">${customerName}</div>
      <div style="font-weight:700;font-size:13px;margin-top:2px;">☎ ${customerPhone}</div>
      <div style="color:#444;margin-top:2px;">${customerEmail}</div>
      <div style="margin-top:4px;padding:4px 8px;background:#f0f4ff;border-left:3px solid #3b5bdb;border-radius:2px;font-size:11px;font-weight:600;">
        📍 ${shippingAddress}
      </div>
    </div>
  </div>

  <!-- Meta row -->
  <div style="display:flex;padding:6px 14px;gap:20px;border-bottom:1px dashed #ccc;background:#fffdf0;font-size:10px;">
    <div><span style="color:#888;">Thanh toán: </span><strong>${paymentLabelsMap[order.paymentStatus] || order.paymentStatus}</strong></div>
    <div><span style="color:#888;">Phương thức: </span><strong>${order.paymentMethod}</strong></div>
    <div><span style="color:#888;">Trạng thái: </span><strong>${order.status}</strong></div>
    <div><span style="color:#888;">Tổng SL: </span><strong>${totalQty}</strong></div>
  </div>

  <!-- Product table -->
  <div style="padding:8px 14px;">
    <div style="font-size:9px;font-weight:700;color:#e91e8c;margin-bottom:5px;">DANH SÁCH SẢN PHẨM</div>
    <table style="width:100%;border-collapse:collapse;font-size:10px;">
      <thead>
        <tr style="background:#f0f0f0;">
          <th style="text-align:left;padding:4px 6px;border-bottom:1px solid #ccc;">STT</th>
          <th style="text-align:left;padding:4px 6px;border-bottom:1px solid #ccc;">Tên sản phẩm</th>
          <th style="text-align:center;padding:4px 6px;border-bottom:1px solid #ccc;">SL</th>
          <th style="text-align:right;padding:4px 6px;border-bottom:1px solid #ccc;">Đơn giá</th>
          <th style="text-align:right;padding:4px 6px;border-bottom:1px solid #ccc;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>

  <!-- Total -->
  <div style="display:flex;justify-content:flex-end;align-items:center;padding:8px 14px;background:#1a1a2e;color:#fff;gap:12px;">
    <span style="font-size:11px;opacity:0.8;">TỔNG CỘNG:</span>
    <span style="font-size:20px;font-weight:900;color:#ff6eb3;letter-spacing:1px;">${order.totalAmount?.toLocaleString()}₫</span>
  </div>

  <!-- Footer -->
  <div style="padding:5px 14px;font-size:9px;color:#888;text-align:center;border-top:1px solid #eee;">
    Cảm ơn quý khách đã mua hàng tại Aura Candle — auracandle.vn
  </div>

</div>
<script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; }</script>
</body>
</html>`;

    const popup = window.open("", "_blank", "width=900,height=600");
    popup.document.open();
    popup.document.write(html);
    popup.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => navigate("/seller/orders")}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Confirmed: "bg-blue-100 text-blue-700 border-blue-300",
      Shipped: "bg-indigo-100 text-indigo-700 border-indigo-300",
      Delivered: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Completed: "bg-green-100 text-green-800 border-green-300",
      Cancelled: "bg-red-100 text-red-600 border-red-300",
      Refunded: "bg-gray-100 text-gray-600 border-gray-300",
    };
    return (
      <span className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      unpaid: "bg-red-100 text-red-700 border-red-300",
      paid: "bg-green-100 text-green-700 border-green-300",
      processing: "bg-yellow-100 text-yellow-700 border-yellow-300",
      failed: "bg-gray-100 text-gray-600 border-gray-300",
      refunded: "bg-purple-100 text-purple-700 border-purple-300",
    };
    const labels = {
      unpaid: "Chưa thanh toán",
      paid: "Đã thanh toán",
      processing: "Đang xử lý",
      failed: "Thất bại",
      refunded: "Đã hoàn tiền",
    };
    return (
      <span className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const customerName = order.user?.name || order.address?.fullName || "N/A";
  const customerEmail = order.user?.email || "N/A";
  const customerPhone = order.user?.phone || "N/A";
  const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/seller/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-md hover:from-pink-600 hover:to-pink-700 active:scale-95 transition-all font-semibold text-sm"
          >
            <Printer size={16} />
            In phiếu giao hàng
          </button>
        </div>

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Order Code */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Package className="text-pink-500" size={24} />
              <h3 className="font-semibold text-gray-700">Mã đơn hàng</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{order.orderCode || order._id?.slice(-8)}</p>
            <p className="text-sm text-gray-500 mt-1">
              <Calendar size={14} className="inline mr-1" />
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingBag className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-700">Trạng thái đơn</h3>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="text-green-500" size={24} />
              <h3 className="font-semibold text-gray-700">Thanh toán</h3>
            </div>
            {getPaymentStatusBadge(order.paymentStatus)}
            <p className="text-sm text-gray-600 mt-2">
              Phương thức: <span className="font-medium">{order.paymentMethod}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <User className="text-pink-500" />
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Tên khách hàng</p>
                  <p className="font-semibold text-gray-800">{customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">{customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-800">
                    {order.address?.specificAddress || (
                      <span className="text-gray-400 italic">Chưa có thông tin địa chỉ</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <DollarSign className="text-green-500" />
              Tổng quan đơn hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tổng sản phẩm</span>
                <span className="font-semibold">{order.items?.length || 0} sản phẩm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tổng số lượng</span>
                <span className="font-semibold">{totalQty}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">{order.totalAmount?.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-pink-50 rounded-lg px-4">
                <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                <span className="text-2xl font-bold text-pink-600">
                  {order.totalAmount?.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Danh sách sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sản phẩm</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Đơn giá</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Số lượng</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.product?.name || item.name || "Sản phẩm"}
                          </p>
                          {item.product?.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-medium text-gray-700">
                        {item.price?.toLocaleString()}₫
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-pink-600">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

