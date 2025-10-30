import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartPie,
  FaShoppingBag,
  FaSignOutAlt,
  FaFlask,
  FaTags,
  FaNewspaper,
} from "react-icons/fa";

export default function SellerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { path: "/seller/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { path: "/seller/products", label: "Sản phẩm", icon: <FaBoxOpen /> },
    { path: "/seller/categories", label: "Danh mục", icon: <FaTags /> },
    { path: "/seller/materials", label: "Nguyên liệu", icon: <FaFlask /> },
    { path: "/seller/orders", label: "Đơn hàng", icon: <FaShoppingBag /> },
    { path: "/seller/blogs", label: "Bài viết", icon: <FaNewspaper /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 p-5 flex flex-col shadow-sm">
      {/* Logo / Title */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center rounded-xl font-bold text-lg">
          S
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Seller Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 text-gray-700 font-medium">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-pink-100 text-pink-600 border-l-4 border-pink-500"
                  : "hover:bg-pink-50 hover:text-pink-600"
                }`}
            >
              <span className={`text-lg ${isActive ? "text-pink-600" : "text-gray-500"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-8 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all px-4 py-2 rounded-xl w-full hover:bg-red-50"
        >
          <FaSignOutAlt />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
