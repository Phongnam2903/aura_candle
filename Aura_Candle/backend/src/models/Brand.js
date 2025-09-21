// models/Brand.js
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Brand = mongoose.model("Brand", brandSchema, "brands");
module.exports = Brand;