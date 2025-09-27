import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  // Lấy thông tin user từ localStorage (hoặc context)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (storedUser) {
      setForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
      });
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // 🔗 Gọi API update profile ở đây, ví dụ: await updateProfile(form)
    // Sau khi cập nhật thành công:
    localStorage.setItem("user", JSON.stringify({ ...storedUser, ...form }));
    toast.success("Cập nhật hồ sơ thành công!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thông Tin Tài Khoản
      </h1>

      <div className="bg-white shadow rounded-xl p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Nhập email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
