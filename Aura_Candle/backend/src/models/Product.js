const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    weightGrams: Number,
    isActive: { type: Boolean, default: true },
    images: [String],
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
    isKit: { type: Boolean, default: false },
    // Thêm mùi hương
    fragrance: { type: String }, // lưu 1 mùi hương
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema, "products");
module.exports = Product;
