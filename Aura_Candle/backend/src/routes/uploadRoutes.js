const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

// Cấu hình Multer lưu trực tiếp lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // 📂 thư mục chứa ảnh trên Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

// Upload 1 ảnh
router.post("/", upload.single("image"), async (req, res) => {
    try {
        res.json({
            message: "Upload thành công",
            url: req.file.path, // ✅ đường dẫn Cloudinary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi upload ảnh" });
    }
});

module.exports = router;
