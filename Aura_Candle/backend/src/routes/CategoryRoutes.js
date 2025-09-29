const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController/categoryController");
const { verifyToken, authorize } = require("../middleware/auth");

router.get("/", CategoryController.getAllCategories);

module.exports = router;