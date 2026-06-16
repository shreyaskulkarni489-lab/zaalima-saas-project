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

// GET MY STORE
router.get(
  "/my-store",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const store = await Store.findOne({
        owner: req.user.id,
      });

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      res.status(200).json(store);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// update store
router.put(
  "/update",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const { storeName, description } = req.body;

      const store = await Store.findOne({
        owner: req.user.id,
      });

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      store.storeName = storeName || store.storeName;
      store.description = description || store.description;

      await store.save();

      res.status(200).json({
        message: "Store Updated Successfully",
        store,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// DELETE STORE
router.delete(
  "/delete/:id",
  protect,
  authorize("vendor"),
  async (req, res) => {
    try {
      const store = await Store.findById(req.params.id);

      if (!store) {
        return res.status(404).json({
          message: "Store not found",
        });
      }

      await Store.findByIdAndDelete(req.params.id);

      res.json({
        message: "Store Deleted Successfully",
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// GET ALL STORES
// GET ALL STORES (ADMIN ONLY)
router.get(
  "/",
  protect,
  authorize("superadmin"),
  async (req, res) => {
    try {
      const stores = await Store.find().populate(
        "owner",
        "name email role"
      );

      res.status(200).json(stores);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
module.exports = router;