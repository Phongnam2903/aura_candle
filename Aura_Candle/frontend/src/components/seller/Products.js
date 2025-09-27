import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  // ví dụ danh sách sản phẩm giả
  const [products] = useState([
    { id: 1, name: "Nến thơm Lavender", price: 150000, stock: 20 },
    { id: 2, name: "Nến Vanilla", price: 180000, stock: 12 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Sản phẩm</h1>
      <button className="mb-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
        <Link to="/seller/products/addProducts" className="flex items-center gap-2 hover:text-blue-500">
          + Thêm sản phẩm
        </Link>

      </button>
      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Tên sản phẩm</th>
            <th className="p-3 border">Giá</th>
            <th className="p-3 border">Tồn kho</th>
            <th className="p-3 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">{p.price.toLocaleString()}₫</td>
              <td className="p-3 border">{p.stock}</td>
              <td className="p-3 border space-x-2">
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
