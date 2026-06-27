const express = require("express");
const router = express.Router();

const Store = require("../models/Store");


const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const Order = require("../models/Order");

const Product = require("../models/Product");
router.get(
  "/dashboard",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const stores = await Store.find({
        owner: req.user.id,
      });

      const storeIds = stores.map(store => store._id);

      const products = await Product.find({
        store: { $in: storeIds },
      });

      res.status(200).json({
        totalStores: stores.length,
        totalProducts: products.length,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// GET VENDOR ORDERS
router.get(
  "/orders",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {

      // Find vendor stores
      const stores = await Store.find({
        owner: req.user.id,
      });

      const storeIds = stores.map(store => store._id);

      // Find vendor products
      const products = await Product.find({
        store: { $in: storeIds },
      });

      const productIds = products.map(product => product._id);

      // Find orders containing vendor products
      const orders = await Order.find({
        "products.product": { $in: productIds },
      })
        .populate("customer")
        .populate("products.product");

      res.status(200).json({
        totalOrders: orders.length,
        orders,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;