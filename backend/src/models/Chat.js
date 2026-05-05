const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [
        {
            from: { type: String, enum: ["user", "bot"], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

// Index để tìm chat của user
ChatSchema.index({ user: 1 });

// Giới hạn: chỉ lưu tối đa 200 tin nhắn gần nhất khi save
ChatSchema.pre("save", function (next) {
    if (this.messages.length > 200) {
        this.messages = this.messages.slice(-200); // giữ 200 tin cuối
    }
    next();
});

module.exports = mongoose.model("Chat", ChatSchema);
