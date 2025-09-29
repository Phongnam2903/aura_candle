const Category = require("../../models/Category");

// [GET] Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh mục" });
    }
};

// [GET] Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh mục" });
    }
};

// [POST] Tạo danh mục
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = new Category({ name, description, image });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi tạo danh mục" });
    }
};

// [PUT] Cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, image },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi cập nhật danh mục" });
    }
};

// [DELETE] Xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }
        res.json({ message: "Đã xóa danh mục thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi xóa danh mục" });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
