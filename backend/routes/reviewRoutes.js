const express = require("express");
const router = express.Router();

const Review = require("../models/Review");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ADD REVIEW
router.post(
  "/add",
  protect,
  authorize("customer"),
  async (req, res) => {
    try {

      const { productId, rating, review } = req.body;

      const newReview = new Review({
        customer: req.user.id,
        product: productId,
        rating,
        review,
      });

      await newReview.save();

      res.status(201).json({
        message: "Review Added Successfully",
        newReview,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// GET REVIEWS OF A PRODUCT
router.get("/product/:productId", async (req, res) => {
  try {

    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("customer");

    res.status(200).json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;