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
    materials: [{
        material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
        quantity: { type: Number, required: true } // in material.unit (eg grams, ml, pieces)
    }],
    isKit: { type: Boolean, default: false }, // kit bán nguyên liệu
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema, "products");
module.exports = Product;


