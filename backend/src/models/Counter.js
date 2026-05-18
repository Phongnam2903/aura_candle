const mongoose = require("mongoose");

/**
 * Counter — Atomic sequence counter dùng cho các mã tự tăng (orderCode, v.v.)
 *
 * Mỗi document là 1 counter riêng biệt, ví dụ:
 *   { _id: "orderCode", seq: 42 }
 *
 * Dùng findOneAndUpdate + $inc để đảm bảo atomic —
 * kể cả 1000 request đồng thời cũng không bao giờ ra số trùng.
 */
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // tên counter, ví dụ: "orderCode"
    seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
