import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingBag, Users } from "lucide-react";

import { toast } from "react-toastify";
import { getSellerDashboardStats } from "../../api/dashboard/dashboardApi";

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getSellerDashboardStats();
                console.log("Lấy tất cả thống kê dashboard: ", res);
                if (res.ok) setStats(res.data);
                else toast.error(res.message || "Không thể tải thống kê");
            } catch (error) {
                toast.error("Lỗi kết nối đến server");
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;

    const cards = [
        { id: 1, icon: <ShoppingBag size={28} />, label: "Đơn hàng hôm nay", value: stats.ordersToday },
        { id: 2, icon: <Package size={28} />, label: "Sản phẩm đang bán", value: stats.totalProducts },
        { id: 3, icon: <Users size={28} />, label: "Khách hàng mới", value: stats.newCustomers },
        // { id: 4, icon: <BarChart3 size={28} />, label: "Doanh thu tháng", value: `₫${stats.monthlyRevenue.toLocaleString()}` },
        { id: 4, icon: <BarChart3 size={28} />, label: "Doanh thu tháng", value: `₫${Number(stats.monthlyRevenue).toLocaleString()}` },

    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🎉 Chào mừng trở lại, <span className="text-blue-600">Người bán</span>!
                </h1>
                <p className="text-gray-500">Theo dõi hiệu quả kinh doanh của bạn hôm nay.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-start border border-gray-100 transition"
                    >
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-4">{item.icon}</div>
                        <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                        <h2 className="text-2xl font-semibold text-gray-800">{item.value}</h2>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
