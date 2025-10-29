// controllers/dashboardController.js

const { Product, Order, User } = require("../../models");
const mongoose = require("mongoose");

exports.getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user?.id;
        console.log(sellerId);
        if (!sellerId) return res.status(401).json({ ok: false, message: "Unauthorized" });

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        //  Tổng sản phẩm đang bán
        const totalProducts = await Product.countDocuments({ seller: sellerId, isActive: true });

        //  Khách hàng mới (đăng ký hôm nay)
        const newCustomers = await User.countDocuments({
            role: "customer",
            createdAt: { $gte: startOfDay },
        });

        //  Đơn hàng hôm nay (của seller này)
        const ordersTodayAgg = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay },
                },
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            { $unwind: "$productData" },
            {
                $match: {
                    "productData.seller": new mongoose.Types.ObjectId(sellerId),
                },
            },
            {
                $group: {
                    _id: "$_id",
                    order: { $first: "$$ROOT" },
                },
            },
        ]);

        const ordersToday = ordersTodayAgg.map(item => item.order);

        //  Doanh thu tháng hiện tại (chỉ tính đơn đã Completed VÀ đã thanh toán)
        const monthlyRevenueAgg = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            { $unwind: "$productData" },
            {
                $match: {
                    "productData.seller": new mongoose.Types.ObjectId(sellerId),
                    status: "Completed",
                    paymentStatus: "paid",
                    createdAt: { $gte: startOfMonth },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                },
            },
        ]);

        const monthlyRevenue =
            monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].total : 0;

        // ========== THÊM: Doanh thu theo tháng (12 tháng gần nhất) ==========
        const last12Months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            date.setDate(1); // Ngày đầu tháng
            date.setHours(0, 0, 0, 0);
            last12Months.push(date);
        }

        let revenueByMonth = [];
        try {
            revenueByMonth = await Promise.all(
                last12Months.map(async (monthStart) => {
                    try {
                        const monthEnd = new Date(monthStart);
                        monthEnd.setMonth(monthEnd.getMonth() + 1);

                        const monthRevenue = await Order.aggregate([
                            { $unwind: "$items" },
                            {
                                $lookup: {
                                    from: "products",
                                    localField: "items.product",
                                    foreignField: "_id",
                                    as: "productData",
                                },
                            },
                            { $unwind: "$productData" },
                            {
                                $match: {
                                    "productData.seller": new mongoose.Types.ObjectId(sellerId),
                                    status: "Completed",
                                    paymentStatus: "paid",
                                    createdAt: { $gte: monthStart, $lt: monthEnd },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                                },
                            },
                        ]);

                        return {
                            date: monthStart.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                            revenue: monthRevenue.length > 0 ? monthRevenue[0].total : 0,
                        };
                    } catch (err) {
                        console.error("Error calculating revenue for month:", monthStart, err);
                        return {
                            date: monthStart.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                            revenue: 0,
                        };
                    }
                })
            );
        } catch (err) {
            console.error("Error in revenueByMonth calculation:", err);
            revenueByMonth = last12Months.map(date => ({
                date: date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                revenue: 0,
            }));
        }

        // ========== THÊM: Tổng doanh thu toàn thời gian (chỉ tính đơn đã Completed VÀ đã thanh toán) ==========
        const totalRevenueAgg = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            { $unwind: "$productData" },
            {
                $match: {
                    "productData.seller": new mongoose.Types.ObjectId(sellerId),
                    status: "Completed",
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                },
            },
        ]);

        const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

        // ========== THÊM: Khách hàng mới theo tháng (12 tháng gần nhất) ==========
        let newCustomersByMonth = [];
        try {
            newCustomersByMonth = await Promise.all(
                last12Months.map(async (monthStart) => {
                    try {
                        const monthEnd = new Date(monthStart);
                        monthEnd.setMonth(monthEnd.getMonth() + 1);

                        const count = await User.countDocuments({
                            role: "customer",
                            createdAt: { $gte: monthStart, $lt: monthEnd },
                        });

                        return {
                            date: monthStart.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                            customers: count,
                        };
                    } catch (err) {
                        console.error("Error counting customers for month:", monthStart, err);
                        return {
                            date: monthStart.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                            customers: 0,
                        };
                    }
                })
            );
        } catch (err) {
            console.error("Error in newCustomersByMonth calculation:", err);
            newCustomersByMonth = last12Months.map(date => ({
                date: date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }),
                customers: 0,
            }));
        }

        // ========== THÊM: Chi tiết đơn hàng hôm nay ==========
        let todayOrdersDetails = [];
        try {
            todayOrdersDetails = ordersToday.map(order => ({
                _id: order._id,
                orderCode: order.orderCode || `ORD-${order._id}`,
                totalAmount: order.totalAmount || 0,
                status: order.status || 'Pending',
                paymentStatus: order.paymentStatus || 'unpaid',
                createdAt: order.createdAt
            }));
        } catch (err) {
            console.error("Error mapping todayOrders:", err);
            todayOrdersDetails = [];
        }

        console.log("monthlyRevenue: ", monthlyRevenue);
        console.log("ordersToday: ", ordersToday.length);
        console.log("totalProducts:", totalProducts);
        console.log("newCustomers: ", newCustomers);
        console.log("revenueByMonth: ", JSON.stringify(revenueByMonth));
        console.log("newCustomersByMonth: ", JSON.stringify(newCustomersByMonth));
        console.log("todayOrdersDetails: ", JSON.stringify(todayOrdersDetails));
        
        res.json({
            ok: true,
            data: {
                ordersToday: ordersToday.length,
                totalProducts,
                newCustomers,
                monthlyRevenue,
                totalRevenue, // Tổng doanh thu toàn thời gian
                // Charts data (12 tháng)
                revenueChart: revenueByMonth,
                customersChart: newCustomersByMonth,
                // Chi tiết đơn hàng hôm nay
                todayOrders: todayOrdersDetails,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ ok: false, message: "Server error", error: error.message });
    }
};
