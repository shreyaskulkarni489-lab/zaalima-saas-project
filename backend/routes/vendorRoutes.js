const express = require("express");
const router = express.Router();

const Store = require("../models/Store");
const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

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

module.exports = router;