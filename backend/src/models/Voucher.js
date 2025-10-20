// models/Voucher.js
const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
});

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");
module.exports = Voucher;
