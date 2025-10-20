import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { toast } from "react-toastify"
import { getCategories } from "../../api/category/categoriesApi"
import { getProducts } from "../../api/products/productApi"

const Content = () => {
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const swiperRef = useRef(null)
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const newsData = [
    {
      id: 1,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn...",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6973103465917_bb75323dbc076712846dfd63d5e4735e_d4bc109947314beeb162790f7f898bc6_grande.jpg",
      link: "/blog",
    },
    {
      id: 2,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga...",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6999667987112_4b3e2c993b0d25b6550c8810d5f25e80_3e2c4d6b47d04ee787a262351c7ee9a3_grande.jpg",
      link: "/blog",
    },
    {
      id: 3,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng...",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6999668611612_207c06f925c522772bf62cda88c5bad4_ea2c9d9d5f97476e879f6bd859069770_grande.jpg",
      link: "/blog",
    },
  ]

  const navigate = useNavigate(); // dùng navigate, không phải navigator

  const handleViewCategories = (slug) => {
    navigate(`/product/category/${slug}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }
    const fetchProfuct = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Lỗi khi fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfuct()
    fetchCategories()
  }, [])

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(1)
      else if (window.innerWidth < 1024) setItemsPerPage(2)
      else setItemsPerPage(3)
    }
    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)
    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col items-center justify-center text-white px-6"
        style={{ backgroundImage: "url('/assets/banner_nenthom.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light mb-4 leading-tight">
            Nến Thơm Handmade
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
            Mang lại không gian thư giãn và ấm áp cho ngôi nhà của bạn
          </p>
          <Link
            to="/product/category/nen-thom"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
          >
            Khám Phá Ngay <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>


      {/* Danh mục sản phẩm */}
      <section className="py-24 px-6 text-center relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-light max-w-2xl mx-auto">
              Khám phá bộ sưu tập nến thơm được chế tác thủ công với tình yêu
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="p-4 bg-card border border-border rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex-1 max-w-6xl">
                <Swiper
                  spaceBetween={28}
                  slidesPerView={itemsPerPage}
                  loop
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                  {categories.map((cat) => (
                    <SwiperSlide key={cat._id}>
                      <div
                        onClick={() => handleViewCategories(cat.slug)}
                        className="group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:scale-[1.04]"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={
                              cat.image.startsWith("https")
                                ? cat.image
                                : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${cat.image}`
                            }
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-6 bg-white">
                          <h3 className="font-serif text-xl font-medium text-[#2C2420] group-hover:text-[#A0785D] transition-colors">
                            {cat.name}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>


              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="p-4 bg-card border border-border rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-muted/40">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium uppercase tracking-wider text-sm">
                Nổi bật
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">
              Sản phẩm được yêu thích
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-light max-w-2xl mx-auto">
              Những sản phẩm nến thơm được khách hàng yêu thích và tin dùng nhất
            </p>
          </div>

          {/* Lưới sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.slice(0, 3).map((sp) => (
              <div
                key={sp._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Ảnh sản phẩm */}
                <Link
                  to={`/product/${sp._id}`}
                  className="block relative overflow-hidden aspect-square"
                >
                  <img
                    src={
                      sp.images[0].startsWith("https")
                        ? sp.images[0]
                        : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${sp.images[0]}`
                    }
                    alt={sp.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon mắt khi hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-4 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </Link>

                {/* Thông tin sản phẩm */}
                <div className="p-6 text-center">
                  <Link to={`/product/${sp._id}`}>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {sp.name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-light text-accent mb-6">
                    {sp.price.toLocaleString()} đ
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <Link
                      to={`/product/${sp._id}`}
                      className="flex-1 px-5 py-3 rounded-xl border border-transparent bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-center font-medium shadow-sm"
                    >
                      Xem chi tiết
                    </Link>

                    <button
                      onClick={() => {
                        addItem(sp)
                        toast.success("Đã thêm vào giỏ hàng!", {
                          position: "bottom-right",
                          autoClose: 2000,
                        })
                      }}
                      className="p-3 rounded-xl bg-white border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md hover:scale-110"
                      aria-label="Thêm vào giỏ hàng"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tin tức */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">
              Tin tức & Cảm hứng
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-light max-w-2xl mx-auto">
              Khám phá những câu chuyện và ý tưởng mới nhất từ chúng tôi
            </p>
          </div>

          {/* Danh sách bài viết */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {newsData.map((news) => (
              <article
                key={news.id}
                className="group rounded-3xl overflow-hidden bg-card/70 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Ảnh */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay sáng khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Ngày đăng */}
                  <div className="absolute top-4 left-4 bg-white/90 text-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {news.date}
                  </div>
                </div>

                {/* Nội dung */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium mt-2 mb-3 line-clamp-2 text-foreground group-hover:text-accent transition-colors">
                    {news.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                    {news.description}
                  </p>

                  {/* Nút đọc thêm */}
                  <a
                    href={news.link}
                    className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium group/link"
                  >
                    Đọc thêm
                    <span className="transition-transform group-hover/link:translate-x-1">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Content
