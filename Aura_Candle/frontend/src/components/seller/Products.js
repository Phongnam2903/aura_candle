import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProducts } from "../../api/products/productApi";
import { Eye } from "lucide-react"; // icon con mắt

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <Link
          to="/seller/products/addProducts"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Ảnh</th>
            <th className="p-3 border">Tên sản phẩm</th>
            <th className="p-3 border">Loại</th>
            <th className="p-3 border">Giá</th>
            <th className="p-3 border">Tồn kho</th>
            <th className="p-3 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-3 border">
                {p.images?.length > 0 && (
                  <img
                    src={`http://localhost:5000${p.images[0]}`}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                )}
              </td>
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">{p.category?.name || "-"}</td>
              <td className="p-3 border">{Number(p.price).toLocaleString()}₫</td>
              <td className="p-3 border">{p.stock}</td>
              <td className="p-3 border space-x-2">
                <button
                  onClick={() => navigate(`/seller/products/${p._id}`)}
                  className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  title="Xem chi tiết"
                >
                  <Eye size={18} />
                </button>
                <button className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600">
                  Sửa
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
