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
                // Lấy object user từ localStorage
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
                console.log("dữ liệu: ", data);
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
            const res = await ChangeInformation(form, userId); // truyền id
            toast.success(res.message || "Cập nhật hồ sơ thành công!");
        } catch (err) {
            const msg =
                err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(msg);
        }
    }

    if (loading) return <p className="text-gray-500">Đang tải thông tin...</p>;

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Thông Tin Tài Khoản</h2>

            <div>
                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
            >
                Lưu thay đổi
            </button>
        </form>
    );
}
