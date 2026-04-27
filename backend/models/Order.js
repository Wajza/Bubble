const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,

      customization: {
        scent: String,
        color: String,
        ingredients: [String]
      }
    }
  ],

  totalPrice: Number,

  status: {
    type: String,
    default: "Processing"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);