import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Content = () => {


  // Danh mục sản phẩm
  const categories = [
    {
      name: "Nến thơm cốc thủy tinh",
      img: "https://muamuaonline.com/upload/deals/files/1136-nen-thom-trong-ly-thuy-tinh-giup-giam-cang-thang_1308473456.jpg",
    },
    {
      name: "Nến thơm hộp thiếc",
      img: "https://img.lazcdn.com/g/p/78ef4f6136be0f6dfec1c9f30af3c01e.jpg_720x720q80.jpg",
    },
    {
      name: "Set quà tặng",
      img: "https://www.onatree.vn/cdn/shop/products/z3511810996034_421f7283444826bfe57f41ad5988a342_1200x1200.jpg?v=1721008448",
    },
    {
      name: "Tinh dầu thơm",
      img: "https://product.hstatic.net/200000666175/product/ch_tan_qua_tang_sinh_nhat_nguoi_yeu_ban_gai_dam_cuoi_thu_gian_vintage4_393f9b5ae3cd4c459461e1ba30761f0f_master.jpg",
    },
  ];

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const swiperRef = useRef(null);
  // Sản phẩm nổi bật
  const featuredProducts = [
    {
      id: 1,
      name: "Hoa nhài",
      img: "https://nenthomagaya.com/wp-content/uploads/2021/11/nen-thom-agaya-candle-cup-thu-duc-72.jpeg",
      price: "150.000đ",
    },
    {
      id: 2,
      name: "Oải hương",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWD67Bj8YhPkh_8uJxqXNd_5cjzyYRFVIscg&s",
      price: "150.000đ",
    },
    {
      id: 3,
      name: "Vani",
      img: "https://3mhome.vn/wp-content/uploads/2022/02/nen-thom-vanilla.jpg",
      price: "150.000đ",
    },
  ];

  // Danh sách sản phẩm
  const products = [
    {
      id: 4,
      name: "Hoa nhài",
      img: "https://nenthomagaya.com/wp-content/uploads/2021/11/nen-thom-agaya-candle-cup-thu-duc-72.jpeg",
      price: "145.000đ",
      oldPrice: "190.000đ",
      discount: "-24%",
    },
    {
      id: 5,
      name: "Oải hương",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWD67Bj8YhPkh_8uJxqXNd_5cjzyYRFVIscg&s",
      price: "199.000đ",
      oldPrice: "240.000đ",
      discount: "-17%",
    },
    {
      id: 6,
      name: "Vani",
      img: "https://3mhome.vn/wp-content/uploads/2022/02/nen-thom-vanilla.jpg",
      price: "120.000đ",
      oldPrice: "150.000đ",
      discount: "-20%",
    },
  ];

  //Tin tức
  const newsData = [
    {
      id: 1,
      title:
        "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn",
      date: "20 Tháng 09, 2025",
      description:
        "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6973103465917_bb75323dbc076712846dfd63d5e4735e_d4bc109947314beeb162790f7f898bc6_grande.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga",
      date: "20 Tháng 09, 2025",
      description:
        "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6999667987112_4b3e2c993b0d25b6550c8810d5f25e80_3e2c4d6b47d04ee787a262351c7ee9a3_grande.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng",
      date: "20 Tháng 09, 2025",
      description:
        "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6999668611612_207c06f925c522772bf62cda88c5bad4_ea2c9d9d5f97476e879f6bd859069770_grande.jpg",
      link: "#",
    },
  ];

  const handleViewDetail = (id) => {
    alert(`Xem chi tiết sản phẩm có ID: ${id}`);
  };

  const handleViewCategories = (name) => {
    alert(`Xem danh mục sản phẩm: ${name}`);
  };

  // Cập nhật số lượng item hiển thị theo kích thước màn hình
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // tablet
      } else {
        setItemsPerPage(3); // desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);


  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[300px] sm:h-[400px] lg:h-[500px] flex flex-col items-center justify-center text-white px-4"
        style={{
          backgroundImage: "url('/assets/banner_nenthom.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Nội dung */}
        <div className="relative z-10 text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 leading-snug">
            Nến Thơm Handmade
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-6">
            Mang lại không gian thư giãn và ấm áp cho ngôi nhà của bạn
          </p>
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-pink-500 text-white rounded-xl shadow-md hover:bg-pink-600 transition">
            Mua Ngay
          </button>
        </div>
      </section>

      {/* Danh mục sản phẩm */}
      <section className="py-16 px-6 text-center relative">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8">
          Danh mục sản phẩm
        </h3>

        <div className="flex items-center justify-center gap-4">
          {/* Nút trái */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Swiper */}
          <Swiper
            spaceBetween={20}
            slidesPerView={itemsPerPage}
            loop
            onSwiper={(swiper) => (swiperRef.current = swiper)} // gắn ref
          >
            {categories.map((cat, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="bg-white shadow-md rounded-xl p-6 cursor-pointer 
                             hover:shadow-xl transform transition-transform 
                             duration-500 hover:scale-105"
                  onClick={() => handleViewCategories(cat.name)}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-64 object-cover mb-4 rounded-lg"
                  />
                  <h4 className="font-semibold">{cat.name}</h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nút phải */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="py-16 px-6 bg-gray-50">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Sản phẩm nổi bật
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((sp) => (
            <div
              key={sp.id}
              onClick={() => handleViewDetail(sp.id)}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl cursor-pointer"
            >
              <img src={sp.img} alt={sp.name} className="w-full h-100 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold text-lg">{`Nến thơm ${sp.name}`}</h4>
                <p className="text-gray-600">Giá: {sp.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // chặn event click ở div cha
                    alert(`Đã thêm ${sp.name} vào giỏ hàng`);
                  }}
                  className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Sản phẩm */}
      <section className="py-16 px-6 bg-gray-50">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Sản phẩm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((sp) => (
            <div
              key={sp.id}
              onClick={() => handleViewDetail(sp.id)}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl relative cursor-pointer"
            >
              {/* Nhãn giảm giá */}
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                {sp.discount}
              </span>

              <img src={sp.img} alt={sp.name} className="w-full h-100 object-cover" />

              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1">{`Nến thơm ${sp.name}`}</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-red-500 font-bold">{sp.price}</p>
                  <p className="text-gray-400 line-through">{sp.oldPrice}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // chặn event click ở div cha
                    alert(`Đã thêm ${sp.name} vào giỏ hàng`);
                  }}
                  className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="text-pink-500 font-semibold hover:underline">
            Xem thêm sản phẩm →
          </button>
        </div>
      </section>
      {/* Tin tức nổi bật */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Tin tức nổi bật
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((news) => (
            <div
              key={news.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500">{news.date}</p>
                <h4 className="font-semibold text-lg mt-2">{news.title}</h4>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {news.description}
                </p>
                <a
                  href={news.link}
                  className="inline-block mt-3 text-pink-500 hover:underline font-medium"
                >
                  Xem thêm →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Content;
