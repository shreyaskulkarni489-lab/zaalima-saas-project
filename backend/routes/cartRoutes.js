const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ADD TO CART
router.post(
  "/add",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // Find customer's cart
      let cart = await Cart.findOne({
        customer: req.user.id,
      });

      if (!cart) {
        cart = new Cart({
          customer: req.user.id,
          products: [],
        });
      }

      // Check if product already exists in cart
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();

      res.status(200).json({
        message: "Product Added To Cart",
        cart,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
// GET CUSTOMER CART
router.get(
  "/",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const cart = await Cart.findOne({
        customer: req.user.id,
      }).populate("products.product");

      if (!cart) {
        return res.status(404).json({
          message: "Cart is empty",
        });
      }

      res.status(200).json(cart);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;