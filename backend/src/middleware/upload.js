// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * Tạo middleware upload ảnh lên Cloudinary
 * @param {string} folder - Tên thư mục muốn lưu trên Cloudinary (vd: "products", "categories")
 */
const createUpload = (folder = "general") => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder, // 📁 thư mục động
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        },
    });

    return multer({ storage });
};

module.exports = createUpload;
