const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController/authController");
const UserController = require("../controllers/UserController/userController");
const { verifyToken } = require("../middleware/auth");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/google-login", AuthController.googleLogin);
router.post("/change-password", verifyToken, AuthController.changePassword);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);

router.get("/profile/:id", verifyToken, UserController.getUserById);
router.post("/changeInformation/:id", verifyToken, UserController.updateInforUser)

module.exports = router;
