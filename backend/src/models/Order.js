// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Completed", "Refunded"],
        default: "Pending"
    },
});


const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    orderCode: { type: String, unique: true }, // Mã đơn hàng để tracking
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Completed", "Refunded"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Bank", "E-Wallet", "VNPay", "Momo"],
        default: "COD"
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed", "refunded", "processing"],
        default: "unpaid"
    }
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Tự động sinh orderCode trước khi save: DH000001, DH000002...
// Dùng để nhận dạng giao dịch chuyển khoản qua SePay (prefix khớp với filter SePay = "DH")
orderSchema.pre('save', async function () {
    if (!this.orderCode) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderCode = `DH${String(count + 1).padStart(6, '0')}`;
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

