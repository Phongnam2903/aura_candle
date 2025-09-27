import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaChartPie, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";

export default function SellerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-bold text-pink-600 mb-8">Seller Panel</h2>
      <nav className="flex flex-col gap-4 text-gray-700">
        <Link to="/seller/dashboard" className="flex items-center gap-2 hover:text-pink-500">
          <FaChartPie /> Dashboard
        </Link>
        <Link to="/seller/products" className="flex items-center gap-2 hover:text-pink-500">
          <FaBoxOpen /> Sản phẩm
        </Link>
        <Link to="/seller/orders" className="flex items-center gap-2 hover:text-pink-500">
          <FaShoppingBag /> Đơn hàng
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-left hover:text-pink-500 mt-auto"
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </nav>
    </aside>
  );
}
