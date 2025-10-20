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
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border border-green-200">
          <h1 className="text-3xl font-serif text-green-800 mb-6 border-b pb-3">
            Giỏ hàng của bạn
          </h1>

          {/* Khi giỏ hàng trống */}
          {(!cart || cart.length === 0) && (
            <div className="text-gray-400 text-center py-20">
              <FaShoppingCart className="text-6xl mx-auto mb-4 opacity-40" />
              <p className="text-gray-500 text-lg font-medium">
                Giỏ hàng của bạn đang trống
              </p>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {cart.map((item, index) => (
            <div
              key={item.id || item._id || index}
              className="flex flex-col sm:flex-row items-center justify-between border border-green-100 rounded-2xl p-4 mb-4 shadow hover:shadow-lg transition-all bg-white/90"
            >
              {/* Ảnh + thông tin */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={
                    item.image
                      ? item.image.startsWith("https")
                        ? item.image
                        : `http://localhost:5000${item.image}`
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border border-green-100"
                />

                <div className="flex flex-col">
                  <h2 className="font-semibold text-green-800 text-lg">
                    {item.name || "Tên sản phẩm"}
                  </h2>
                  <p className="text-sm text-gray-500 italic">
                    {item.fragrance || "Không có mùi hương"}
                  </p>
                  <p className="text-emerald-600 font-bold mt-1">
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
                  className="px-3 py-1 border border-green-200 rounded-full hover:bg-green-50 transition"
                  onClick={() =>
                    updateItem(
                      item.id || item._id,
                      Math.max((item.quantity || 1) - 1, 1)
                    )
                  }
                >
                  −
                </button>
                <span className="font-medium text-lg">{item.quantity || 1}</span>
                <button
                  className="px-3 py-1 border border-green-200 rounded-full hover:bg-green-50 transition"
                  onClick={() =>
                    updateItem(item.id || item._id, (item.quantity || 1) + 1)
                  }
                >
                  +
                </button>
                <button
                  className="ml-3 text-red-500 hover:text-red-600 transition font-semibold"
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
                className="w-full border border-green-200 rounded-2xl p-3 focus:ring-2 focus:ring-green-300 outline-none transition"
                rows="3"
                placeholder="Nhập ghi chú của bạn..."
              />
            </div>
          )}
        </div>

        {/* --- Cột phải: Tổng kết --- */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-green-200 h-fit sticky top-10">
          <h2 className="text-xl font-serif text-green-800 mb-4 border-b pb-2">
            Thông tin đơn hàng
          </h2>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Tổng tiền:</span>
            <span className="font-bold text-emerald-600 text-lg">
              {total.toLocaleString()}₫
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Phí vận chuyển sẽ được tính ở bước thanh toán.
          </p>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all mb-4"
          >
            THANH TOÁN
          </button>

          {/* Mã khuyến mãi */}
          <div className="mt-4">
            <p className="font-medium text-green-800 mb-2">Mã khuyến mãi</p>
            <div className="flex flex-wrap gap-2">
              {["Giảm 5k", "Giảm 50k", "Giảm 30k"].map((m) => (
                <button
                  key={m}
                  className="border border-green-400 text-green-600 px-3 py-1 rounded-full hover:bg-green-50 text-sm transition"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú thêm */}
          <div className="mt-6 bg-emerald-50 text-sm text-gray-700 p-4 rounded-2xl">
            Áp dụng cho đơn hàng tối thiểu{" "}
            <span className="font-semibold text-green-700">59.000₫</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
