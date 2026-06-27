const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

const protect = require("../middleware/authMiddleware");

// GET USER NOTIFICATIONS
router.get("/", protect, async (req, res) => {
  try {

    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// MARK NOTIFICATION AS READ
router.put("/:id", protect, async (req, res) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;