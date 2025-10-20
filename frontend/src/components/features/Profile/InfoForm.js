import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { profileUser, ChangeInformation } from "../../../api/user/userApi";

export default function InfoForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                if (!storedUser._id) {
                    toast.error("Không tìm thấy thông tin user");
                    setLoading(false);
                    return;
                }

                setUserId(storedUser._id);
                const data = await profileUser(storedUser._id);
                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                });
            } catch (err) {
                toast.error("Lỗi khi tải thông tin người dùng");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!userId) {
            toast.error("Không tìm thấy thông tin user");
            return;
        }

        try {
            const res = await ChangeInformation(form, userId);
            toast.success(res.message || "Cập nhật hồ sơ thành công!");

            const updatedUser = {
                ...JSON.parse(localStorage.getItem("user") || "{}"),
                name: form.name,
                email: form.email,
                phone: form.phone,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // 🔄 Reload lại trang sau 1 giây để hiển thị tên mới
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            const msg =
                err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(msg);
        }
    }


    if (loading)
        return <p className="text-gray-500 text-center py-8">Đang tải thông tin...</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white/70 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-md"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-emerald-700 mb-1">
                    Hồ sơ của bạn 🌿
                </h2>
                <p className="text-sm text-emerald-500">
                    Cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn
                </p>
            </div>

            {/* Họ tên */}
            <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Họ và tên
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-200 hover:bg-emerald-50"
                    required
                />
            </div>

            {/* Email */}
            <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-200 hover:bg-emerald-50"
                    required
                />
            </div>

            {/* Số điện thoại */}
            <div className="group">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Số điện thoại
                </label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all duration-200 hover:bg-emerald-50"
                />
            </div>

            {/* Nút lưu */}
            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                >
                    💾 Lưu thay đổi
                </button>
            </div>
        </form>
    );
}
