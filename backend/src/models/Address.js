const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    province: { type: String, default: "" },
    district: { type: String, default: "" },
    ward: { type: String, default: "" },
    specificAddress: { type: String, required: true }, // số nhà, đường
    recipientName: { type: String, default: "" },       // tên người nhận
    recipientPhone: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model("Address", addressSchema, "addresses");
