// routes/materialRoutes.js
const express = require("express");
const router = express.Router();
const MaterialController = require("../controllers/MaterialController/materailController");
const { verifyToken, authorize } = require("../middleware/auth");
// POST /api/materials
router.post("/", verifyToken, authorize("seller"), MaterialController.createMaterial);

router.get("/", MaterialController.getMaterials);
router.get("/:id", MaterialController.getMaterialById);

// UPDATE
router.put("/:id", verifyToken, authorize("seller"), MaterialController.updateMaterial);

// Delete
router.delete("/:id", verifyToken, authorize("seller"), MaterialController.deleteMaterial);
module.exports = router;
