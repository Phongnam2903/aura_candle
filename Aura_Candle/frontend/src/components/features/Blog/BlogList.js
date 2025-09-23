import React from "react";
import { Link } from "react-router-dom";

const dummy = [
  { id: 1, title: "Decor phòng ngủ với nến thơm", excerpt: "Biến phòng ngủ thành spa mini..." },
  { id: 2, title: "Chọn mùi hương hợp tính cách", excerpt: "Mỗi cung hoàng đạo..." }
];

export default function BlogList() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Relax Corner Blog</h1>
      {dummy.map(post => (
        <Link key={post.id} to={`/blog/${post.id}`} className="block mb-4 hover:text-pink-600">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}
