const Products = require("../models/Products");
// creat new product / creat new product / creat new product / creat new product
exports.createProduct = async (req, res) => {
  const { name, price, category, quantity, likes } = req.body;
  const image = req.image;
  const userID = req.params.userID;
  const product = new Products({
    name,
    price,
    category,
    quantity,
    image,
    likes,
    owner: userID,
  });
  try {
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get all products of all shops
exports.getAllProducts = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 10;
  let query = {};

  try {
    const { categories, search } = req.query;

    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray };
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }
    const totalCount = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);
    const products = await Products.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products from a shop by owner id
exports.getAllProductsByOwner = async (req, res) => {
  const ownerId = req.params.ownerId;
  const page = req.query.page || 1;
  const pageSize = 10;
  let query = { owner: ownerId };

  try {
    const { categories, search } = req.query;

    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray };
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }
    const totalCount = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);
    const products = await Products.find(query)
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
  const { name, price, category, quantity, likes } = req.body;
  const image = req.image;
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        category,
        quantity,
        image,
        likes,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

// update Product Description / update Product Description
exports.updateProductDescription = async (req, res) => {
  const { description, extraInfo, color, size, tiktok, instagram } = req.body;
  const newImageDescriptions = req.imageDescriptions || [];

  const newColor = color || [];
  const newSize = size || [];
  const newTiktok = tiktok || [];
  const newInstagram = instagram || [];
  try {
    // Retrieve the existing product to get the current imageDescription
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Append new ellement to their existing arrays
    const updatedImageDescription = (product.imageDescription || []).concat(
      newImageDescriptions
    );

    const updateNewColor = (product.color || []).concat(newColor);
    const updateNewSize = (product.size || []).concat(newSize);
    const updateNewTiktok = (product.tiktok || []).concat(newTiktok);
    const updateNewInstagram = (product.instagram || []).concat(newInstagram);

    // Update the product with the new description and imageDescription
    const updatedDescription = await Products.findByIdAndUpdate(
      req.params.id,
      {
        description,
        extraInfo,
        imageDescription: updatedImageDescription,
        color: updateNewColor,
        size: updateNewSize,
        tiktok: updateNewTiktok,
        instagram: updateNewInstagram,
      },
      { new: true }
    );

    if (!updatedDescription) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedDescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Like or Unlike a product
exports.toggleLikeProduct = async (req, res) => {
  const userId = req.params.userID;
  const productId = req.params.id;

  try {
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isLiked = product.likes.includes(userId);

    if (isLiked) {
      // Unlike the product
      product.likes.pull(userId);
    } else {
      // Like the product
      product.likes.push(userId);
    }

    await product.save();

    res.json({ likes: product.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a product quantity after successful purchase
exports.updateProductQuantity = async (req, res) => {
  const { quantity } = req.body;
  const userID = req.params.userId;
  const productId = req.params.id;
  if (!userID) {
    return res.status(404).json({ message: "User not found" });
  }

  if (quantity === undefined || typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { $set: { quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
