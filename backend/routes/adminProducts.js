const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bubble-products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// GET all products for admin
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// ADD product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      stock,
      scent,
      skinType,
      ingredients,
      isCustomizable,
      theme,
    } = req.body;

    if (!name || price === undefined || !description || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, description, and stock are required",
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        message: "Price and stock must be positive numbers",
      });
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      image: req.file ? req.file.path : req.body.image || "",
      scent: scent || "",
      skinType: normalizeArray(skinType),
      ingredients: normalizeArray(ingredients),
      isCustomizable: isCustomizable === "true" || isCustomizable === true,
      theme: theme || "pink",
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (updatedData.price !== undefined) {
      updatedData.price = Number(updatedData.price);

      if (updatedData.price < 0) {
        return res.status(400).json({
          message: "Price cannot be negative",
        });
      }
    }

    if (updatedData.stock !== undefined) {
      updatedData.stock = Number(updatedData.stock);

      if (updatedData.stock < 0) {
        return res.status(400).json({
          message: "Stock cannot be negative",
        });
      }
    }

    if (updatedData.ingredients !== undefined) {
      updatedData.ingredients = normalizeArray(updatedData.ingredients);
    }

    if (updatedData.skinType !== undefined) {
      updatedData.skinType = normalizeArray(updatedData.skinType);
    }

    if (updatedData.isCustomizable !== undefined) {
      updatedData.isCustomizable =
        updatedData.isCustomizable === "true" ||
        updatedData.isCustomizable === true;
    }

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;