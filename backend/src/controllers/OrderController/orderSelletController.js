const { Order, Notification } = require("../../models");
const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { paymentStatus, search } = req.query;

        // Build base query filter
        const queryFilter = {};

        // Filter theo paymentStatus nếu có
        if (paymentStatus && paymentStatus !== "all") {
            const validPaymentStatuses = ["unpaid", "paid", "failed", "refunded", "processing"];
            if (validPaymentStatuses.includes(paymentStatus)) {
                queryFilter.paymentStatus = paymentStatus;
            }
        }

        // Tìm tất cả order có ít nhất 1 product của seller
        let orders = await Order.find(queryFilter)
            .populate({
                path: "items.product",
                match: { seller: sellerId },
                select: "name price images"
            })
            .populate("address")
            .populate({
                path: "user",
                select: "name email phone"
            })
            .sort({ createdAt: -1 });

        // Lọc những order không còn item nào sau khi match seller
        orders = orders.filter(order => order.items.length > 0);

        // Filter theo tên hoặc số điện thoại khách hàng (sau populate)
        if (search && search.trim()) {
            const keyword = search.trim().toLowerCase();
            orders = orders.filter(order => {
                const nameMatch = (order.user?.name || "").toLowerCase().includes(keyword);
                const phoneMatch = (order.user?.phone || "").toLowerCase().includes(keyword);
                return nameMatch || phoneMatch;
            });
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const updateSellerOrderStatus = async (req, res) => {
    try {
        const sellerId = (req.user?.id || req.user?.sub)?.toString();
        const { orderId, status, paymentStatus } = req.body; // Thêm paymentStatus

        // Validate status nếu có
        if (status) {
            const validStatus = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Completed", "Refunded"];
            if (!validStatus.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }
        }

        // Validate paymentStatus nếu có
        if (paymentStatus) {
            const validPaymentStatus = ["unpaid", "paid", "failed", "refunded", "processing"];
            if (!validPaymentStatus.includes(paymentStatus)) {
                return res.status(400).json({ error: "Invalid payment status" });
            }
        }

        // Lấy order
        const order = await Order.findById(orderId).populate({
            path: "items.product",
            populate: { path: "seller", select: "_id name" },
        });

        if (!order) return res.status(404).json({ error: "Order not found" });

        // ⚠️ KHÔNG CHO PHÉP CẬP NHẬT nếu đơn hàng đã bị HỦY
        if (order.status === "Cancelled") {
            return res.status(400).json({ 
                error: "Không thể cập nhật đơn hàng đã bị hủy.",
                currentStatus: order.status
            });
        }

        // ⚠️ KHÔNG CHO PHÉP HỦY nếu đã SHIPPED hoặc sau đó
        if (status === "Cancelled") {
            const nonCancellableStatuses = ["Shipped", "Delivered", "Completed"];
            if (nonCancellableStatuses.includes(order.status)) {
                return res.status(400).json({ 
                    error: `Không thể hủy đơn hàng đã ${order.status}. Vui lòng liên hệ hỗ trợ.`,
                    currentStatus: order.status
                });
            }
        }

        let updatedCount = 0;

        // Nếu có update paymentStatus, update trực tiếp
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
            
            // Nếu confirm payment (unpaid → paid), tự động update status thành Confirmed
            if (paymentStatus === "paid" && order.status === "Pending") {
                order.status = "Confirmed";
            }
        }

        // Nếu có update status, cập nhật items của seller
        if (status) {
            //  Cập nhật trạng thái từng sản phẩm của seller
            order.items.forEach((item) => {
                const sellerIdInItem =
                    item.product?.seller?._id?.toString() || item.product?.seller?.toString();
                if (sellerIdInItem === sellerId) {
                    item.status = status;
                    updatedCount++;
                }
            });

            //  Nếu tất cả sản phẩm của seller này có cùng status => cập nhật trạng thái đơn
            const sellerItems = order.items.filter(
                (item) =>
                    (item.product?.seller?._id?.toString() || item.product?.seller?.toString()) === sellerId
            );

            const allSameStatus = sellerItems.every((item) => item.status === status);
            if (allSameStatus && sellerItems.length > 0) {
                order.status = status;

                // Nếu đơn hàng hoàn thành thì cập nhật paymentStatus = "paid"
                if (status === "Completed") {
                    order.paymentStatus = "paid";
                }
            }
        }

        order.markModified("items");
        await order.save();

        // 🔔 Gửi notification cho user
        try {
            const notificationData = getNotificationMessage(order, paymentStatus, status);
            
            if (notificationData) {
                await Notification.create({
                    user: order.user,
                    title: notificationData.title,
                    message: notificationData.message,
                    type: "Order",
                    relatedOrder: order._id,
                });
                console.log("✅ Notification sent to user:", order.user);
            }
        } catch (notifError) {
            console.error("⚠️ Failed to send notification:", notifError);
            // Không block response nếu notification fail
        }

        return res.json({
            ok: true,
            message: paymentStatus 
                ? "Đã xác nhận thanh toán!" 
                : `Đã cập nhật trạng thái cho ${updatedCount} sản phẩm của seller.`,
            order,
        });
    } catch (err) {
        console.error("❌ Error updating order:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

// Helper function: Tạo notification message theo trạng thái
function getNotificationMessage(order, paymentStatus, status) {
    const orderCode = order.orderCode || order._id.toString().slice(-8);
    
    // Notification cho payment confirmation
    if (paymentStatus === "paid") {
        return {
            title: "💰 Thanh toán đã được xác nhận!",
            message: `Đơn hàng ${orderCode} của bạn đã được xác nhận thanh toán. Chúng tôi sẽ xử lý đơn hàng ngay.`
        };
    }
    
    // Notification cho status updates
    if (status) {
        switch (status) {
            case "Confirmed":
                return {
                    title: "✅ Đơn hàng đã được xác nhận!",
                    message: `Đơn hàng ${orderCode} đã được xác nhận. Chúng tôi đang chuẩn bị hàng cho bạn.`
                };
            case "Shipped":
                return {
                    title: "🚚 Đơn hàng đang được giao!",
                    message: `Đơn hàng ${orderCode} đã được giao cho đơn vị vận chuyển. Bạn sẽ nhận hàng sớm thôi!`
                };
            case "Delivered":
                return {
                    title: "📦 Đơn hàng đã được giao!",
                    message: `Đơn hàng ${orderCode} đã được giao đến bạn. Cảm ơn bạn đã mua hàng!`
                };
            case "Completed":
                return {
                    title: "🎉 Đơn hàng hoàn tất!",
                    message: `Đơn hàng ${orderCode} đã hoàn tất. Cảm ơn bạn! Hãy đánh giá sản phẩm nhé.`
                };
            case "Cancelled":
                return {
                    title: "❌ Đơn hàng đã bị hủy",
                    message: `Đơn hàng ${orderCode} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ chúng tôi.`
                };
            case "Refunded":
                return {
                    title: "💸 Đơn hàng đã hoàn tiền",
                    message: `Đơn hàng ${orderCode} đã được hoàn tiền. Tiền sẽ về tài khoản trong 3-5 ngày.`
                };
            default:
                return null;
        }
    }
    
    return null;
}


// Lấy chi tiết 1 đơn hàng cho seller
const getSellerOrderById = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { id } = req.params;

        // Tìm order và populate đầy đủ thông tin
        const order = await Order.findById(id)
            .populate({
                path: "items.product",
                populate: { path: "seller", select: "name email" }
            })
            .populate("address")
            .populate({
                path: "user",
                select: "name email phone"
            });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        console.log("📦 Order address:", order.address);
        console.log("📦 Order user:", order.user);

        // Kiểm tra xem order có chứa sản phẩm của seller này không
        const hasSellerProduct = order.items.some(
            item => item.product?.seller?._id?.toString() === sellerId
        );

        if (!hasSellerProduct) {
            return res.status(403).json({ error: "You don't have permission to view this order" });
        }

        // Lọc chỉ hiển thị items của seller này
        const orderObj = order.toObject();
        const filteredOrder = {
            ...orderObj,
            items: orderObj.items.filter(
                item => item.product?.seller?._id?.toString() === sellerId
            )
        };

        console.log("📦 Filtered order address:", filteredOrder.address);

        res.json(filteredOrder);
    } catch (err) {
        console.error("Get seller order by ID error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getSellerOrders,
    updateSellerOrderStatus,
    getSellerOrderById,
};