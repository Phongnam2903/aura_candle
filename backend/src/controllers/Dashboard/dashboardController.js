// controllers/dashboardController.js

const { Product, Order, User } = require("../../models");


exports.getSellerDashboardStats = async (req, res) => {
    try {
        const sellerId = req.user?.id;
        if (!sellerId) return res.status(401).json({ ok: false, message: "Unauthorized" });

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 📦 Tổng sản phẩm đang bán
        const totalProducts = await Product.countDocuments({ seller: sellerId, isActive: true });

        // 🛒 Đơn hàng hôm nay
        const ordersToday = await Order.find({
            seller: sellerId,
            createdAt: { $gte: startOfDay },
        });

        // 👥 Khách hàng mới (đăng ký hôm nay)
        const newCustomers = await User.countDocuments({
            role: "customer",
            createdAt: { $gte: startOfDay },
        });

        // 💰 Doanh thu tháng hiện tại
        const monthlyRevenueAgg = await Order.aggregate([
            {
                $match: {
                    seller: sellerId,
                    status: "Completed",
                    createdAt: { $gte: startOfMonth },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" },
                },
            },
        ]);

        const monthlyRevenue =
            monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].total : 0;

        res.json({
            ok: true,
            data: {
                ordersToday: ordersToday.length,
                totalProducts,
                newCustomers,
                monthlyRevenue,
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ ok: false, message: "Server error", error: error.message });
    }
};
