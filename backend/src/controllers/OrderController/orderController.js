const { Product, Order, Address, Notification } = require("../../models");

// Checkout (tạo đơn hàng)
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // lấy từ middleware verifyToken
        const { addressId, items, payment } = req.body;

        console.log(`[Order] POST /order/checkout — userId: ${userId}`);
        console.log(`[Order] Payload:`, JSON.stringify({ addressId, payment, itemCount: items?.length }));

        if (!items || items.length === 0) {
            console.warn('[Order] ❌ Cart is empty');
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 1. Kiểm tra addressId hợp lệ
        console.log(`[Order] Bước 1 — Kiểm tra address: ${addressId}`);
        const address = await Address.findOne({ _id: addressId, user: userId });
        if (!address) {
            console.warn(`[Order] ❌ Address not found: ${addressId} cho user ${userId}`);
            return res.status(404).json({ error: "Address not found" });
        }
        console.log(`[Order] ✅ Address OK: ${address._id}`);

        // 2. Lấy giá sản phẩm thực tế từ DB và trừ stock
        console.log(`[Order] Bước 2 — Xử lý ${items.length} sản phẩm`);
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            console.log(`[Order]   → productId: ${item.productId}, qty: ${item.quantity}`);
            const product = await Product.findById(item.productId);
            if (!product) {
                console.warn(`[Order] ❌ Product not found: ${item.productId}`);
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                console.warn(`[Order] ❌ Out of stock: ${product.name} (stock: ${product.stock}, req: ${item.quantity})`);
                return res.status(400).json({ error: `${product.name} is out of stock` });
            }

            // Giảm tồn kho
            product.stock -= item.quantity;
            await product.save();

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });

            totalAmount += product.price * item.quantity;
        }
        console.log(`[Order] ✅ Tổng tiền: ${totalAmount}`);

        // 3. Map payment method từ frontend
        const paymentMap = {
            COD: "COD",
            Bank: "Bank",
            Momo: "E-Wallet",
            ZaloPay: "E-Wallet"
        };

        // 4. Tạo mã đơn hàng (orderCode)
        // Prefix "DH" khớp với filter trong SePay dashboard
        const random = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `DH${Date.now()}${random}`;
        console.log(`[Order] Bước 4 — orderCode: ${orderCode}, paymentMethod: ${paymentMap[payment] || 'COD'}`);

        // 5. Tạo Order
        console.log(`[Order] Bước 5 — Lưu Order vào DB`);
        const order = new Order({
            user: userId,
            address: address._id,
            items: orderItems,
            totalAmount,
            paymentMethod: paymentMap[payment] || "COD",
            status: "Pending",
            orderCode,
        });

        await order.save();
        console.log(`[Order] ✅ Order saved: ${order._id}`);

        // 6. Tạo Notification
        try {
            await Notification.create({
                user: userId,
                title: "Đặt hàng thành công!",
                message: `Bạn đã đặt đơn hàng ${orderCode} với tổng số tiền ${totalAmount.toLocaleString()}₫.`,
                type: "Order",
                relatedOrder: order._id,
            });
            console.log("[Order] ✅ Notification created");
        } catch (notifErr) {
            console.error("[Order] ⚠️ Notification create failed (không ảnh hưởng đơn hàng):", notifErr.message);
        }

        // 7. Trả phản hồi cho frontend
        console.log(`[Order] ✅ Checkout thành công — orderCode: ${orderCode}`);
        return res.status(201).json({
            ok: true,
            message: "Đặt hàng thành công!",
            orderCode,
            totalAmount,
            order,
        });
    } catch (err) {
        console.error("[Order] ❌ createOrder CRASHED:");
        console.error("  Message:", err.message);
        console.error("  Stack:", err.stack);
        // Trả về lỗi chi tiết (chỉ dùng khi dev, bỏ err.message ở production)
        res.status(500).json({
            error: "Server error",
            detail: err.message,       // ← Giúp frontend/Postman thấy lỗi cụ thể
            field: err.path || null    // ← Nếu là lỗi validation MongoDB
        });
    }
};



// Lấy danh sách đơn hàng của user
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product", "name price images")
            .populate("address");
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
            .populate("items.product", "name price images")
            .populate("address");
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
};
