const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ADD PRODUCT TO WISHLIST
router.post(
  "/add",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const { productId } = req.body;

      let wishlist = await Wishlist.findOne({
        customer: req.user.id,
      });

      if (!wishlist) {
        wishlist = new Wishlist({
          customer: req.user.id,
          products: [],
        });
      }

      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }

      await wishlist.save();

      res.status(200).json({
        message: "Product Added To Wishlist",
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// GET WISHLIST
router.get(
  "/",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const wishlist = await Wishlist.findOne({
        customer: req.user.id,
      }).populate("products");

      res.status(200).json(wishlist);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// REMOVE PRODUCT FROM WISHLIST
router.delete(
  "/remove/:productId",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const wishlist = await Wishlist.findOne({
        customer: req.user.id,
      });

      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist not found",
        });
      }

      wishlist.products = wishlist.products.filter(
        product => product.toString() !== req.params.productId
      );

      await wishlist.save();

      res.status(200).json({
        message: "Product Removed From Wishlist",
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;