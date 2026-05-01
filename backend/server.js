const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cartRoutes = require("./routes/cart");
const customOptionRoutes = require("./routes/customOptions");
const wishlistRoutes = require("./routes/wishlist");

const adminRoutes = require("./routes/admin");
const adminInventoryRoutes = require("./routes/adminInventory");
const adminOrdersRoutes = require("./routes/adminOrders");

const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const promotionRoutes = require("./routes/promotions");
const reviewRoutes = require("./routes/reviews");

const app = express(); 

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/custom-options", customOptionRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/inventory", adminInventoryRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/admin/promotions", promotionRoutes);
app.use("/api/admin/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));