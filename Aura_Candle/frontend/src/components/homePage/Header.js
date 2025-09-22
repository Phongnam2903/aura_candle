import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaBars,
} from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center relative">
      {/* Left: Hamburger menu (mobile) */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Logo */}
      <h1 className="text-2xl font-bold text-pink-500 text-gray-800">Aura Candle</h1>

      {/* Navigation */}
      <nav
        className={`${isMenuOpen
          ? "absolute top-full left-0 w-full bg-white shadow-md p-4 md:hidden z-50"
          : "hidden md:flex"
          }`}
      >
        <ul className="flex flex-col gap-4 md:flex-row md:gap-6 text-gray-700 font-medium">
          <li className="text-pink-600 cursor-pointer">Trang chủ</li>
          <li className="cursor-pointer hover:text-pink-500">Nến Thơm</li>
          <li className="cursor-pointer hover:text-pink-500">Set Quà Tặng</li>
          <li className="cursor-pointer hover:text-pink-500">Phụ Kiện</li>
          <li className="cursor-pointer hover:text-pink-500">Giới thiệu</li>
          <li className="cursor-pointer hover:text-pink-500">Blog</li>
        </ul>
      </nav>

      {/* Right icons */}
      <div className="flex items-center gap-4 text-gray-600">
        {/* Location */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <FaMapMarkerAlt />
          <span className="text-sm leading-tight">
            Giao hoặc đến lấy tại <br />
            <strong>Võ Như Hưng, Ph...</strong>
          </span>
        </div>

        {/* Search */}
        <div className="relative group cursor-pointer flex flex-col items-center">
          <FaSearch className="text-lg hover:text-pink-500" />
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Tìm kiếm
          </span>
        </div>

        {/* User */}
        <div className="relative group cursor-pointer flex flex-col items-center">
          <FaUser className="text-lg hover:text-pink-500" />
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Tài khoản
          </span>
        </div>

        {/* Cart */}
        <div className="relative group cursor-pointer flex flex-col items-center">
          <FaShoppingCart className="text-lg hover:text-pink-500" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] px-[5px] py-[1px] rounded-full">
            0
          </span>
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Giỏ hàng
          </span>
        </div>
      </div>

    </header>
  );
};

export default Header;
