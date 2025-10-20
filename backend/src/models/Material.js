const mongoose = require('mongoose');

// Schema cho Material (nguyên liệu)
const MaterialSchema = new mongoose.Schema({
  // Tên nguyên liệu (ví dụ: Sáp ong, Tinh dầu Lavender)
  name: { type: String, required: true },

  // Mã SKU duy nhất để quản lý nguyên liệu (không trùng nhau)
  sku: { type: String, unique: true, index: true },

  // Đơn vị tính: gram, ml, cái (default = gram)
  unit: { type: String, default: 'gram' },

  // Giá tiền cho mỗi đơn vị (vd: 500 VND / gram)
  pricePerUnit: { type: Number, default: 0 },

  // Số lượng tồn kho (tính theo unit ở trên)
  stockQuantity: { type: Number, default: 0 },

  // Nhà cung cấp nguyên liệu
  vendor: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Ngày tạo (tự động lấy ngày hiện tại)
  createdAt: { type: Date, default: Date.now }
});

// Tạo model Material từ schema
const Material = mongoose.model('Material', MaterialSchema, "materials");

module.exports = Material;
