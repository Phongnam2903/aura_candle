// src/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Cấu hình lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // thư mục gốc/uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /upload  =>  upload nhiều file
router.post("/", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      error: { status: 400, message: "No files were uploaded." },
    });
  }

  // Trả về đường dẫn public cho từng file
  const uploadedFiles = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(200).json({
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });
});

module.exports = router;
