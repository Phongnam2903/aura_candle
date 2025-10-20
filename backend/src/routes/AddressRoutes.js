const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const AddressController = require("../controllers/AddressController/addressController");


// Create
router.post("/", verifyToken, AddressController.createAddress);

// Get all by user
router.get("/:userId", verifyToken, AddressController.getAddressesByUser);

// Get single
router.get("/detail/:id", verifyToken, AddressController.getAddressById);

// Update
router.put("/:id", verifyToken, AddressController.updateAddress);

// Delete
router.delete("/:id", verifyToken, AddressController.deleteAddress);

module.exports = router;
