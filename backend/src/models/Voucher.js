// models/Voucher.js
const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },//(cho loại percent)
    startDate: Date,
    endDate: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

voucherSchema.index({ code: 1 });
voucherSchema.index({ endDate: 1, isActive: 1 });// query voucher còn hạn

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");
module.exports = Voucher;
