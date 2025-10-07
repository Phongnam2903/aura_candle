const cloudinary = require("../../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình nơi lưu file trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "aura_candles", // tên folder trong Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });

// Controller xử lý upload
const uploadFiles = async (req, res) => {
    try {
        const files = req.files.map((file) => file.path); // Cloudinary tự trả URL
        res.json({ success: true, files });
    } catch (error) {
        console.error("Lỗi upload:", error);
        res.status(500).json({ success: false, message: "Lỗi upload ảnh" });
    }
};

module.exports = { upload, uploadFiles };
