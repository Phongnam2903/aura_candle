const { Product, Order, Address } = require("../../models");

// Checkout (tạo đơn hàng)
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware verifyToken
        const { shippingInfo, items, payment } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 1. Tạo Address mới
        const address = new Address({
            user: userId,
            specificAddress: shippingInfo.address,
            street: shippingInfo.ward, // map tùy ý
            ward: shippingInfo.ward,
            district: shippingInfo.district,
            city: shippingInfo.province,
            isDefault: true,
        });
        await address.save();

        // 2. Lấy giá sản phẩm thực tế từ DB và trừ stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `${product.name} is out of stock` });
            }

            product.stock -= item.quantity;
            await product.save();

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });

            totalAmount += product.price * item.quantity;
        }

        // 3. Map payment method từ frontend
        const paymentMap = {
            COD: "COD",
            Bank: "Bank",
            Momo: "E-Wallet",
            ZaloPay: "E-Wallet"
        };

        // 4. Tạo Order
        const order = new Order({
            user: userId,
            address: address._id,
            items: orderItems,
            totalAmount,
            paymentMethod: paymentMap[payment] || "COD",
        });

        await order.save();

        return res.status(201).json({ message: "Order created successfully", order });
    } catch (err) {
        console.error("Create order error:", err);
        res.status(500).json({ error: "Server error" });
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
