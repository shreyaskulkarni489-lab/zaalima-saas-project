const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Store = require("../models/Store");
const upload = require("../middleware/uploadMiddleware");

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

// GET PRODUCTS BY STORE
router.get(
  "/store/:storeId",
  async (req, res) => {
    try {
      const products = await Product.find({
        store: req.params.storeId,
      });

      res.status(200).json(products);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// image upload route
router.post(
  "/upload-image",
  protect,
  authorize("vendor"),
  upload.single("image"),
  async (req, res) => {
    try {
      res.status(200).json({
        message: "Image Uploaded Successfully",
        imageUrl: req.file.path,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;