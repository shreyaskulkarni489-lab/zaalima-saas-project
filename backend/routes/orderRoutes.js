const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// ==========================
// CREATE ORDER
// ==========================
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

      // Clear Cart
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


// ==========================
// GET CUSTOMER ORDERS
// ==========================
router.get(
  "/",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const orders = await Order.find({
        customer: req.user.id,
      })
        .populate("products.product")
        .sort({ createdAt: -1 });

      res.status(200).json(orders);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==========================
// GET SINGLE ORDER
// ==========================
router.get(
  "/:id",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const order = await Order.findById(req.params.id)
        .populate("products.product");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json(order);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==========================
// CANCEL ORDER
// ==========================
router.put(
  "/cancel/:id",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = "Cancelled";

      await order.save();

      res.status(200).json({
        message: "Order Cancelled Successfully",
        order,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==========================
// UPDATE ORDER STATUS
// ==========================
router.put(
  "/status/:id",
  protect,
  authorize("vendor", "admin"),
  async (req, res) => {
    try {

      const { status } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.status = status;

      await order.save();

      res.status(200).json({
        message: "Order Status Updated Successfully",
        order,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==========================
// GET ALL ORDERS (ADMIN)
// ==========================
router.get(
  "/all",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {

      const orders = await Order.find()
        .populate("customer")
        .populate("products.product");

      res.status(200).json(orders);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


module.exports = router;