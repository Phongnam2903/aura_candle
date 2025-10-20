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
        relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Nếu có
        isRead: { type: Boolean, default: false },

        //  Thả tim
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        //  Bình luận
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: String,
                rating: { type: Number, min: 1, max: 5 },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = Notification;
