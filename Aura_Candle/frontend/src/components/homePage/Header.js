import React, { useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { searchProducts } from "../../api/products/productApi";

const Header = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Đóng popup khi click ra ngoài
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Hàm đăng xuất ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  // --- Hàm search (với debounce 500ms) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      const fetchResults = async () => {
        setLoadingSearch(true);
        try {
          const results = await searchProducts(searchTerm);
          setSearchResults(results);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSearch(false);
        }
      };
      fetchResults();
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
      <h1 className="text-2xl font-bold text-pink-500 text-gray-800">
        Aura Candle
      </h1>

      {/* Navigation */}
      <nav
        className={`${isMenuOpen
          ? "absolute top-full left-0 w-full bg-white shadow-md p-4 md:hidden z-50"
          : "hidden md:flex"
          }`}
      >
        <ul className="flex flex-col gap-4 md:flex-row md:gap-6 text-gray-700 font-medium">
          <li>
            <Link
              to="/"
              className="text-pink-600 hover:text-pink-500 transition"
            >
              Trang chủ
            </Link>
          </li>
          <li className="cursor-pointer hover:text-pink-500">Nến Thơm</li>
          <li className="cursor-pointer hover:text-pink-500">Set Quà Tặng</li>
          <li className="cursor-pointer hover:text-pink-500">Phụ Kiện</li>
          <li className="cursor-pointer hover:text-pink-500">Giới thiệu</li>
          <li>
            <Link to="/blog" className="cursor-pointer hover:text-pink-500">
              Blog
            </Link>
          </li>
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

        {/* User + Dropdown */}
        <div className="relative group">
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer">
              <FaUser className="text-lg text-gray-700" />

              <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 border-b font-semibold text-gray-700 text-center">
                  THÔNG TIN TÀI KHOẢN
                </div>
                <div className="px-4 py-2 text-center text-sm text-gray-800 font-medium">
                  {user.name}
                </div>
                <ul className="text-sm text-gray-700">
                  <li>
                    <Link
                      to={`/profile/${user._id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Tài khoản của tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Thông tin hạng thành viên
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/profile/${user._id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Danh sách địa chỉ
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="relative flex flex-col items-center group"
            >
              <FaUser className="text-lg hover:text-pink-500" />
              <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                Tài khoản
              </span>
            </Link>
          )}
        </div>

        {/* Search */}
        <div
          ref={searchRef}
          className="relative group cursor-pointer flex flex-col items-center"
        >
          <FaSearch
            className="text-lg hover:text-pink-500"
            onClick={() => setShowSearch(!showSearch)}
          />
          <span className="absolute top-full mt-2 bg-gray-800 text-white text-[11px] rounded px-2 py-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
            Tìm kiếm
          </span>

          {showSearch && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-80 z-50">
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />

              {loadingSearch && (
                <div className="mt-2 text-gray-500 text-sm">Đang tìm kiếm...</div>
              )}
              {!loadingSearch && searchTerm && (
                <div className="mt-2 max-h-80 overflow-y-auto border-t border-gray-200 shadow-lg rounded-b-lg bg-white">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-pink-50 transition-colors border-b last:border-b-0"
                        onClick={() => setShowSearch(false)}
                      >
                        {/* Ảnh sản phẩm */}
                        <img
                          src={`http://localhost:5000${product.images[0]}`}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />

                        {/* Tên sản phẩm + giá */}
                        <div className="flex-1 flex flex-col">
                          <span className="text-gray-800 font-medium">{product.name}</span>
                          {product.price && (
                            <span className="text-pink-600 font-semibold text-sm">
                              {product.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-gray-500 text-sm text-center">
                      Không tìm thấy sản phẩm
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="relative group cursor-pointer flex flex-col items-center">
          <Link to="/cart">
            <FaShoppingCart className="text-lg hover:text-pink-500" />
          </Link>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] px-[5px] py-[1px] rounded-full">
            {totalItems}
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
