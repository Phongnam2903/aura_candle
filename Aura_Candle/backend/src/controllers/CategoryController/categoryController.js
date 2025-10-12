const Category = require("../../models/Category");
const cloudinary = require("../../config/cloudinary");

// =============================
// [GET] Lấy tất cả danh mục
// =============================
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh mục" });
    }
};

// =============================
// [GET] Lấy danh mục theo ID
// =============================
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

// =============================
// [POST] Tạo danh mục (có upload ảnh)
// =============================
// [POST] Tạo danh mục
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        let imageUrl = image || ""; // nếu frontend gửi URL thì dùng luôn

        // Nếu có upload file mới thì ghi đè
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "categories",
            });
            imageUrl = result.secure_url;
        }

        console.log("📥 Nhận dữ liệu từ frontend:", { name, description, image, file: req.file });
        console.log("✅ Ảnh sẽ lưu vào DB:", imageUrl);

        const category = new Category({
            name,
            description,
            image: imageUrl,
        });

        await category.save();
        console.log("💾 Category saved:", category);

        res.status(201).json({
            message: "Tạo danh mục thành công",
            category,
        });
    } catch (err) {
        console.error("❌ Create category error:", err);
        res.status(500).json({ message: "Lỗi tạo danh mục" });
    }
};

// =============================
// [PUT] Cập nhật danh mục (có upload ảnh mới)
// =============================
const updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const updateData = { name, description };

        // 🖼️ Nếu multer (CloudinaryStorage) đã upload ảnh mới
        if (req.file && req.file.path) {
            updateData.image = req.file.path; // Multer đã có sẵn link Cloudinary
        }
        // 🧩 Nếu không có file mới nhưng có sẵn URL trong body → giữ nguyên ảnh cũ
        else if (image) {
            updateData.image = image;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: "❌ Không tìm thấy danh mục" });
        }

        res.status(200).json({
            message: "✅ Cập nhật danh mục thành công",
            category,
        });
    } catch (err) {
        console.error("🔥 Update category error:", err);
        res.status(500).json({ message: "Lỗi server khi cập nhật danh mục" });
    }
};

// =============================
// [DELETE] Xóa danh mục
// =============================
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
