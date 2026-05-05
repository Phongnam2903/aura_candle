const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    shopAvatar: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    address: {
      province: { type: String, default: "" },
      district: { type: String, default: "" },
      ward: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Banned"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

shopSchema.index({ owner: 1 }, { unique: true }); // mỗi user chỉ có 1 shop
shopSchema.index({ status: 1 });                   // admin filter theo status

module.exports = mongoose.model("Shop", shopSchema, "shops");
