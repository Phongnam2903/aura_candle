import React from "react";
import { Link } from "react-router-dom";

export default function BlogList() {
  const newsData = [
    {
      id: 1,
      title: "Dịch vụ gia công quà tặng nến thơm, sáp thơm cho sự kiện lớn",
      date: "20 Tháng 09, 2025",
      description:
        "Cung cấp dịch vụ gia công quà tặng nến thơm, sáp thơm cho các sự kiện lớn – mang đến hương thơm tự nhiên, tinh tế và sang trọng.",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6973103465917_bb75323dbc076712846dfd63d5e4735e_d4bc109947314beeb162790f7f898bc6_grande.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Gia công nến thơm – quà tặng cho thiền và yoga",
      date: "20 Tháng 09, 2025",
      description:
        "Tạo nên không gian thư giãn với hương nến thơm tự nhiên, hỗ trợ tĩnh tâm và giảm căng thẳng trong quá trình thiền, yoga.",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6999667987112_4b3e2c993b0d25b6550c8810d5f25e80_3e2c4d6b47d04ee787a262351c7ee9a3_grande.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "Nến thơm quà tặng cho cửa hàng decor & lifestyle",
      date: "20 Tháng 09, 2025",
      description:
        "Dịch vụ gia công nến thơm cho các cửa hàng decor – đa dạng hương thơm, bao bì sang trọng, phù hợp với mọi không gian sống.",
      image:
        "https://cdn.hstatic.net/files/200000666175/article/z6999668611612_207c06f925c522772bf62cda88c5bad4_ea2c9d9d5f97476e879f6bd859069770_grande.jpg",
      link: "#",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 items-start">
        {/* --------- Main Content --------- */}
        <div className="space-y-10">
          <h1 className="text-4xl font-semibold mb-6 text-emerald-800 tracking-wide">
            Tin tức & Cảm hứng hương thơm
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsData.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <Link to={post.link || "#"} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-emerald-700 mb-1 group-hover:text-emerald-600 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-3">
                      <span className="text-sm text-emerald-600 font-medium group-hover:underline">
                        Đọc thêm →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                className="px-3 py-1 border border-emerald-200 text-sm rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* --------- Sidebar --------- */}
        <aside className="space-y-8">
          <div className="bg-white shadow-sm rounded-2xl p-5 border border-emerald-100">
            <h3 className="font-semibold mb-3 text-emerald-800 text-lg">
              Sản phẩm nổi bật
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Nến thơm Luxury
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Tinh dầu thiên nhiên
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Bộ quà tặng cao cấp
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-5 border border-emerald-100">
            <h3 className="font-semibold mb-3 text-emerald-800 text-lg">
              Danh mục bài viết
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Tin tức
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Decor & Lifestyle
              </li>
              <li className="hover:text-emerald-600 cursor-pointer transition">
                Blog chia sẻ hương thơm
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-100 to-white rounded-2xl p-6 text-center shadow-sm border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 text-lg mb-2">
              Hương thơm của bạn là gì?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Khám phá bộ sưu tập nến thơm dành riêng cho không gian sống của bạn.
            </p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Khám phá ngay
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
