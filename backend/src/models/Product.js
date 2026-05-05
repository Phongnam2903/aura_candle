const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    weightGrams: Number,
    isActive: { type: Boolean, default: true },
    images: [String],
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material", default: [] }],
    isKit: { type: Boolean, default: false },
    fragrances: { type: [String], default: [] },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});
ProductSchema.index({ seller: 1, isActive: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', ProductSchema, "products");
module.exports = Product;

