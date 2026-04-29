const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Add to cart
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity, customOptions } = req.body;

    let existingItem = null;

    if (!customOptions) {
      existingItem = await Cart.findOne({ userId, productId });
    }

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const cartItem = new Cart({
      userId,
      productId,
      quantity: quantity || 1,
      customOptions
    });
    await cartItem.save();

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Get user cart
router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// Update quantity
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart item" });
  }
});

module.exports = router;