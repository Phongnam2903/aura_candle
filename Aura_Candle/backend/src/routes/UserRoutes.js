const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController/authController");
const { verifyToken } = require("../middleware/auth");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/google-login", AuthController.googleLogin);
router.post("/change-password", verifyToken, AuthController.changePassword);


module.exports = router;
