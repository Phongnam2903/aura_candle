// routes/materialRoutes.js
const express = require("express");
const router = express.Router();
const { createMaterial } = require("../controllers/MaterialController/materailController");
// POST /api/materials
router.post("/createMaterial", createMaterial);

module.exports = router;
