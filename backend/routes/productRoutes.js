const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Store = require("../models/Store");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/create",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const {
        productName,
        description,
        price,
        storeId,
      } = req.body;

      const store = await Store.findById(storeId);

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      const product = new Product({
        productName,
        description,
        price,
        store: storeId,
      });

      await product.save();

      res.status(201).json({
        message: "Product Created Successfully",
        product,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;