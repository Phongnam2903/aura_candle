// models/Banner.js
const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: String,
    imageUrls: [{ type: String }],  
    linkUrl: String,
    startDate: Date,
    endDate: Date,
});

const Banner = mongoose.model("Banner", bannerSchema, "banners");
module.exports = Banner;
