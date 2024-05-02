const Products = require("../models/Products");

exports.createProduct = async (req, res) => {
  const { name, description, price, category, quantity, likes } = req.body;
  const image = req.image;

  console.log("Uploaded image:", req.image);

  const product = new Products({
    name,
    description,
    price,
    category,
    quantity,
    image,
    likes,
  });
  try {
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 10;
  const totalCount = await Products.countDocuments();
  const totalPages = Math.ceil(totalCount / pageSize);
  try {
    const products = await Products.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
