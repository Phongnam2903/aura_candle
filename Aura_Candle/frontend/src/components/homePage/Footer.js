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

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-16">
      {/* Đăng ký nhận tin */}
      <div className="bg-white py-6 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center border-b">
        <h4 className="text-lg font-semibold mb-3 md:mb-0">
          Đăng ký nhận tin
        </h4>
        <div className="flex w-full md:w-1/2">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button className="px-6 py-2 bg-pink-500 text-white font-medium rounded-r-lg hover:bg-pink-600 transition">
            Đăng ký
          </button>
        </div>
      </div>

      {/* 4 ô hỗ trợ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-10 px-6 md:px-20 text-center border-b">
        <div>
          <FaHeadset className="mx-auto text-2xl mb-2" />
          <h5 className="font-semibold">Hỗ trợ 24/7</h5>
          <p className="text-sm">Hotline: 0377.555.000</p>
        </div>
        <div>
          <FaTruck className="mx-auto text-2xl mb-2" />
          <h5 className="font-semibold">Giao hàng miễn phí</h5>
          <p className="text-sm">Đơn hàng trên 350K</p>
        </div>
        <div>
          <FaCreditCard className="mx-auto text-2xl mb-2" />
          <h5 className="font-semibold">Thanh toán đa dạng</h5>
          <p className="text-sm">COD, Momo, Banking</p>
        </div>
        <div>
          <FaUndo className="mx-auto text-2xl mb-2" />
          <h5 className="font-semibold">Đổi trả dễ dàng</h5>
          <p className="text-sm">Trong 15 ngày</p>
        </div>
      </div>

      {/* Footer chính */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-6 md:px-20">
        {/* Về Chillime */}
        <div>
          <h5 className="font-semibold mb-4">Về Chillime</h5>
          <p className="text-sm leading-relaxed">
            Chillime ra đời với mong muốn mang đến các dòng sản phẩm nến thơm,
            tinh dầu chất lượng giúp bạn thư giãn, cân bằng trong cuộc sống.
          </p>
          <p className="mt-2 text-sm">Hotline: 0377.555.000</p>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h5 className="font-semibold mb-4">Hỗ trợ khách hàng</h5>
          <ul className="space-y-2 text-sm">
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </div>

        {/* Liên kết */}
        <div>
          <h5 className="font-semibold mb-4">Liên kết</h5>
          <ul className="space-y-2 text-sm">
            <li>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Sản phẩm</li>
            <li>Tin tức</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h5 className="font-semibold mb-4">Chính sách</h5>
          <ul className="space-y-2 text-sm">
            <li>Tìm kiếm</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách vận chuyển</li>
          </ul>
        </div>
      </div>

      {/* Kết nối mạng xã hội */}
      <div className="text-center py-6 border-t">
        <h5 className="font-semibold mb-3">Kết nối với chúng tôi</h5>
        <div className="flex justify-center space-x-6 text-xl">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaYoutube /></a>
          <a href="#"><FaTiktok /></a>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          © 2025 Cửa hàng Nến Thơm. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
