const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController/categoryController");
const { verifyToken, authorize } = require("../middleware/auth");

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.post(
    "/",
    verifyToken,
    authorize("seller"),
    CategoryController.createCategory
);

router.put(
    "/:id",
    verifyToken,
    authorize("seller"),
    CategoryController.updateCategory
);

router.delete(
    "/:id",
    verifyToken,
    authorize("seller"),
    CategoryController.deleteCategory
);

module.exports = router;