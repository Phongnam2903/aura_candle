import { useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSignOutAlt,
  FaTimes,
  FaBell,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { searchProducts } from "../../api/products/productApi";
import {
  getNotifications,
  markAllRead,
  markNotificationAsRead,
} from "../../api/notification/notificationApi";

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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearch(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchTerm.trim()) return setSearchResults([]);
      const fetchData = async () => {
        setLoadingSearch(true);
        try {
          const data = await searchProducts(searchTerm);
          setSearchResults(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingSearch(false);
        }
      };
      fetchData();
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchData();
  }, []);

  const handleOpenDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E7E2DC] shadow-sm transition-all duration-300">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/logo_2.png"
            alt="Aura Candle"
            className="w-[15rem] h-[8rem] object-contain rounded-2xl"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium tracking-wide text-[#2C2420]">
          <Link
            to="/"
            className="hover:text-[#A0785D] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#A0785D] hover:after:w-full after:transition-all"
          >
            Trang chủ
          </Link>

          <div className="relative group">
            <button className="hover:text-[#A0785D] transition-colors">
              Sản phẩm
            </button>
            <div className="absolute left-0 top-full mt-3 w-56 bg-white border border-[#E7E2DC] rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <Link
                to="/product/category/nen-thom"
                className="block px-6 py-3 hover:bg-[#F9F6F2] rounded-t-2xl"
              >
                Nến thơm
              </Link>
              <Link
                to="/product/category/set-qua-tang"
                className="block px-6 py-3 hover:bg-[#F9F6F2]"
              >
                Set quà tặng
              </Link>
            </div>
          </div>

          <Link
            to="/about"
            className="hover:text-[#A0785D] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#A0785D] hover:after:w-full after:transition-all"
          >
            Giới thiệu
          </Link>

          <Link
            to="/blog"
            className="hover:text-[#A0785D] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#A0785D] hover:after:w-full after:transition-all"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 text-[#2C2420]">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:text-[#A0785D] transition"
            >
              <FaSearch className="text-[18px]" />
            </button>
            {showSearch && (
              <div className="absolute right-0 top-full mt-3 w-[350px] bg-white border border-[#E7E2DC] rounded-2xl shadow-xl p-4 animate-fadeIn">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3.5 text-[#A0785D]/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm nến thơm..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E5E0DA] bg-[#FAF9F7] text-sm focus:ring-2 focus:ring-[#A0785D]/50 outline-none"
                  />
                </div>
                <div className="mt-3 max-h-[300px] overflow-y-auto">
                  {loadingSearch ? (
                    <p className="text-center text-sm py-3 text-[#6B6560]">
                      Đang tìm kiếm...
                    </p>
                  ) : searchTerm && searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <Link
                        to={`/product/${p._id}`}
                        key={p._id}
                        onClick={() => setShowSearch(false)}
                        className="flex items-center gap-3 py-2 px-2 hover:bg-[#F7F5F3] rounded-lg transition"
                      >
                        <img
                          src={p.images[0] || "/placeholder.svg"}
                          alt={p.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-[#2C2420] line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[13px] text-[#A0785D] font-semibold">
                            {p.price?.toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-sm py-3 text-[#6B6560]">
                      Không tìm thấy sản phẩm
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative group">
            {user ? (
              <>
                <button className="p-2 hover:text-[#A0785D] transition">
                  <FaUser className="text-[18px]" />
                </button>
                <div className="absolute right-0 top-full mt-3 w-60 bg-white border border-[#E7E2DC] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-5 py-3 border-b border-[#F1ECE5] font-semibold text-[#2C2420] text-sm">
                    {user.name}
                  </div>
                  <ul className="py-2 text-[14px]">
                    <li>
                      <Link
                        to={`/profile/${user._id}`}
                        className="block px-5 py-2 hover:bg-[#F9F6F2]"
                      >
                        Tài khoản của tôi
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-2 flex items-center gap-2 hover:bg-[#F9F6F2] text-[#A0785D]"
                      >
                        <FaSignOutAlt className="text-[13px]" /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="p-2 hover:text-[#A0785D] transition">
                <FaUser className="text-[18px]" />
              </Link>
            )}
          </div>

          {/* Notification */}
          <div className="relative">
            <button
              className="p-2 hover:text-[#A0785D] transition relative"
              onClick={handleOpenDropdown}
            >
              <FaBell className="text-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-[5px] py-[1px] rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-[#E7E2DC] rounded-2xl shadow-xl animate-fadeIn">
                <div className="px-4 py-3 border-b border-[#F1ECE5] font-semibold text-[#2C2420] text-sm">
                  Thông báo
                </div>
                <ul className="max-h-64 overflow-y-auto text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <li
                        key={n._id}
                        onClick={async () => {
                          if (!n.isRead) {
                            await markNotificationAsRead(n._id);
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item._id === n._id
                                  ? { ...item, isRead: true }
                                  : item
                              )
                            );
                            setUnreadCount((prev) => Math.max(prev - 1, 0));
                          }
                          navigate(`/notification/${n._id}`);
                        }}
                        className={`px-4 py-3 cursor-pointer transition ${n.isRead ? "bg-white" : "bg-[#F9F6F2]"
                          } hover:bg-[#F1ECE5]`}
                      >
                        <strong>{n.title}</strong>
                        <div className="text-gray-500 text-xs">{n.message}</div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-400 text-sm">
                      Không có thông báo
                    </li>
                  )}
                </ul>
                <div className="border-t border-[#F1ECE5] px-4 py-2 text-center">
                  <button
                    onClick={async () => {
                      await markAllRead();
                      setUnreadCount(0);
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, isRead: true }))
                      );
                    }}
                    className="text-[#A0785D] text-sm font-medium hover:underline"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:text-[#A0785D] transition">
            <FaShoppingCart className="text-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#A0785D] text-white text-[10px] font-semibold px-[6px] py-[2px] rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:text-[#A0785D] transition"
          >
            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E7E2DC] shadow-md">
          <nav className="px-6 py-4 space-y-3 text-[#2C2420] font-medium">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 hover:text-[#A0785D]"
            >
              Trang chủ
            </Link>
            <details className="group">
              <summary className="cursor-pointer py-2 hover:text-[#A0785D]">
                Sản phẩm
              </summary>
              <div className="pl-4 space-y-2">
                <Link
                  to="/product/category/nen-thom"
                  className="block py-1 hover:text-[#A0785D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nến thơm
                </Link>
                <Link
                  to="/product/category/set-qua-tang"
                  className="block py-1 hover:text-[#A0785D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Set quà tặng
                </Link>
                <Link
                  to="/product/category/phu-kien"
                  className="block py-1 hover:text-[#A0785D]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Phụ kiện
                </Link>
              </div>
            </details>
            <Link to="/about" className="block py-2 hover:text-[#A0785D]" onClick={() => setIsMenuOpen(false)}>Giới thiệu</Link>
            <Link to="/blog" className="block py-2 hover:text-[#A0785D]" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          </nav>
        </div>
      )}
    </header>

  );
};

export default Header;
