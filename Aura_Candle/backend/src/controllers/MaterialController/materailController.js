// controllers/materialController.js
const Material = require("../../models/Material");

// API: Thêm nguyên liệu mới
const createMaterial = async (req, res) => {
  try {
    const { name, sku, unit, pricePerUnit, stockQuantity, vendor } = req.body;

    //lấy id người tạo từ token
    const userId = req.user.id;


    // Kiểm tra trùng SKU
    const existing = await Material.findOne({ sku });
    if (existing) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const material = new Material({
      name,
      sku,
      unit,
      pricePerUnit,
      stockQuantity,
      vendor,
      createBy: userId,
    });

    await material.save();

    res.status(201).json({
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create material", error });
  }
};

module.exports = { createMaterial };
