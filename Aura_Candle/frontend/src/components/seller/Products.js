import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct, getProducts } from "../../api/products/productApi";
import { Eye, Edit3, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // số sản phẩm trên mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi xóa sản phẩm");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Đang tải sản phẩm...
      </div>
    );

  // Lọc sản phẩm theo tên
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📦 Quản lý Sản phẩm</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset về trang đầu khi tìm kiếm
              }}
            />
          </div>

          {/* Nút thêm sản phẩm */}
          <Link
            to="/seller/products/addProducts"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gradient-to-r from-pink-50 to-white text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Ảnh</th>
              <th className="p-3 text-left font-semibold">Tên sản phẩm</th>
              <th className="p-3 text-left font-semibold">Danh mục</th>
              <th className="p-3 text-left font-semibold">Mùi hương</th>
              <th className="p-3 text-left font-semibold">Giá</th>
              <th className="p-3 text-left font-semibold">Tồn kho</th>
              <th className="p-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-5 text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              currentItems.map((p, index) => (
                <tr
                  key={p._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-pink-50/20"
                    } hover:bg-pink-50 transition-all`}
                >
                  <td className="p-3">
                    {p.images?.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{p.name}</td>
                  <td className="p-3">{p.category?.name || "-"}</td>
                  <td className="p-3">{p.fragrance || "Không có"}</td>
                  <td className="p-3 font-semibold text-pink-600">
                    {Number(p.price).toLocaleString()}₫
                  </td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/seller/products/${p._id}`)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <Link
                        to={`/seller/products/${p._id}/edit`}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${currentPage === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-pink-600 border-pink-300 hover:bg-pink-50"
              }`}
          >
            <ChevronLeft size={16} /> Trước
          </button>

          <span className="text-gray-700 text-sm">
            Trang <strong>{currentPage}</strong> / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm ${currentPage === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-pink-600 border-pink-300 hover:bg-pink-50"
              }`}
          >
            Sau <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
