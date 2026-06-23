const express = require("express");
const cors = require("cors");
require("dotenv").config();
const storeRoutes = require("./routes/storeRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const User = require("./models/User");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use("/api/vendor", vendorRoutes);
app.get("/", (req, res) => {
  res.send("Zaalima API is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

