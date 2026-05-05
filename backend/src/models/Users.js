// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  password: { type: String, required: true },
  phone: { type: String, required: true, trim: true, match: /^[0-9]{10,11}$/ },
  role: { type: String, enum: ["customer", "admin", "seller"], default: "customer" },
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  avatar: { type: String, default: "" },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

userSchema.index({ role: 1, status: 1 });    // filter user theo role
userSchema.index({ status: 1 });              // admin ban user

module.exports = mongoose.model("User", userSchema, "users");

