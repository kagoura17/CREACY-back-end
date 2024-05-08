const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductsControllers");
const { imageUpload } = require("../Middlewares/MiddleImgUpload");
const { verifyToken } = require("../middlewares/verifyToken");
// Create a new product
router.post(
  "/:userID",
  verifyToken,
  imageUpload,
  ProductController.createProduct
);

// Get all products
router.get("/", verifyToken, ProductController.getAllProducts);

// Get a single product by ID
router.get("/:id", verifyToken, ProductController.getProductById);

// Update a product by ID
router.put(
  "/:id",
  verifyToken,
  imageUpload,
  ProductController.updateProductById
);

// Delete a product by ID
router.delete("/:id", verifyToken, ProductController.deleteProductById);

module.exports = router;
