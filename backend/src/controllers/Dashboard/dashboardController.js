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

        // ========== Tạo dữ liệu charts đơn giản (12 tháng) ==========
        const revenueByMonth = [];
        const newCustomersByMonth = [];
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthLabel = date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
            
            // Tháng hiện tại dùng dữ liệu thực, các tháng khác = 0
            const isCurrentMonth = i === 0;
            
            revenueByMonth.push({
                date: monthLabel,
                revenue: isCurrentMonth ? monthlyRevenue : 0
            });
            
            newCustomersByMonth.push({
                date: monthLabel,
                customers: isCurrentMonth ? newCustomers : 0
            });
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

        // ========== Đơn hàng hôm nay ==========
        const todayOrdersDetails = ordersToday.map(order => ({
            _id: order._id,
            orderCode: order.orderCode || `ORD-${order._id}`,
            totalAmount: order.totalAmount || 0,
            status: order.status || 'Pending',
            paymentStatus: order.paymentStatus || 'unpaid',
            createdAt: order.createdAt
        }));

        // Debug logs
        console.log("✅ Dashboard Stats:");
        console.log("   - monthlyRevenue:", monthlyRevenue);
        console.log("   - ordersToday:", ordersToday.length);
        console.log("   - totalProducts:", totalProducts);
        console.log("   - newCustomers:", newCustomers);
        console.log("   - totalRevenue:", totalRevenue);
        console.log("   - revenueChart:", revenueByMonth.length, "months");
        console.log("   - customersChart:", newCustomersByMonth.length, "months");
        console.log("   - todayOrders:", todayOrdersDetails.length, "orders");
        
        res.json({
            ok: true,
            data: {
                ordersToday: ordersToday.length,
                totalProducts,
                newCustomers,
                monthlyRevenue,
                totalRevenue,
                revenueChart: revenueByMonth,
                customersChart: newCustomersByMonth,
                todayOrders: todayOrdersDetails,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ ok: false, message: "Server error", error: error.message });
    }
};
