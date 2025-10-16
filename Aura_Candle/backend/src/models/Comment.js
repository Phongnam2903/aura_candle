const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        content: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //ai thả tim
        isDeleted: { type: Boolean, default: false }, // nếu thu hồi
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
