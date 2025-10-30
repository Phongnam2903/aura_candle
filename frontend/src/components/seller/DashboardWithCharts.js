import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import { getSellerDashboardStats } from "../../api/dashboard/dashboardApi";
import RoleInfoBanner from "../Auth/RoleInfoBanner";

export default function DashboardWithCharts() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getSellerDashboardStats();
                if (res.ok) {
                    setStats(res.data);
                } else {
                    toast.error(res.message || "Không thể tải thống kê");
                }
            } catch (error) {
                console.error("Lỗi khi tải dashboard:", error);
                toast.error("Lỗi kết nối đến server");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return <p className="text-center mt-10 text-gray-500">Không có dữ liệu</p>;
    }

    const cards = [
        {
            id: 1,
            icon: <ShoppingBag size={28} />,
            label: "Đơn hàng hôm nay",
            value: stats.ordersToday || 0,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            trend: "+12%"
        },
        {
            id: 2,
            icon: <Package size={28} />,
            label: "Sản phẩm đang bán",
            value: stats.totalProducts || 0,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            trend: "+5%"
        },
        {
            id: 3,
            icon: <Users size={28} />,
            label: "Khách hàng mới",
            value: stats.newCustomers || 0,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            trend: "+8%"
        },
        {
            id: 4,
            icon: <DollarSign size={28} />,
            label: "Doanh thu tháng",
            value: `${Number(stats.monthlyRevenue || 0).toLocaleString()}₫`,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            trend: "+15%"
        },
    ];

    // Prepare chart data
    const revenueData = stats.revenueChart || [];
    const customersData = stats.customersChart || [];

    // Debug logs
    console.log("📊 Dashboard Data:", {
        revenueData,
        customersData,
        stats
    });

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            {/* Info Banner */}
            <RoleInfoBanner />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    📊 Dashboard
                </h1>
                <p className="text-gray-600">Tổng quan hoạt động kinh doanh của bạn</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 ${card.iconBg} ${card.iconColor} rounded-xl`}>
                                {card.icon}
                            </div>
                            <span className="text-green-500 text-sm font-semibold">
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                        <h2 className="text-3xl font-bold text-gray-800">{card.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        💰 Doanh thu 12 tháng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={revenueData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                stroke="#6B7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6B7280"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Doanh thu (₫)"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Customers Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        👥 Khách hàng mới 12 tháng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={customersData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                stroke="#6B7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6B7280"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="customers"
                                name="Khách hàng mới"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Today's Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-sm p-6"
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    🛍️ Đơn hàng hôm nay
                </h3>
                {stats.todayOrders && stats.todayOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 text-sm font-semibold text-gray-600">Khách hàng</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600">Sản phẩm</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600">Tổng tiền</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.todayOrders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-4 text-sm text-gray-700 font-medium">{order.user?.name || "Khách vãng lai"}</td>
                                        <td className="py-4 text-sm text-gray-700">{order.items?.length || 0} sản phẩm</td>
                                        <td className="py-4 text-sm font-semibold text-gray-800">
                                            {order.totalAmount?.toLocaleString()}₫
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "Confirmed"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status === "Shipped"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào hôm nay</p>
                )}
            </motion.div>
        </div>
    );
}

