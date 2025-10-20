const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specificAddress: { type: String, required: true }, 
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema, "addresses");
