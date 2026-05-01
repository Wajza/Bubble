const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("productId", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get reviews",
      error: error.message,
    });
  }
});

// CREATE review
router.post("/", async (req, res) => {
  try {
    const { userId, productId, userName, text, rating } = req.body;

    if (!productId || !userName || !text) {
      return res.status(400).json({
        message: "Product, user name, and review text are required",
      });
    }

    const review = new Review({
      userId,
      productId,
      userName,
      text,
      rating: rating || 5,
    });

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
});

module.exports = router;