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
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showCart, setShowCart] = useState(false);

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
      <div className="flex items-center gap-4 text-gray-600 relative">
        {/* Location */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <FaMapMarkerAlt />
          <span className="text-sm leading-tight">
            Giao hoặc đến lấy tại <br />
            <strong>Võ Như Hưng, Ph...</strong>
          </span>
        </div>

        {/* Search */}
        <div className="relative group cursor-pointer flex flex-col items-center"
          onClick={() => {
            setShowSearch(!showSearch);
            setShowUser(false);
            setShowCart(false);
          }}
        >
          <FaSearch className="text-lg hover:text-pink-500" />
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Tìm kiếm
          </span>
          {showSearch && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-6 w-80 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Tìm kiếm sản phẩm</h3>
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <FaSearch />
                  Tìm kiếm
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="relative group cursor-pointer flex flex-col items-center"
          onClick={() => {
            setShowUser(!showUser);
            setShowSearch(false);
            setShowCart(false);
          }}
        >
          <FaUser className="text-lg hover:text-pink-500" />
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Tài khoản
          </span>
          {/* Show User */}
          {showUser && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-6 w-80 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Đăng nhập tài khoản</h3>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors">
                    Đăng nhập
                  </button>
                </div>
                <div className="text-center">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                    Khách hàng mới? Tạo tài khoản
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="relative group cursor-pointer flex flex-col items-center"
          onClick={() => {
            setShowCart(!showCart);
            setShowSearch(false);
            setShowUser(false);
          }}
        >
          <FaShoppingCart className="text-lg hover:text-pink-500" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] px-[5px] py-[1px] rounded-full">
            0
          </span>
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Giỏ hàng
          </span>
          {showCart && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-6 w-80 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="text-center space-y-4">
                <div className="text-gray-400">
                  <FaShoppingCart className="text-4xl mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600 font-medium">Chưa có sản phẩm trong giỏ hàng</p>
                </div>
                <button className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-lg font-medium transition-all">
                  Trở về trang sản phẩm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;
