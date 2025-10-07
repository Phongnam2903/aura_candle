import React from "react";
import { Link } from "react-router-dom";


export default function BlogList() {
  const newsData = [
    {
      id: 1,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Sự Kiện - Event Lớn...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6973103465917_bb75323dbc076712846dfd63d5e4735e_d4bc109947314beeb162790f7f898bc6_grande.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Thiền – Yoga...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6999667987112_4b3e2c993b0d25b6550c8810d5f25e80_3e2c4d6b47d04ee787a262351c7ee9a3_grande.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng",
      date: "20 Tháng 09, 2025",
      description: "Dịch Vụ Gia Công Quà Tặng Nến Thơm, Sáp Thơm Cho Tiệm Quà Tặng...",
      image: "https://cdn.hstatic.net/files/200000666175/article/z6999668611612_207c06f925c522772bf62cda88c5bad4_ea2c9d9d5f97476e879f6bd859069770_grande.jpg",
      link: "#",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8 items-start">
        {/* --------- Main Content --------- */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Tin tức</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsData.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition"
              >
                <Link to={post.link || "#"} className="block">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:opacity-90 transition"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-1 group-hover:text-pink-600">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                className="px-3 py-1 border text-sm rounded bg-white hover:bg-pink-600 hover:text-white shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* --------- Sidebar --------- */}
        <aside className="space-y-6">
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-gray-800">Sản phẩm nổi bật</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="hover:text-pink-600 cursor-pointer">Nến thơm Luxury</li>
              <li className="hover:text-pink-600 cursor-pointer">Tinh dầu thiên nhiên</li>
              <li className="hover:text-pink-600 cursor-pointer">Bộ quà tặng cao cấp</li>
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-gray-800">Danh mục bài viết</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="hover:text-pink-600 cursor-pointer">Tin tức</li>
              <li className="hover:text-pink-600 cursor-pointer">Decor</li>
              <li className="hover:text-pink-600 cursor-pointer">Blog</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

  );
}
