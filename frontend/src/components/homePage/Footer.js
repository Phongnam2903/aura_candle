import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTruck,
  FaHeadset,
  FaCreditCard,
  FaUndo,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white ">
      {/* --- 4 ô hỗ trợ --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-6 md:px-20 text-center border-b border-[#E7E2DC]">
        {[
          { icon: <FaHeadset />, title: "Hỗ trợ 24/7", text: "Hotline: 079 991 2304" },
          { icon: <FaTruck />, title: "Giao hàng miễn phí", text: "Đơn trên 350K" },
          { icon: <FaCreditCard />, title: "Thanh toán đa dạng", text: "COD, Momo, Banking" },
          { icon: <FaUndo />, title: "Đổi trả dễ dàng", text: "Trong 15 ngày" },
        ].map((item, i) => (
          <div
            key={i}
            className="group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#F1E9E1] text-[#A0785D] text-2xl group-hover:bg-[#A0785D] group-hover:text-white transition-all duration-300 shadow-sm">
              {item.icon}
            </div>
            <h5 className="font-semibold text-base mb-1">{item.title}</h5>
            <p className="text-sm text-gray-500">{item.text}</p>
          </div>
        ))}
      </div>

      {/* --- Phần chính --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-6 md:px-20 text-sm">
        {/* --- Cột 1: Giới thiệu --- */}
        <div>
          <img
            src="/assets/logo_2.png"
            alt="Aura Candle"
            className="w-[150px] mb-5"
          />
          <p className="text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#2C2420]">Aura Candles</span> mang đến nến thơm và tinh dầu thiên nhiên giúp bạn thư giãn, tái tạo năng lượng và làm đẹp không gian sống mỗi ngày.
          </p>
          <p className="mt-4 text-sm font-medium">
            📞 079 991 2304 <br /> ✉️ support@auracandles.vn
          </p>
        </div>

        {/* --- Cột 2: Hỗ trợ khách hàng --- */}
        <div>
          <h5 className="font-semibold text-lg mb-4">Hỗ trợ khách hàng</h5>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-[#A0785D] transition">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#A0785D] transition">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#A0785D] transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#A0785D] transition">
                Chính sách vận chuyển
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Cột 3: Liên kết nhanh --- */}
        <div>
          <h5 className="font-semibold text-lg mb-4">Liên kết nhanh</h5>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-[#A0785D] transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#A0785D] transition">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/product/category/nen-thom" className="hover:text-[#A0785D] transition">
                Nến thơm
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-[#A0785D] transition">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#A0785D] transition">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Mạng xã hội --- */}
      <div className="text-center py-10 border-t border-[#E7E2DC]">
        <h5 className="font-medium mb-5 text-[#2C2420]">Kết nối với chúng tôi</h5>
        <div className="flex justify-center gap-4 text-xl mb-6">
          {[
            { icon: <FaFacebookF />, link: "https://www.facebook.com/profile.php?id=61580658016979" },
            { icon: <FaInstagram />, link: "#" },
            { icon: <FaYoutube />, link: "#" },
            { icon: <FaTiktok />, link: "#" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F1E9E1] text-[#A0785D] hover:bg-[#A0785D] hover:text-white transition-all duration-300 shadow-sm"
            >
              {item.icon}
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          © 2025 Aura Candle. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
