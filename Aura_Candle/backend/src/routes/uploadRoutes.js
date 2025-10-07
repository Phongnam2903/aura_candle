const express = require("express");
const router = express.Router();
const { upload, uploadFiles } = require("../controllers/UploadController/uploadController");

// Upload nhiều ảnh
router.post("/", upload.array("files"), uploadFiles);

module.exports = router;
