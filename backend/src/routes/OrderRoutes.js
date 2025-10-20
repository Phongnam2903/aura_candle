const express = require("express");

const { verifyToken } = require("../middleware/auth");
const orderController = require("../controllers/OrderController/orderController");
const { Order } = require("../models");
const router = express.Router();

// Tạo đơn hàng (checkout) - cần login
router.post("/checkout", verifyToken, orderController.createOrder);

// Lấy danh sách đơn hàng của user
router.get("/my-orders", verifyToken, orderController.getMyOrders);

// Lấy chi tiết đơn hàng
router.get("/:id", verifyToken, orderController.getOrderById);

router.put("/:id/cancel", verifyToken, async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId).populate("user"); // buyer
        if (!order) return res.status(404).json({ ok: false, message: "Đơn hàng không tồn tại" });

        if (["Completed", "Cancelled"].includes(order.status)) {
            return res.status(400).json({
                ok: false,
                message: `Đơn hàng đã ${order.status}, không thể hủy`,
            });
        }

        // Cập nhật trạng thái đơn và tất cả items
        order.status = "Cancelled";
        order.items = order.items.map((item) => ({ ...item.toObject(), status: "Cancelled" }));
        await order.save();

        // 🔹 Gửi thông báo cho seller
        if (order.seller) {
            await Notification.create({
                user: order.seller, // seller nhận thông báo
                title: "Đơn hàng đã bị hủy",
                message: `Khách hàng ${order.user.name} đã hủy đơn #${order._id}`,
                relatedOrder: order._id,
            });
        }

        return res.json({ ok: true, message: "Đơn hàng đã được hủy thành công", data: order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Hủy đơn thất bại", error: err.message });
    }
});


module.exports = router;
