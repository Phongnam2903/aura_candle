import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingBag, Users } from "lucide-react";

export default function Dashboard() {
    const stats = [
        { id: 1, icon: <ShoppingBag size={28} />, label: "Đơn hàng hôm nay", value: "24" },
        { id: 2, icon: <Package size={28} />, label: "Sản phẩm đang bán", value: "152" },
        { id: 3, icon: <Users size={28} />, label: "Khách hàng mới", value: "8" },
        { id: 4, icon: <BarChart3 size={28} />, label: "Doanh thu tháng", value: "₫32,500,000" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🎉 Chào mừng trở lại, <span className="text-blue-600">Người bán</span>!
                </h1>
                <p className="text-gray-500">
                    Hôm nay là một ngày tuyệt vời để theo dõi hiệu quả kinh doanh của bạn.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-start border border-gray-100 transition"
                    >
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-4">
                            {item.icon}
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                        <h2 className="text-2xl font-semibold text-gray-800">{item.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Quick Action */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Hành động nhanh</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
                        + Thêm sản phẩm
                    </button>
                    <button className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium">
                        Xem báo cáo
                    </button>
                    <button className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition font-medium">
                        Quản lý đơn hàng
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
