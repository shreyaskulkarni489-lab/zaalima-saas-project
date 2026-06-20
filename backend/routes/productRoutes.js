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

// SEARCH PRODUCTS
router.get("/search", async (req, res) => {
  try {

    const keyword = req.query.keyword;

    const products = await Product.find({
      productName: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// FILTER PRODUCTS BY PRICE
router.get("/filter", async (req, res) => {
  try {

    const minPrice = Number(req.query.min) || 0;
    const maxPrice = Number(req.query.max) || Number.MAX_SAFE_INTEGER;

    const products = await Product.find({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE PRODUCT
router.put(
  "/update/:id",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const { productName, description, price, image } = req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      product.productName = productName || product.productName;
      product.description = description || product.description;
      product.price = price || product.price;
      product.image = image || product.image;

      await product.save();

      res.status(200).json({
        message: "Product Updated Successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// DELETE PRODUCT
router.delete(
  "/delete/:id",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      await Product.findByIdAndDelete(req.params.id);

      res.json({
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;