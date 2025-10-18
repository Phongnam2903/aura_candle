const express = require("express");
const router = express.Router();

const { getSellerDashboardStats } = require("../controllers/Dashboard/dashboardController");
const { verifyToken } = require("../middleware/auth");

router.get("/seller", verifyToken, getSellerDashboardStats);

module.exports = router;
