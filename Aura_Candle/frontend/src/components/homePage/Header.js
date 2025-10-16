import { useEffect, useState, useRef } from "react"
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaSignOutAlt, FaTimes, FaBell } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { searchProducts } from "../../api/products/productApi"
import { getNotifications, markAllRead, markNotificationAsRead } from "../../api/notification/notificationApi"

const Header = () => {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 1), 0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    navigate("/")
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchTerm.trim()) return setSearchResults([])
      const fetchData = async () => {
        setLoadingSearch(true)
        try {
          const data = await searchProducts(searchTerm)
          setSearchResults(data)
        } catch (e) {
          console.error(e)
        } finally {
          setLoadingSearch(false)
        }
      }
      fetchData()
    }, 400)
    return () => clearTimeout(delay)
  }, [searchTerm])

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

  // Khi người dùng click chuông => đánh dấu đã đọc

  const handleOpenDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-[#E7E2DC] shadow-sm transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/image.png"
            alt="Aura Candle Logo"
            className="w-[14rem] h-[7rem] object-contain rounded-2xl shadow-sm"
            style={{ imageRendering: "high-quality" }}
          />
        </Link>


        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#2C2420]">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/product/category/nen-thom", label: "Nến thơm" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/blog", label: "Blog" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="relative hover:text-[#A0785D] transition-colors after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#A0785D] hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </Link>
          ))}
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
              <div className="absolute top-full right-0 mt-3 w-[350px] bg-white rounded-2xl shadow-2xl border border-[#E5E0DA] p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3.5 text-[#A0785D]/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E5E0DA] bg-[#FAF9F7] text-sm focus:ring-2 focus:ring-[#A0785D] outline-none"
                  />
                </div>

                <div className="mt-3 max-h-[350px] overflow-y-auto">
                  {loadingSearch ? (
                    <p className="text-sm text-[#6B6560] py-3 text-center">Đang tìm kiếm...</p>
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
                        <div className="flex flex-col text-left">
                          <span className="text-[14px] font-medium text-[#2C2420] line-clamp-1">{p.name}</span>
                          <span className="text-[13px] text-[#A0785D] font-semibold">
                            {p.price?.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    searchTerm && (
                      <p className="text-sm text-[#6B6560] py-3 text-center">Không tìm thấy sản phẩm</p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            {user ? (
              <>
                <button className="p-2 hover:text-[#A0785D] transition">
                  <FaUser className="text-[18px]" />
                </button>
                <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-[#E7E2DC] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-5 py-3 border-b border-[#F1ECE5] font-semibold text-[#2C2420] text-sm">
                    {user.name}
                  </div>
                  <ul className="py-2 text-[14px]">
                    <li>
                      <Link
                        to={`/profile/${user._id}`}
                        className="block px-5 py-2 hover:bg-[#F9F6F2] transition"
                      >
                        Tài khoản của tôi
                      </Link>
                    </li>
                    <li>
                      <Link to="/#" className="block px-5 py-2 hover:bg-[#F9F6F2] transition">
                        Hạng thành viên
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-2 flex items-center gap-2 hover:bg-[#F9F6F2] transition text-[#A0785D]"
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-[5px] py-[1px] rounded-full min-w-[16px] text-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-[#E7E2DC] rounded-2xl shadow-2xl rounded-xl z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-[#F1ECE5] font-semibold text-[#2C2420] text-sm">
                  Thông báo
                </div>
                <ul className="max-h-64 overflow-y-auto text-sm">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <li
                        key={n._id}
                        onClick={async () => {
                          try {
                            // Nếu chưa đọc thì đánh dấu đã đọc
                            if (!n.isRead) {
                              await markNotificationAsRead(n._id);
                              setNotifications((prev) =>
                                prev.map((item) =>
                                  item._id === n._id ? { ...item, isRead: true } : item
                                )
                              );
                              setUnreadCount((prev) => Math.max(prev - 1, 0));
                            }

                            // Chuyển sang trang chi tiết
                            navigate(`/notification/${n._id}`);
                          } catch (err) {
                            console.error("Error marking notification:", err);
                          }
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
                    className="text-[#A0785D] text-sm font-medium hover:underline transition"
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

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:text-[#A0785D] transition"
          >
            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E7E2DC] shadow-md">
          <nav className="px-6 py-4 space-y-3 text-[#2C2420] font-medium">
            {[
              { to: "/", label: "Trang chủ" },
              { to: "/product/category/nen-thom", label: "Nến thơm" },
              { to: "/#", label: "Set quà tặng" },
              { to: "/#", label: "Phụ kiện" },
              { to: "/#", label: "Giới thiệu" },
              { to: "/blog", label: "Blog" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="block py-2 hover:text-[#A0785D] transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
