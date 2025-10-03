import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { newsData } from "../../data/news";
import "swiper/css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { getCategories } from "../../api/category/categoriesApi";
import { getProducts } from "../../api/products/productApi";

const Content = () => {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const swiperRef = useRef(null);
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewCategories = (name) => {
    alert(`Xem danh mục sản phẩm: ${name}`);
  };

  // Lấy categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchProfuct = async () => {
      try {
        const data = await getProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfuct();
    fetchCategories();
  }, []);

  // Responsive số slide
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
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
        style={{ backgroundImage: "url('/assets/banner_nenthom.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
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
        {loading ? (
          <p>Đang tải danh mục...</p>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronLeft size={24} />
            </button>

            <Swiper
              spaceBetween={20}
              slidesPerView={itemsPerPage}
              loop
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {categories.map((cat, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-xl transform transition-transform duration-500 hover:scale-105"
                    onClick={() => handleViewCategories(cat.name)}
                  >
                    <img
                      src={`http://localhost:5000${cat.image}`}
                      alt={cat.name}
                      className="w-full h-64 object-cover mb-4 rounded-lg"
                    />
                    <h4 className="font-semibold">{cat.name}</h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      {/* Sản phẩm khác */}
      <section className="py-16 px-6 bg-gray-50">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          ✨ Sản phẩm nổi bật
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((sp) => (
            <div
              key={sp._id}
              className="bg-white shadow-md rounded-xl overflow-hidden transition hover:shadow-xl hover:-translate-y-1"
            >
              {/* Link sang chi tiết */}
              <Link to={`/product/${sp._id}`}>
                <img
                  src={`http://localhost:5000${sp.images[0]}`}
                  alt={sp.name}
                  className="w-full h-72 object-cover rounded-t-xl hover:scale-105 transition-transform"
                />
              </Link>

              <div className="p-4">
                <h4 className="font-semibold text-lg text-gray-900 truncate">
                  {sp.name}
                </h4>
                <p className="text-red-600 font-bold text-lg mt-1">
                  {sp.price.toLocaleString()} đ
                </p>

                <div className="flex items-center justify-between mt-4">
                  {/* Button chi tiết */}
                  <Link
                    to={`/product/${sp._id}`}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    🔎 Xem chi tiết
                  </Link>

                  {/* Button thêm giỏ */}
                  <button
                    onClick={() => {
                      addItem(sp);
                      toast.success("🛒 Đã thêm vào giỏ hàng!");
                    }}
                    className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                  >
                    🛒 Thêm giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tin tức */}
      <section className="py-16 px-6 bg-white">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Tin tức nổi bật
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((news) => (
            <div key={news.id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl">
              <img src={news.image} alt={news.title} className="w-full h-64 object-cover" />
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
