const cloudinary = require("../../config/cloudinary");
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // 📁 thư mục trong Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

export const uploadProductImage = upload.single("image"); // field name = "image"
