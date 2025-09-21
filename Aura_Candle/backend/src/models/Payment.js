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
            enum: ["COD", "Momo", "VNPay", "PayPal", "Stripe"],
            default: "COD",
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Success", "Failed"],
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

const Payment = mongoose.model("Payment", paymentSchema, "payments");
module.exports = Payment;

