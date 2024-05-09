const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthControllers");
const { imageUpload } = require("../middlewares/middleImgUpload");
const { verifyToken } = require("../middlewares/verifyToken");
// Register route / Register route / Register route / Register route / Register route
router.post("/register", AuthController.register);
// login route / login route / login route / login route / login route / login route
router.post("/login", AuthController.login);
// Get a single user by ID / Get a single user by ID / Get a single user by ID
router.get("/:id", verifyToken, AuthController.getUserById);
// update user password and image / update user password and image / update user password and image
router.put(
  "/:id/update-profile",
  verifyToken,
  imageUpload,
  AuthController.updateUserById
);

module.exports = router;
