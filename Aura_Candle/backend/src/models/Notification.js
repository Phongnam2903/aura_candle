// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true }, // Ví dụ: "Đặt hàng thành công!"
        message: { type: String, required: true }, // Nội dung chi tiết
        type: {
            type: String,
            enum: ["Order", "Payment", "System", "Promotion"],
            default: "System",
        },
        relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // nếu có
        isRead: { type: Boolean, default: false }, // đã đọc hay chưa
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = Notification;
