const express = require("express");
const router = express.Router();

const Store = require("../models/Store");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/create",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const { storeName, description } = req.body;

      const store = new Store({
        storeName,
        description,
        owner: req.user.id,
      });

      await store.save();

      res.status(201).json({
        message: "Store Created Successfully",
        store,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
module.exports = router;