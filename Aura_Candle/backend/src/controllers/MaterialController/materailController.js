const Material = require("../../models/Material");

//  Tạo mới nguyên liệu
const createMaterial = async (req, res) => {
  try {
    const { name, sku, unit, pricePerUnit, stockQuantity, vendor } = req.body;
    const userId = req.user?.id; // lấy từ middleware auth (nếu có)

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
      createdBy: userId,
    });

    await material.save();
    res.status(201).json({ message: "Material created successfully", material });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create material", error: error.message });
  }
};

//  Lấy danh sách tất cả nguyên liệu
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch materials", error: error.message });
  }
};

//  Lấy chi tiết 1 nguyên liệu
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material", error: error.message });
  }
};

// Cập nhật nguyên liệu
const updateMaterial = async (req, res) => {
  try {
    const { name, sku, unit, pricePerUnit, stockQuantity, vendor } = req.body;
    const id = req.params.id;

    // Nếu người dùng đổi SKU, cần kiểm tra trùng
    if (sku) {
      const duplicate = await Material.findOne({ sku, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    const material = await Material.findByIdAndUpdate(
      id,
      { name, sku, unit, pricePerUnit, stockQuantity, vendor },
      { new: true, runValidators: true }
    );

    if (!material) return res.status(404).json({ message: "Material not found" });

    res.json({ message: "Material updated successfully", material });
  } catch (error) {
    res.status(500).json({ message: "Failed to update material", error: error.message });
  }
};

// Xóa nguyên liệu
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete material", error: error.message });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
