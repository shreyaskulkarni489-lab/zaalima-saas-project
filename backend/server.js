const express = require("express");
const cors = require("cors");
require("dotenv").config();
const storeRoutes = require("./routes/storeRoutes");

const User = require("./models/User");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Zaalima API is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

