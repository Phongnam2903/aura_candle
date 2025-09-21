const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController/authController");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/google-login", AuthController.googleLogin);

module.exports = router;
