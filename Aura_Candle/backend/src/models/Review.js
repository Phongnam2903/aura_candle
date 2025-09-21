// models/Review.js
const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema, "reviews");
module.exports = Review;
