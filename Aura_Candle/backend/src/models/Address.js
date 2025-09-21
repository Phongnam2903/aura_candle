// models/Address.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    phone: String,
    street: String,
    city: String,
    district: String,
    ward: String,
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema, "address");
module.exports = Address;

