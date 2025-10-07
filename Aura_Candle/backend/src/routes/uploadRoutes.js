const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

// Cấu hình Multer lưu trực tiếp lên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // 📂 thư mục chứa ảnh
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

// ✅ Upload nhiều ảnh
router.post("/", upload.array("files", 10), async (req, res) => {
    try {
        const urls = req.files.map((file) => file.path); // Cloudinary tự trả URL ở file.path
        res.json({
            message: "Upload thành công",
            files: urls, // gửi mảng URL về frontend
        });
    } catch (error) {
        console.error("Lỗi upload:", error);
        res.status(500).json({ message: "Lỗi upload ảnh" });
    }
});

module.exports = router;
