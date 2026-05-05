// models/Banner.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: String,
    imageUrls: [{ type: String }],
    linkUrl: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // thứ tự hiển thị
}, { timestamps: true });

bannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const Banner = mongoose.model("Banner", bannerSchema, "banners");
module.exports = Banner;
