import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, ShoppingBag, Users, TrendingUp, Calendar, DollarSign } from "lucide-react";

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
        { id: 1, icon: <ShoppingBag size={28} />, label: "Đơn hàng hôm nay", value: stats.ordersToday, color: "blue" },
        { id: 2, icon: <Package size={28} />, label: "Sản phẩm đang bán", value: stats.totalProducts, color: "green" },
        { id: 3, icon: <Users size={28} />, label: "Khách hàng mới", value: stats.newCustomers, color: "purple" },
        { id: 4, icon: <BarChart3 size={28} />, label: "Doanh thu tháng", value: `₫${Number(stats.monthlyRevenue).toLocaleString()}`, color: "orange" },
    ];

    // Tìm giá trị max để scale charts
    const maxRevenue = stats.revenueChart ? Math.max(...stats.revenueChart.map(d => d.revenue)) : 0;
    const maxCustomers = stats.customersChart ? Math.max(...stats.customersChart.map(d => d.customers)) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🎉 Chào mừng trở lại, <span className="text-blue-600">Người bán</span>!
                </h1>
                <p className="text-gray-500">Theo dõi hiệu quả kinh doanh của bạn hôm nay.</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03 }}
                        className={`bg-white rounded-2xl shadow-md p-6 flex flex-col items-start border border-gray-100 transition relative overflow-hidden`}
                    >
                        <div className={`p-3 bg-${item.color}-100 text-${item.color}-600 rounded-xl mb-4`}>{item.icon}</div>
                        <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                        <h2 className="text-2xl font-semibold text-gray-800">{item.value}</h2>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-50 rounded-full -mr-16 -mt-16 opacity-50`}></div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section - CSS ONLY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-green-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Doanh thu 7 ngày</h3>
                    </div>
                    {stats.revenueChart && stats.revenueChart.length > 0 ? (
                        <div className="space-y-3">
                            {stats.revenueChart.map((item, index) => {
                                const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600 font-medium w-12">{item.date}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end pr-3"
                                            >
                                                {item.revenue > 0 && (
                                                    <span className="text-xs font-semibold text-white">
                                                        {item.revenue.toLocaleString()}đ
                                                    </span>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-20">Chưa có dữ liệu doanh thu</p>
                    )}
                </motion.div>

                {/* Customers Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-purple-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-800">Khách hàng mới 7 ngày</h3>
                    </div>
                    {stats.customersChart && stats.customersChart.length > 0 ? (
                        <div className="space-y-3">
                            {stats.customersChart.map((item, index) => {
                                const percentage = maxCustomers > 0 ? (item.customers / maxCustomers) * 100 : 0;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600 font-medium w-12">{item.date}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-end pr-3"
                                            >
                                                {item.customers > 0 && (
                                                    <span className="text-xs font-semibold text-white">
                                                        {item.customers} người
                                                    </span>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-20">Chưa có dữ liệu khách hàng</p>
                    )}
                </motion.div>
            </div>

            {/* Today's Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-orange-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-800">Đơn hàng hôm nay ({stats.ordersToday})</h3>
                </div>
                {stats.todayOrders && stats.todayOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mã đơn</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Thanh toán</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stats.todayOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderCode}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            <span className="font-semibold text-blue-600">{order.totalAmount?.toLocaleString()}đ</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-gray-400 text-lg">Chưa có đơn hàng nào hôm nay</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

