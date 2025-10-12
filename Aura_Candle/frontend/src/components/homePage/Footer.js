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
    <footer className="bg-gradient-to-b from-white to-gray-50 text-gray-700">
      {/* Đăng ký nhận tin */}
      <div className="py-10 px-6 md:px-20 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
      </div>

      {/* 4 ô hỗ trợ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-6 md:px-20 text-center border-b border-gray-200">
        {[
          { icon: <FaHeadset />, title: "Hỗ trợ 24/7", text: "Hotline: 0377.555.000" },
          { icon: <FaTruck />, title: "Giao hàng miễn phí", text: "Đơn trên 350K" },
          { icon: <FaCreditCard />, title: "Thanh toán đa dạng", text: "COD, Momo, Banking" },
          { icon: <FaUndo />, title: "Đổi trả dễ dàng", text: "Trong 15 ngày" },
        ].map((item, i) => (
          <div
            key={i}
            className="group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-accent/10 text-accent text-2xl group-hover:bg-accent group-hover:text-black transition-all duration-300">
              {item.icon}
            </div>
            <h5 className="font-semibold text-lg mb-1">{item.title}</h5>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Footer chính */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-16 px-6 md:px-20 text-sm">
        <div>
          <h5 className="font-semibold text-lg mb-4">Về Aura Candles</h5>
          <p className="text-muted-foreground leading-relaxed">
            <span className="font-semibold text-[#2C2420]">Aura Candles</span> mang đến những sản phẩm nến thơm và tinh dầu thiên nhiên giúp bạn thư giãn, tái tạo năng lượng và làm đẹp không gian sống.
          </p>
          <p className="mt-4 text-sm text-foreground font-medium">
            📞 Hotline: 0377.555.000
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-lg mb-4">Hỗ trợ khách hàng</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="#" className="hover:text-accent transition">Hướng dẫn mua hàng</Link></li>
            <li><Link to="#" className="hover:text-accent transition">Chính sách bảo mật</Link></li>
            <li><Link to="#" className="hover:text-accent transition">Chính sách đổi trả</Link></li>
            <li><Link to="#" className="hover:text-accent transition">Chính sách bảo hành</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-lg mb-4">Liên kết nhanh</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-accent transition">Trang chủ</Link></li>
            <li><Link to="/about" className="hover:text-accent transition">Giới thiệu</Link></li>
            <li><Link to="/products" className="hover:text-accent transition">Sản phẩm</Link></li>
            <li><Link to="/news" className="hover:text-accent transition">Tin tức</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-lg mb-4">Chính sách</h5>
          <ul className="space-y-2 text-muted-foreground">
            <li>Tìm kiếm</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </div>
      </div>

      {/* Mạng xã hội */}
      <div className="text-center py-8 border-t border-gray-200">
        <h5 className="font-medium mb-4 text-foreground">Kết nối với chúng tôi</h5>
        <div className="flex justify-center gap-5 text-xl mb-6">
          {[
            { icon: <FaFacebookF />, link: "#" },
            { icon: <FaInstagram />, link: "#" },
            { icon: <FaYoutube />, link: "#" },
            { icon: <FaTiktok />, link: "#" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-black transition-all duration-300"
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
