const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    const order = new Order({
      userId,
      items,
      totalPrice,
      status: "Processing",
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// GET orders for one user
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user orders" });
  }
});

// GET one order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order ID" });
  }
});

// UPDATE order status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

module.exports = router;