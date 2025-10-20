const { Order } = require("../../models");
const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Tìm tất cả order có ít nhất 1 product của seller
        const orders = await Order.find()
            .populate({
                path: "items.product",
                match: { seller: sellerId },
                select: "name price images"
            })
            .populate("address")
            .populate({
                path: "user",        // populate user để lấy thông tin khách hàng
                select: "name email" // lấy tên và email khách
            })
            .sort({ createdAt: -1 });

        // Lọc những order không còn item nào sau khi match
        const filteredOrders = orders.filter(order => order.items.length > 0);

        res.json(filteredOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const updateSellerOrderStatus = async (req, res) => {
    try {
        const sellerId = req.user?.id || req.user?.sub;
        const { orderId, status } = req.body;

        // Kiểm tra status hợp lệ
        const validStatus = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Completed", "Refunded"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Lấy order và populate product trong items
        const order = await Order.findById(orderId).populate({
            path: "items.product",
            populate: { path: "seller", select: "_id name" }
        });

        if (!order) return res.status(404).json({ error: "Order not found" });

        let updatedCount = 0;

        // Cập nhật trạng thái cho các sản phẩm thuộc seller
        order.items.forEach(item => {
            const sellerIdInItem = item.product?.seller?.toString();
            if (sellerIdInItem === sellerId) {
                item.status = status;
                updatedCount++;
            }
        });

        // Nếu tất cả sản phẩm của seller có cùng status → cập nhật order.status
        const sellerItems = order.items.filter(
            item => item.product?.seller?.toString() === sellerId
        );

        const allSameStatus = sellerItems.every(item => item.status === status);
        if (allSameStatus && sellerItems.length > 0) {
            order.status = status;
        }

        order.markModified("items");
        await order.save();

        res.json({
            message: `Đã cập nhật trạng thái cho ${updatedCount} sản phẩm của seller.`,
            order,
        });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ error: "Server error" });
    }
};



module.exports = {
    getSellerOrders,
    updateSellerOrderStatus,
};