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
});

module.exports = mongoose.model("Chat", ChatSchema);
