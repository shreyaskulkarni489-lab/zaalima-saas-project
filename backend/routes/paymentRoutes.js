const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Order = require("../models/Order");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// CREATE PAYMENT
router.post(
  "/create",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const { orderId, paymentMethod } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const payment = new Payment({
        customer: req.user.id,
        order: orderId,
        amount: order.totalAmount,
        paymentMethod,
      });

      await payment.save();

      res.status(201).json({
        message: "Payment Created Successfully",
        payment,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// PAYMENT SUCCESS
router.put(
  "/success/:id",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      payment.paymentStatus = "Success";
      payment.transactionId = "TXN" + Date.now();

      await payment.save();

      await Order.findByIdAndUpdate(
        payment.order,
        {
          status: "Paid",
        }
      );

      res.status(200).json({
        message: "Payment Successful",
        payment,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// PAYMENT FAILURE
router.put(
  "/failure/:id",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const payment = await Payment.findById(req.params.id);

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      payment.paymentStatus = "Failed";

      await payment.save();

      res.status(200).json({
        message: "Payment Failed",
        payment,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// GET CUSTOMER PAYMENTS
router.get(
  "/",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const payments = await Payment.find({
        customer: req.user.id,
      }).populate("order");

      res.status(200).json(payments);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;