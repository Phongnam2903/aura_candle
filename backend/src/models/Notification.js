// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true }, // Ví dụ: "Đặt hàng thành công!"
        message: { type: String, required: true }, // Nội dung chi tiết
        type: {
            type: String,
            enum: ["Order", "Payment", "System", "Promotion", "Blog"],
            default: "System",
        },
        relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Nếu có
        relatedBlog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }, // Nếu có
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, createdAt: -1 });
const Notification = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = Notification;
