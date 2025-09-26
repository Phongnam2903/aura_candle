const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true, match: /^[0-9]{10,11}$/ },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema, "addresses");

