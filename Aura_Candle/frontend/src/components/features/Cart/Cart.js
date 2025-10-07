import React from "react";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const { cart, removeItem, updateItem } = useCart();
  const navigate = useNavigate();

  // TÍNH TỔNG TIỀN
  const total = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

  const handleCheckout = () => {
    const token = localStorage.getItem("token"); // hoặc lấy từ AuthContext
    if (!token) {
      // Nếu chưa đăng nhập
      alert("⚠️ Vui lòng đăng nhập trước khi thanh toán!");
      navigate("/login"); // chuyển sang trang login
    } else {
      navigate("/checkout"); // cho sang checkout
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- Cột trái: danh sách sản phẩm trong giỏ --- */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

        {/* Khi giỏ hàng trống */}
        {(!cart || cart.length === 0) && (
          <div className="text-gray-400 text-center">
            <FaShoppingCart className="text-4xl mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 font-medium">
              Chưa có sản phẩm trong giỏ hàng
            </p>
          </div>
        )}

        {/* Danh sách sản phẩm */}
        {cart.map((item, index) => (
          <div
            key={item.id || item._id || index}
            className="flex items-center justify-between border rounded p-4 mb-4"
          >
            {/* --- Ảnh + thông tin sản phẩm --- */}
            <div className="flex items-center gap-4">
              <img
                src={
                  item.image ||
                  (Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : "https://via.placeholder.com/80")
                }
                alt={item.name || "Sản phẩm"}
                className="w-20 h-20 object-cover rounded"
              />

              <div>
                <h2 className="font-semibold text-gray-800">
                  {item.name || "Tên sản phẩm"}
                </h2>
                <p className="text-sm text-gray-500">
                  {item.fragrance || "Không có mùi hương"}
                </p>
                <p className="text-pink-600 font-bold">
                  {(item.price || 0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  ₫
                </p>
              </div>
            </div>

            {/* --- Nút tăng/giảm số lượng + xóa --- */}
            <div className="flex items-center gap-3">
              <button
                className="px-2 py-1 border rounded"
                onClick={() =>
                  updateItem(
                    item.id || item._id,
                    Math.max((item.quantity || 1) - 1, 1)
                  )
                }
              >
                −
              </button>
              <span className="font-medium">{item.quantity || 1}</span>
              <button
                className="px-2 py-1 border rounded"
                onClick={() =>
                  updateItem(item.id || item._id, (item.quantity || 1) + 1)
                }
              >
                +
              </button>
              <button
                className="ml-4 text-red-500"
                onClick={() => removeItem(item.id || item._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}

        {/* Ghi chú đơn hàng */}
        {cart.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Ghi chú đơn hàng
            </label>
            <textarea
              className="w-full border rounded p-3"
              rows="3"
              placeholder="Nhập ghi chú của bạn..."
            />
          </div>
        )}
      </div>

      {/* --- Cột phải: Thông tin thanh toán --- */}
      <div className="bg-gray-50 p-6 rounded h-fit">
        <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>

        <div className="flex justify-between mb-2">
          <span>Tổng tiền:</span>
          <span className="font-bold text-pink-600">
            {total.toLocaleString()}₫
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Phí vận chuyển sẽ được tính ở trang thanh toán.
        </p>

        <button
          onClick={handleCheckout}
          className="w-full text-center bg-pink-600 hover:bg-pink-700 text-white py-3 rounded font-semibold"
        >
          THANH TOÁN
        </button>

        <div className="mt-6">
          <p className="font-medium mb-2">Mã khuyến mãi</p>
          <div className="flex flex-wrap gap-2">
            {["Giảm 5k", "Giảm 50k", "Giảm 30k"].map((m) => (
              <button
                key={m}
                className="border border-pink-500 text-pink-600 px-3 py-1 rounded hover:bg-pink-50 text-sm"
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 text-sm text-gray-700 p-4 rounded">
          Hiện chỉ áp dụng thanh toán với đơn hàng tối thiểu{" "}
          <span className="font-semibold">59.000₫</span>.
        </div>
      </div>
    </div>
  );
}
