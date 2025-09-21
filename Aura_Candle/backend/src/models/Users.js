// models/User.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  street: String,
  city: String,
  district: String,
  ward: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ["customer", "admin", "seller"], default: "customer" },
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
  addresses: [addressSchema],
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");
module.exports = User;

