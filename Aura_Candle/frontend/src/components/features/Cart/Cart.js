import React from "react";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CartPage() {
  const { cart, removeItem, updateItem } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Vui lòng đăng nhập trước khi mua hàng!");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Giỏ hàng --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h1 className="text-2xl font-serif text-green-800 mb-6">
            Giỏ hàng của bạn
          </h1>

          {/* Khi giỏ hàng trống */}
          {(!cart || cart.length === 0) && (
            <div className="text-gray-400 text-center py-16">
              <FaShoppingCart className="text-5xl mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 font-medium">
                Giỏ hàng của bạn đang trống
              </p>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {cart.map((item, index) => (
            <div
              key={item.id || item._id || index}
              className="flex flex-col sm:flex-row items-center justify-between border border-green-100 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all bg-white/80"
            >
              {/* Ảnh + thông tin */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.image
                      ? item.image.startsWith("https")
                        ? item.image
                        : `http://localhost:5000${item.image}`
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-green-100"
                />

                <div>
                  <h2 className="font-semibold text-green-800">
                    {item.name || "Tên sản phẩm"}
                  </h2>
                  <p className="text-sm text-gray-500 italic">
                    {item.fragrance || "Không có mùi hương"}
                  </p>
                  <p className="text-emerald-600 font-bold">
                    {(item.price || 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫
                  </p>
                </div>
              </div>

              {/* Nút tăng giảm + xóa */}
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <button
                  className="px-3 py-1 border border-green-200 rounded hover:bg-green-50"
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
                  className="px-3 py-1 border border-green-200 rounded hover:bg-green-50"
                  onClick={() =>
                    updateItem(item.id || item._id, (item.quantity || 1) + 1)
                  }
                >
                  +
                </button>
                <button
                  className="ml-3 text-red-500 hover:text-red-600 transition"
                  onClick={() => removeItem(item.id || item._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {/* Ghi chú */}
          {cart.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-green-800 mb-2">
                Ghi chú đơn hàng
              </label>
              <textarea
                className="w-full border border-green-100 rounded-xl p-3 focus:ring-2 focus:ring-green-300"
                rows="3"
                placeholder="Nhập ghi chú của bạn..."
              />
            </div>
          )}
        </div>

        {/* --- Cột phải: Tổng kết --- */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100 h-fit">
          <h2 className="text-lg font-serif text-green-800 mb-4">
            Thông tin đơn hàng
          </h2>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Tổng tiền:</span>
            <span className="font-bold text-emerald-600">
              {total.toLocaleString()}₫
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Phí vận chuyển sẽ được tính ở bước thanh toán.
          </p>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition-all"
          >
            THANH TOÁN
          </button>

          {/* Mã khuyến mãi */}
          <div className="mt-6">
            <p className="font-medium text-green-800 mb-2">Mã khuyến mãi</p>
            <div className="flex flex-wrap gap-2">
              {["Giảm 5k", "Giảm 50k", "Giảm 30k"].map((m) => (
                <button
                  key={m}
                  className="border border-green-400 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50 text-sm transition"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú thêm */}
          <div className="mt-6 bg-emerald-50 text-sm text-gray-700 p-4 rounded-xl">
            Áp dụng cho đơn hàng tối thiểu{" "}
            <span className="font-semibold text-green-700">59.000₫</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
