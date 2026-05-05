const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        method: {
            type: String,
            enum: ["COD", "Bank", "E-Wallet", "VNPay", "Momo"],
            default: "COD",
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Success", "Failed", "Refunded"],  // thêm Refunded
            default: "Pending",
        },
        transactionId: {
            type: String, // ID trả về từ cổng thanh toán
            default: "",
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema, "payments");
module.exports = Payment;

