const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/create",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const cart = await Cart.findOne({
        customer: req.user.id,
      }).populate("products.product");

      if (!cart || cart.products.length === 0) {
        return res.status(404).json({
          message: "Cart is empty",
        });
      }

      let totalAmount = 0;

      cart.products.forEach((item) => {
        totalAmount += item.product.price * item.quantity;
      });

      const order = new Order({
        customer: req.user.id,
        products: cart.products,
        totalAmount,
      });

      await order.save();

      // Clear cart
      cart.products = [];
      await cart.save();

      res.status(201).json({
        message: "Order Created Successfully",
        order,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;